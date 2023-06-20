const express = require('express');
const https = require('https');
const fs = require('fs');
const config = require('./config.json');

const app = express();
const port = 3000;

let lastModifiedTime = fs.statSync('./config.json').mtimeMs;

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

function checkConfigChanges() {
    fs.stat('./config.json', (err, stats) => {
        if (err) {
            console.error('Fehler beim Überprüfen der Konfigurationsdatei:', err);
            return;
        }

        const modifiedTime = stats.mtimeMs;
        if (modifiedTime > lastModifiedTime) {
            console.log('Änderungen in der Konfigurationsdatei erkannt. Aktualisiere den RSS-Feed.');
            lastModifiedTime = modifiedTime;
            downloadRSSFeed();
        }
    });
}

app.get('/', (req, res) => {
    res.send('RSS-Feed Server');
});

app.get('/run-rss-downloader', checkIP, (req, res) => {
    checkConfigChanges();
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