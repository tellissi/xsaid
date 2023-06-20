xSaid fetches the actual Mastodon-Rss Feed and displays it on your site. 

# Setup
1. Go to **/content/config.json**
2. Define **Domain**, **Username** on your Mastodon-Instance and also a nickname, which will appear over the content.
3. Also add one ore mutiple IPs from a cronjob-service like [cron-job.org](https://cron-job.org). For this f. E.     195.201.26.157, 116.203.134.67, 116.203.129.16, 23.88.105.37 and 128.140.8.200 [(source)](https://cron-job.org/en/faq/).
# Execute
1. head to the directory "content": with cd content
2. node server.js
3. crtl +c 
4. request this url from a cronjob-service: **:3000/run-rss-downloader**

 