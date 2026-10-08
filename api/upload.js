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

    // 1. Try Catbox.moe (Permanent Hosting)
    try {
      const uploadRes = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: fd
      });

      const fileUrl = (await uploadRes.text()).trim();
      if (fileUrl.startsWith('http')) {
        return res.status(200).json({ success: true, url: fileUrl });
      }
    } catch (catboxErr) {
      console.warn('Catbox upload failed, trying fallback:', catboxErr);
    }

    // 2. Fallback to Uguu.se
    try {
      const uguuFd = new FormData();
      uguuFd.append('files[]', blob, uploadName);
      const uguuRes = await fetch('https://uguu.se/upload', {
        method: 'POST',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: uguuFd
      });
      const uguuData = await uguuRes.json();
      if (uguuData && uguuData.success && uguuData.files && uguuData.files[0]?.url) {
        return res.status(200).json({ success: true, url: uguuData.files[0].url });
      }
    } catch (uguuErr) {
      console.warn('Uguu upload failed:', uguuErr);
    }

    return res.status(500).json({ error: 'Gagal mengunggah gambar ke cloud storage' });
  } catch (err) {
    console.error('Upload handler error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
