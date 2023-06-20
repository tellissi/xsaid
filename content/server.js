const express = require('express');
const https = require('https');
const fs = require('fs');
const config = require('./config.json');

const app = express();
const port = 3000;

// Domain des RSS-Feeds aus der Konfigurationsdatei lesen
const rssFeedDomain = config.rssFeedDomain;

// Benutzername aus der Konfigurationsdatei lesen
const username = config.username;

// URL des RSS-Feeds zusammensetzen
const rssFeedUrl = rssFeedDomain + '/@' + username + '.rss';

// Funktion zum Herunterladen des RSS-Feeds
function downloadRSSFeed() {
    console.log('RSS-Feed-URL:', rssFeedUrl); // Ausgabe der Download-URL

    https.get(rssFeedUrl, (response) => {
        let rssFeed = '';

        response.on('data', (chunk) => {
            rssFeed += chunk;
        });

        response.on('end', () => {
            // Vorherige Datei löschen
            if (fs.existsSync('actualfeed.rss')) {
                fs.unlinkSync('actualfeed.rss');
            }

            // Neue Datei speichern
            fs.writeFileSync('actualfeed.rss', rssFeed);

            console.log('RSS-Feed erfolgreich heruntergeladen und aktualisiert.');
        });
    }).on('error', (error) => {
        console.log('Fehler beim Herunterladen des RSS-Feeds:', error);
    });
}

// Route zum manuellen Herunterladen des RSS-Feeds
app.get('/run-rss-downloader', (req, res) => {
    downloadRSSFeed();
    res.send('RSS-Feed-Downloader gestartet.');
});

// Start des Servers
app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
});