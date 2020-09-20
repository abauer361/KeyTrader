# Key Trader

## Installation
* Dependencies
    * Node v12
    * Mariadb v10.3
    * Nginx
    * Discord Developer Account
    * Visual Studio Code (Optional)
        * SFTP by liximomo

* Create Discord App at https://discord.com/developers/applications
    * Add OAuth2 redirects, where `<hostname>` is `<protocol>://<url>` (http/https followed by ip or domain name)
        * `<hostname>/api/discord/addServer`
        * `<hostname>/api/discord/callback`
        * `<hostname>/login`

* Edit environment files to the server setup accordingly
    * Rename and configure  `./webapp/key-trader/example.env.txt` -> `./webapp/key-trader/.env`
    * Rename and configure `./webapp/key-trader/src/environments/example.environment.local.ts` -> `./webapp/key-trader/src/environments/environment.local.ts`

* Configure Nginx
    * Copy `./nginxConf/keytrader` to nginx config (`/etc/nginx/sites-available`)
    * Add to `sites-enabled` by linking `sudo ln -s /etc/nginx/sites-availabe/keytrader /etc/nginx/sites-enabled`

* Configure Mariadb
    * Run the sql commands in `./dbSqlFiles/initialCreation.sql`

* Configure the Bot
    * Create `./discordbot/bot-token.json` with a single string containing Discord Bot token

* Install the node packages for both webapp and bot
    * `cd ./discordbot` and `npm install`
    * `cd ./webapp/key-trader` and `npm install`

* (Optional) Configure Visual Studio Code
    * Rename and configure `./.vscode/example.launch.json` -> `./.vscode/launch.json`
    * Rename and configure `./.vscode/example.sftp.json` -> `./.vscode/sftp.json`

* (Optional) Configure for Angular Builds (not using development server)
    * Link the angular build directory to `/var/www/html`
        * `sudo ln -s <projectLocation>/keytrader/webapp/key-trader/dist/key-trader/ /var/www/html`

## Running the Project
* Start the Backend
    * `cd ./webapp/key-trader` and `npm start:server`
* Start the frontend development server
    * `cd ./webapp/key-trader` and `npm start`
* Start the Discord Bot
    * `cd ./discord/src` and `node ktbot.js`
