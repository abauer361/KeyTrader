# Key Trader

## Installation
* Dependencies
    * Node v12
    * Mariadb v10.3
    * Nginx
    * Docker
    * Docker Compose
    * Discord Developer Account
    * Visual Studio Code (Optional)
        * SFTP by liximomo

* Create Discord App at https://discord.com/developers/applications
    * Add OAuth2 redirects, where `<hostname>` is `<protocol>://<url>` (http/https followed by ip or domain name)
        * `localhost/api/discord/addServer`
        * `localhost/api/discord/callback`
        * `localhost/login`

* Edit environment files to the server setup accordingly
    * Rename and configure  `./backend/files/key-trader/example.env.txt` -> `./webapp/key-trader/.env`
    * Note db user is 'test' and pass is '1234' unless changed

* Configure the Bot
    * Create `./discordBot/bot-token.json` with a single string containing Discord Bot token

* (Optional) Configure Visual Studio Code
    * Rename and configure `./.vscode/example.launch.json` -> `./.vscode/launch.json`
    * Rename and configure `./.vscode/example.sftp.json` -> `./.vscode/sftp.json`

* (Optional) Configure for Angular Builds (not using development server)
    * Link the angular build directory to `/var/www/html`
        * `sudo ln -s <projectLocation>/keytrader/webapp/key-trader/dist/key-trader/ /var/www/html`

## Running the Project
* Build the Project
    * `docker-compose build`
* Start the Project
    * `docker-compose up`
