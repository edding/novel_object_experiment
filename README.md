# Novel Object Experiment

Website for the novel object experiment

The website is built with: https://expressjs.com/.
To install necessary dependencies, run `npm install` from the root directory. This is only necessary when you first run the website or the dependencies changed.

To start the website in dev mode, run `npm start` in the root directory then go to http://localhost:3000/

To start the website in prod mode, you need to install a process manager, so that when the service crash, it will restart automatically. We use pm2: https://pm2.keymetrics.io/docs/usage/quick-start/

To install pm2, run `npm install pm2 -g`

To start the website in prod mode, run `pm2 start app.js --interpreter=node --node-args="./bin/www"`. You can check the status of all running service with `pm2 list`
