// Vercel Serverless Function: api/upload.js
// Handles image upload from builder and returns permanent public HTTPS URL

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, filename } = req.body || {};
    if (!image) {
      return res.status(400).json({ error: 'Tidak ada data gambar (image)' });
    }

    // Extract base64 data and mime type
    const matches = image.match(/^data:(image\/[a-zA-Z0-9\+\-\.]+);base64,(.+)$/);
    let mimeType = 'image/jpeg';
    let base64Data = image;

    if (matches) {
      mimeType = matches[1];
      base64Data = matches[2];
    } else {
      base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const ext = mimeType.split('/')[1] || 'jpg';
    const uploadName = filename || `undangan-${Date.now()}.${ext}`;

    const blob = new Blob([buffer], { type: mimeType });
    const fd = new FormData();
    fd.append('reqtype', 'fileupload');
    fd.append('fileToUpload', blob, uploadName);

    const uploadRes = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: fd
    });

    const fileUrl = (await uploadRes.text()).trim();
    if (fileUrl.startsWith('http')) {
      return res.status(200).json({ success: true, url: fileUrl });
    } else {
      return res.status(500).json({ error: fileUrl || 'Gagal mengunggah gambar ke server' });
    }
  } catch (err) {
    console.error('Upload handler error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
