const express = require('express');
const https = require('https');
const fs = require('fs');
const config = require('./config.json');

const app = express();
const port = 3000;

const rssFeedDomain = config.rssFeedDomain;
const username = config.username;
const rssFeedUrl = rssFeedDomain + '/@' + username + '.rss';

function downloadRSSFeed() {
    https.get(rssFeedUrl, (response) => {
        let rssFeed = '';

        response.on('data', (chunk) => {
            rssFeed += chunk;
        });

        response.on('end', () => {
            if (fs.existsSync('actualfeed.rss')) {
                fs.unlinkSync('actualfeed.rss');
            }

            fs.writeFileSync('actualfeed.rss', rssFeed);

            console.log('RSS-Feed erfolgreich heruntergeladen und aktualisiert.');
        });
    }).on('error', (error) => {
        console.log('Fehler beim Herunterladen des RSS-Feeds:', error);
    });
}

app.get('/', (req, res) => {
    res.send('RSS-Feed Server');
});

app.get('/run-rss-downloader', checkIP, (req, res) => {
    downloadRSSFeed();
    res.send('RSS-Feed-Downloader gestartet.');
});

function checkIP(req, res, next) {
    const clientIP = req.ip;

    const allowedIPs = config.allowedIPs;

    if (allowedIPs.includes(clientIP)) {
        next();
    } else {
        res.status(403).send(`Zugriff verweigert für IP-Adresse: ${clientIP}`);
    }
}

app.listen(port, () => {
    console.log(`Server gestartet auf Port ${port}`);
});