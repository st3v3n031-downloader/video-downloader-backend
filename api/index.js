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
    const output = await youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
    });

    const videoUrl = output.url || (output.formats && output.formats.slice(-1)[0].url);

    res.json({
      platform: output.extractor_key,
      title: output.title || 'Media Download',
      thumbnail: output.thumbnail,
      downloadUrl: videoUrl
    });

  } catch (error) {
    res.status(500).json({ error: 'Gagal memproses URL. Pastikan link valid atau tidak privat.' });
  }
});

module.exports = app;
