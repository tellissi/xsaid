const https = require('https');
const fs = require('fs');
const config = require('./config.json');

// Domain des RSS-Feeds aus der Konfigurationsdatei lesen
const rssFeedDomain = config.rssFeedDomain;

// Benutzername aus der Konfigurationsdatei lesen
const username = config.username;

// URL des RSS-Feeds zusammensetzen
const rssFeedUrl = rssFeedDomain + '/@' + username + '.rss';

// Funktion zum Herunterladen des RSS-Feeds
function downloadRSSFeed() {
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

// Funktion zum periodischen Herunterladen des RSS-Feeds
function scheduleRSSFeedDownload() {
    // Sofortiger Download beim Start
    downloadRSSFeed();

    // Wiederholter Download alle Stunde
    setInterval(downloadRSSFeed, 60 * 60 * 1000); // 60 Minuten * 60 Sekunden * 1000 Millisekunden
}

// Start des Skripts
scheduleRSSFeedDownload();