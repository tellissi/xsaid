xSaid fetches the actual Mastodon-Rss Feed and displays it on your site. 

# Setup
Define Domain, Username of your Mastodon-Instance in the /content/config.json. 
Also setup a nickname, which will appear over the content.
# Execute
1. head to the directory "content": with cd content
2. node server.js
3. crtl +c 
4. request this url from a cronjob-service: :3000/run-rss-downloader 

 