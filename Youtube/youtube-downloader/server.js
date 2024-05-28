const express = require('express');
const ytdl = require('ytdl-core');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/download', (req, res) => {
  const videoUrl = req.body.url;
  
  if (!videoUrl) {
    return res.status(400).send('URL is required');
  }

  try {
    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    ytdl(videoUrl, { format: 'mp4' }).pipe(res);
  } catch (error) {
    res.status(500).send('Error downloading video');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
