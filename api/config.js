// Vercel Serverless Function: api/config.js
// Stores and retrieves client invitation configuration in Cloud storage

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb'
    }
  }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. SAVE CONFIG (POST)
  if (req.method === 'POST') {
    try {
      const { client, configData } = req.body || {};
      if (!configData) {
        return res.status(400).json({ error: 'Data config tidak boleh kosong' });
      }

      const clientName = client ? client.replace(/[^a-zA-Z0-9_-]/g, '') : 'general';
      const jsonStr = JSON.stringify(configData);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const fd = new FormData();
      fd.append('reqtype', 'fileupload');
      fd.append('fileToUpload', blob, `cfg-${clientName}-${Date.now()}.json`);

      // Upload to Catbox
      const catRes = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        body: fd
      });

      const catUrl = (await catRes.text()).trim();
      if (catUrl.startsWith('http')) {
        // Extract 6-character short hash (e.g. https://files.catbox.moe/1bx0zg.json -> 1bx0zg)
        const match = catUrl.match(/\/([a-zA-Z0-9_-]+)\.json$/);
        const cloudId = match ? match[1] : '';
        return res.status(200).json({ success: true, url: catUrl, cloudId: cloudId });
      }

      return res.status(500).json({ error: 'Gagal menyimpan config ke cloud' });
    } catch (err) {
      console.error('Config save error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  }

  // 2. RETRIEVE CONFIG (GET)
  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Parameter id diperlukan' });
    }

    try {
      const cleanId = id.replace(/[^a-zA-Z0-9_-]/g, '');
      const fetchRes = await fetch(`https://files.catbox.moe/${cleanId}.json`);
      if (fetchRes.ok) {
        const data = await fetchRes.json();
        return res.status(200).json(data);
      }
      return res.status(404).json({ error: 'Config tidak ditemukan' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
