var mariadb = require('mariadb');
exports.MODE_TEST = 'mode_test';
exports.MODE_PRODUCTION = 'mode_production';

var state = {
    pool: null,
    mode: null
};

exports.connect = function (mode, done) {
    state.pool = mariadb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PW,
      database: 'keytrader'
    });
    // state.pool = mariadb.createPool({
    //     socketPath: '/var/run/mysqld/mysqld.sock',
    //     user: 'root',
    //     password: '1234',
    //     database: 'KeyTrader'
    // });

    state.mode = mode;
    done();
};

exports.get = function () {
    return state.pool;
};

exports.getUsers = function (successCb, errCb) {
    var sql = "SELECT * FROM Users;";
    this.get().query(sql).then(successCb).catch(errCb);
}

//Create a User
exports.createUser = function (id, userName, Discord_Token, successCb, errCb){
    var sql = "INSERT INTO Users(U_ID, User_Name, Discord_Token) values(?, ?, ?) ON DUPLICATE KEY UPDATE Discord_Token = ?;";
    this.get()
    .query(
        {sql: sql},
        [id, userName, Discord_Token, Discord_Token]
    )
    .then(successCb)
    .catch(errCb);
}
//Add a Game key
exports.addKey= function (guildid, keyID, keyName, keyPrice, keyString, successCb, errCb) {
    var sql = "INSERT INTO Game_Keys(Server_ID, Key_ID, Key_name, Key_price, Key_string) values(?, ?, ?, ?, ?); ";
    this.get()
        .query(
            {sql:sql},
            [guildid, keyID, keyName, keyPrice, keyString]
        )
        .then(successCb)
        .catch(errCb);
}


exports.addServer = function(serverID, serverName, serverLink, successCb, errCb){
    var sql = "INSERT INTO Discord_Servers(Server_ID, Server_Name, Server_Link) values (?, ?, ?) ON DUPLICATE KEY UPDATE Server_Name = ?;";
    this.get()
        .query(
            {sql:sql},
            [serverID, serverName, serverLink, serverName]
        )
        .then(successCb)
        .catch(errCb)
}

//Get from key to server
exports.getLocationofKey = function(keyName, successCb, errCb){
    var sql = "SELECT Server_ID FROM Game_Keys WHERE Key_string = ?;";
    this.get()
    .query(
        {sql: sql},
        [keyName]
    )
    .then(successCb)
    .catch(errCb);
}

//adding roles as an admin
exports.addRole = function(roleName, serverID, successCb, errCb){
    var sql = "INSERT INTO Roles(Role_Name, User_Role_ID, Server_ID) VALUES (?, ?, ?) ";
    this.get()
        .query(
            {sql: sql},
            [roleName, 1, serverID]
        )
        .then(successCb)
        .catch(errCb);
}

//redeem a key
exports.redeemKey = function(keyString, userID, successCb, errCb){
    var sql = "UPDATE Game_Keys SET U_ID = ? WHERE Key_string = ?;";
    this.get()
    .query(
        {sql: sql},
        [userID, keyString]
    )
    .then(successCb)
    .catch(errCb);
}

exports.getUserKeys = function(userID, successCb, errCb) {
    var sql = "SELECT * FROM Game_Keys WHERE U_ID = ?";
    this.get()
    .query(
        {sql: sql},
        [userID]
    )
    .then(successCb)
    .catch(errCb);
}

exports.getLinkedServers = function( successCb, errCb){
    var sql = "SELECT * from Discord_Servers;"
    this.get().query(sql).then(successCb).catch(errCb);
}

//See all game keys from a server
exports.getKeys = function (serverIDCheck, successCb, errCb) {
    var sql = "SELECT * FROM Game_Keys WHERE Server_ID = ? AND U_ID IS NULL;";
    this.get()
        .query(
            {sql: sql},
            [serverIDCheck]
        )
        .then(successCb)
        .catch(errCb);
}

//Delete a key
exports.deleteKey = function (idToDelete, successCb, errCb) {
    var sql = "DELETE FROM Game_Keys WHERE Key_string = ?;";
    this.get()
        .query(
            {sql: sql},
            [idToDelete]
        )
        .then(successCb)
        .catch(errCb);
}

//Delete a key
exports.deleteKey = function (Server_Id, ServerRole_Id, ServerRole_Name, successCb, errCb) {
    var sql = "INSERT INTO Server_Roles(Server_Id, ServerRole_Id, ServerRole_Name) VALUES (?,?,?)";
    this.get()
        .query(
            {sql: sql},
            [Server_Id, ServerRole_Id, ServerRole_Name]
        )
        .then(successCb)
        .catch(errCb);
}

//check if roles exist
exports.checkRolesExist = function(roleName, serverID, successCb, errCb) {
    var sql = "SELECT COUNT(*) FROM Roles WHERE Role_Name = ? AND server_ID = ?";
    this.get()
        .query(
            {sql: sql},
            [roleName, serverID]
        )
        .then(successCb)
        .catch(errCb)
}

//update roles in Roles table
exports.updateRoles = function(roleName, roleID, serverID, successCb, errCb) {
    var sql = "UPDATE Roles SET User_Role_ID = ? WHERE Role_Name = ? AND Server_ID = ?";
    this.get()
        .query(
            {sql: sql},
            [roleID, roleName, serverID]
        )
        .then(successCb)
        .catch(errCb)
}

