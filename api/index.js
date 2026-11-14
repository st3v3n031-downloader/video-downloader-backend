const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');

const app = express();
app.use(cors());

app.get('/api/download', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL tidak boleh kosong' });
  }

  try {
    // Menambahkan opsi header agar mirip browser asli dan tidak mudah diblokir
    const output = await youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: [
        'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ]
    });

    const videoUrl = output.url || (output.formats && output.formats.slice(-1)[0].url);

    res.json({
      platform: output.extractor_key,
      title: output.title || 'Media Download',
      thumbnail: output.thumbnail,
      downloadUrl: videoUrl
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memproses URL. Platform memblokir server atau link privat.' });
  }
});

module.exports = app;
