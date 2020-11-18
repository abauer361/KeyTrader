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
        * `<hostname>/api/discord/addServer`
        * `<hostname>/api/discord/callback`
        * `<hostname>/login`

* Edit environment file accordingly
    * Rename and configure  `example.env.txt` -> `.env`
    * Note db user is 'test' and pass is '1234' unless changed


* (Optional) Configure Visual Studio Code
    * Rename and configure `./.vscode/example.launch.json` -> `./.vscode/launch.json`
    * Rename and configure `./.vscode/example.sftp.json` -> `./.vscode/sftp.json`

## Running the Project
* Build the Project
    * `docker-compose build`
* Start the Project
    * `docker-compose up`
