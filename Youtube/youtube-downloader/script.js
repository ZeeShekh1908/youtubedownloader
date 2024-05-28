const express = require('express');
const bodyParser = require('body-parser');
const youtubedl = require('youtube-dl');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/api/download', (req, res) => {
    const videoUrl = req.body.url;
    if (!videoUrl) {
        return res.status(400).send('URL is required');
    }

    const video = youtubedl(videoUrl, ['--format=best'], { cwd: __dirname });

    video.on('info', function(info) {
        console.log('Download started');
        console.log('filename: ' + info._filename);
        console.log('size: ' + info.size);

        res.setHeader('Content-Disposition', `attachment; filename="${info._filename}"`);
        video.pipe(res);
    });

    video.on('error', function error(err) {
        console.error('Error:', err);
        res.status(500).send('Failed to download video');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