//save roles in Roles table
exports.saveRoles = function (roleName, roleID, serverID, successCb, errCb) {
    var sql = "INSERT INTO Roles(Role_Name, User_Role_ID, Server_ID) VALUES (?, ?, ?)";
    this.get()
        .query(
            {sql: sql},
            [roleName, roleID, serverID]
        )
        .then(successCb)
        .catch(errCb)
}

//get keytrader roles
exports.getKeyTraderRoles = function(serverID, successCb, errCb) {
    var sql = "SELECT Roles.Role_Name, User_Role.User_Role_Def FROM Roles INNER JOIN User_Role ON Roles.User_Role_ID=User_Role.User_Role_ID WHERE Roles.Server_ID = ?";
    this.get()
        .query(
            {sql: sql},
            [serverID]
        )
        .then(successCb)
        .catch(errCb)
}

//get role type from given discord role
exports.getRoleType = function(roleName, serverID, successCb, errCb) {
    // var sql = "SELECT User_Role_ID FROM Roles WHERE Role_Name = ? and Server_Id = ?";
    var sql = "SELECT User_Role.User_Role_Def FROM User_Role INNER JOIN Roles ON User_Role.User_Role_ID=Roles.User_Role_ID WHERE Roles.Role_Name = ? AND Roles.Server_ID = ?";
    this.get()
        .query(
            {sql: sql},
            [roleName, serverID]
        )
        .then(successCb)
        .catch(errCb)
}

exports.deleteServer = function(serverName, successCb, errCb){
    var sql = "DELETE FROM Discord_Servers WHERE Server_Name = ?";
    this.get()
    .query(
        {sql: sql},
        [serverName]
    )
    .then(successCb)
    .catch(errCb)
}

exports.insertSettings = function(newKey, claimedKey, newUser, server_ID, successCb, errCb){
    var sql = "INSERT INTO NotificationSettings(newKey, claimedKey, newUser, Server_ID) VALUES (?,?,?,?)";
    this.get()
    .query(
        {sql: sql},
        [newKey,claimedKey, newUser, server_ID]
    )
    .then(successCb)
    .catch(errCb)
}

exports.updateSettings = function(newKey, claimedKey, newUser, server_ID, successCb, errCb){
    var sql = "UPDATE NotificationSettings SET newKey = ?, claimedKey = ?, newUser = ? WHERE Server_ID = ?";
    this.get()
    .query(
        {sql: sql},
        [newKey,claimedKey, newUser, server_ID]
    )
    .then(successCb)
    .catch(errCb)
}

exports.getSettings = function(server_ID, successCb, errCb){
    var sql = "SELECT newKey, claimedKey, newUser FROM NotificationSettings WHERE Server_ID = ?";
    this.get()
    .query(
        {sql: sql},
        [server_ID]
    )
    .then(successCb)
    .catch(errCb)
}

exports.getIdFromSettings = function(serverID, successCb, errCb){
    var sql = "SELECT Server_ID from NotificationSettings WHERE Server_ID = ?";
    this.get()
    .query(
        {sql:sql},
        [serverID]
    )
    .then(successCb)
    .catch(errCb)
}

exports.getChannelId = function(serverID, successCb, errCb){
    var sql = "SELECT Channel_ID from Channels WHERE Server_ID = ?";
    this.get()
    .query(
        {sql:sql},
        [serverID]
    )
    .then(successCb)
    .catch(errCb)
}

exports.getChannels = function(server_ID, successCb, errCb){
  var sql = "SELECT Channel_ID from Channels WHERE Server_ID=?";
  this.get()
    .query(
      {sql:sql},
      [server_ID]
    )
    .then(successCb)
    .catch(errCb)
}

exports.insertChannel = function(channelID, serverID, successCb, errCb){
    var sql = "INSERT INTO Channels(Channel_ID, Server_ID) VALUES (?,?)";
    this.get()
    .query(
        {sql:sql},
        [channelID, serverID]
    )
    .then(successCb)
    .catch(errCb)
}

exports.updateChannel = function(channelID, serverID, successCb, errCb){
    var sql = "UPDATE Channels SET Channel_ID = ? WHERE Server_ID = ?";
    this.get()
    .query(
        {sql:sql},
        [channelID, serverID]
    )
    .then(successCb)
    .catch(errCb)
}

exports.getBools = function(server_ID, successCb, errCb){
    var sql = "SELECT firstBool, secondBool, thirdBool from NotificationSettings WHERE Server_ID = ?";
    this.get()
    .query(
        {sql: sql},
        [server_ID]
    )
    .then(successCb)
    .catch(errCb)
}

exports.keyNumber = function(serverID, successCb, errCb) {
  var sql = "SELECT COUNT(*) FROM Game_Keys WHERE Server_ID = ?"
  this.get()
      .query(
          {sql: sql},
          [serverID]
      )
      .then(successCb)
      .catch(errCb)
}

exports.getGuildRoles = function(serverID, successCb, errCb) {

  var sql = "SELECT Roles.Role_Name, User_Role.User_Role_Def FROM Roles JOIN User_Role on Roles.User_Role_ID = User_Role.User_Role_ID WHERE Server_ID=?;";
  this.get()
      .query(
        {sql: sql},
        [serverID]
      )
      .then(successCb)
      .catch(errCb);
}
