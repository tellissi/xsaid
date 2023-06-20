const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();
const port = 3000;

// Funktion zum Herunterladen des RSS-Feeds und Aktualisieren der Datei
function downloadAndSaveRSSFeed() {
    // Lese die Konfigurationsdatei
    const config = JSON.parse(fs.readFileSync('./config.json'));

    // Domain des RSS-Feeds aus der Konfigurationsdatei lesen
    const rssFeedDomain = config.rssFeedDomain;

    // Benutzername aus der Konfigurationsdatei lesen
    const username = config.username;

    // URL des RSS-Feeds zusammensetzen
    const rssFeedUrl = rssFeedDomain + '/@' + username + '.rss';

    console.log('RSS-Feed-URL:', rssFeedUrl); // Ausgabe der Download-URL

    https.get(rssFeedUrl, (response) => {
        let rssFeed = '';

        response.on('data', (chunk) => {
            rssFeed += chunk;
        });

        response.on('end', () => {
            // Neue Datei speichern
            fs.writeFile('actualfeed.rss', rssFeed, (err) => {
                if (err) {
                    console.error('Fehler beim Speichern des RSS-Feeds:', err);
                } else {
                    console.log('RSS-Feed erfolgreich heruntergeladen und aktualisiert.');
                }
            });
        });
    }).on('error', (error) => {
        console.log('Fehler beim Herunterladen des RSS-Feeds:', error);
    });
}

// Route zum manuellen Herunterladen und Aktualisieren des RSS-Feeds
app.get('/run-rss-downloader', (req, res) => {
    downloadAndSaveRSSFeed();
    res.send('RSS-Feed-Downloader gestartet.');
});

// Start des Servers
app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
});