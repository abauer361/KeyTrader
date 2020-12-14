var mariadb = require('mariadb');
exports.MODE_TEST = 'mode_test';
exports.MODE_PRODUCTION = 'mode_production';

var state = {
  pool: null,
  mode: null
};

exports.connect = function (mode, done) {
  state.pool = mariadb.createPool({
    host: 'database',
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

//-------------------------------------------
//Key Trader
//-------------------------------------------
//Create a User
exports.createKeyTraderUser = function (email, username, token) {
  var sql = "INSERT INTO KeyTraderUsers(Email, Username, Token) values (?, ?, ?);"
  return this.get()
  .query(
      {sql: sql},
      [email, username, token]
  );
}
//Get a User
exports.getKeyTraderUsers = function (username) {
  var sql = "SELECT * FROM KeyTraderUsers WHERE Username=?;";
  return this.get().query(
    {sql:sql},
    [username]
    );
}

exports.getCommunity = function (username) {
  var sql = "SELECT * FROM CommunityRoles WHERE Username=?;";
  return this.get().query(
    {sql:sql},
    [username]
    );
}

exports.addCommunity = function (communityID, communityName, communityLink) {
  var sql = "INSERT INTO Communities(Community_ID, Community_Name, Community_Link) values (?, ?, ?);";
  return this.get().query(
    {sql: sql},
    [communityID, communityName, communityLink]
  );
}

exports.getCommunityRole = function (communityID) {
  var sql = "SELECT Username, Role_Name FROM CommunityRoles WHERE Community_ID=?;";
  return this.get().query(
    {sql:sql},
    [communityID]
    );
}

exports.getCommunityKeys = function (communityID) {
  var sql = "SELECT * FROM CommunityKeys WHERE Community_ID=?;";
  return this.get().query(
    {sql:sql},
    [communityID]
    );
}

exports.createCommunityKey = function (communityID,key) {
  var sql = "INSERT INTO CommunityKeys (Community_KD, Key) values (?, ?);"
  return this.get()
  .query(
      {sql: sql},
      [communityID,key]
  );
}

exports.removeCommunityKey = function (key) {
  var sql = "DELETE FROM CommunityKeys WHERE Key=?;";
  return this.get().query(
    {sql: sql},
    [key]
  );
}

exports.removeCommunityUser = function (communityID, username) {
  var sql = "DELETE FROM CommunityRoles WHERE Community_ID=? AND Username=?;";
  return this.get().query(
    {sql: sql},
    [communityID, username]
  );
}

exports.addCommunityRole = function (communityID, username, role) {
  var sql = "INSERT INTO CommunityRoles(Community_ID, Username, Role_Name) values (?, ?, ?) ON DUPLICATE KEY UPDATE Role_Name = ?;";
  return this.get().query(
    {sql: sql},
    [communityID, username, role, role]
  );
}

//-------------------------------------------
//Discord
//-------------------------------------------
exports.getUsers = function () {
  var sql = "SELECT * FROM Users;";
  return this.get().query(
    sql
  );
}

exports.createUser = function (id, userName, Discord_Token) {
  var sql = "INSERT INTO Users(U_ID, User_Name, Discord_Token) values(?, ?, ?) ON DUPLICATE KEY UPDATE Discord_Token = ?;";
  return this.get().query(
    {sql: sql},
    [id, userName, Discord_Token, Discord_Token]
  );
}

//Add a Game key
exports.addKey = function (guildid, keyID, keyName, keyPrice, keyString) {
  var sql = "INSERT INTO Game_Keys(Server_ID, Key_ID, Key_name, Key_price, Key_string) values(?, ?, ?, ?, ?); ";
  return this.get().query(
    {sql: sql},
    [guildid, keyID, keyName, keyPrice, keyString]
  );
}

exports.addServer = function (serverID, serverName, serverLink) {
  var sql = "INSERT INTO Discord_Servers(Server_ID, Server_Name, Server_Link) values (?, ?, ?) ON DUPLICATE KEY UPDATE Server_Name = ?;";
  return this.get().query(
    {sql: sql},
    [serverID, serverName, serverLink, serverName]
  );
}


exports.getLocationofKey = function (keyName) {
  var sql = "SELECT Server_ID FROM Game_Keys WHERE Key_string = ?;";
  return this.get().query(
    {sql: sql},
    [keyName]
  );
}

//adding roles as an admin
exports.addRole = function (roleName, serverID) {
  var sql = "INSERT INTO Roles(Role_Name, User_Role_ID, Server_ID) VALUES (?, ?, ?) ";
  return this.get().query(
    {sql: sql},
    [roleName, 1, serverID]
  );
}

//redeem a key
exports.redeemKey = function (keyString, userID) {
  var sql = "UPDATE Game_Keys SET U_ID = ? WHERE Key_string = ?;";
  return this.get().query(
    {sql: sql},
    [userID, keyString]
  );
}

exports.getUserKeys = function (userID) {
  var sql = "SELECT * FROM Game_Keys WHERE U_ID = ?";
  return this.get().query(
    {sql: sql},
    [userID]
  );
}

exports.getLinkedServers = function () {
  var sql = "SELECT * from Discord_Servers;"
  return this.get().query(
    sql
  );
}

//See all game keys from a server
exports.getKeys = function (serverIDCheck) {
  var sql = "SELECT * FROM Game_Keys WHERE Server_ID = ? AND U_ID IS NULL;";
  return this.get().query(
    {sql: sql},
    [serverIDCheck]
  );
}

//Delete a key
exports.deleteKey = function (idToDelete) {
  var sql = "DELETE FROM Game_Keys WHERE Key_string = ?;";
  return this.get().query(
    {sql: sql},
    [idToDelete]
  );
}

//Delete a key
exports.deleteKey = function (Server_Id, ServerRole_Id, ServerRole_Name) {
  var sql = "INSERT INTO Server_Roles(Server_Id, ServerRole_Id, ServerRole_Name) VALUES (?,?,?)";
  return this.get().query(
    {sql: sql},
    [Server_Id, ServerRole_Id, ServerRole_Name]
  );
}

//check if roles exist
exports.checkRolesExist = function (roleName, serverID) {
  var sql = "SELECT COUNT(*) FROM Roles WHERE Role_Name = ? AND server_ID = ?";
  return this.get().query(
    {sql: sql},
    [roleName, serverID]
  );
}

//update roles in Roles table
exports.updateRoles = function (roleName, roleID, serverID) {
  var sql = "UPDATE Roles SET User_Role_ID = ? WHERE Role_Name = ? AND Server_ID = ?";
  return this.get().query(
    {sql: sql},
    [roleID, roleName, serverID]
  );
}

//save roles in Roles table
exports.saveRoles = function (roleName, roleID, serverID) {
  var sql = "INSERT INTO Roles(Role_Name, User_Role_ID, Server_ID) VALUES (?, ?, ?)";
  return this.get().query(
    {sql: sql},
    [roleName, roleID, serverID]
  );
}

//get keytrader roles
exports.getKeyTraderRoles = function (serverID) {
  var sql = "SELECT Roles.Role_Name, User_Role.User_Role_Def FROM Roles INNER JOIN User_Role ON Roles.User_Role_ID=User_Role.User_Role_ID WHERE Roles.Server_ID = ?";
  return this.get().query(
    {sql: sql},
    [serverID]
  );
}

//get role type from given discord role
exports.getRoleType = function (roleName, serverID) {
  var sql = "SELECT User_Role.User_Role_Def FROM User_Role INNER JOIN Roles ON User_Role.User_Role_ID=Roles.User_Role_ID WHERE Roles.Role_Name = ? AND Roles.Server_ID = ?";
  return this.get().query(
    {sql: sql},
    [roleName, serverID]
  );
}

exports.deleteServer = function (serverName) {
  var sql = "DELETE FROM Discord_Servers WHERE Server_Name = ?";
  return this.get().query(
    {sql: sql},
    [serverName]
  );
}

exports.insertSettings = function (newKey, claimedKey, newUser, server_ID) {
  var sql = "INSERT INTO NotificationSettings(newKey, claimedKey, newUser, Server_ID) VALUES (?,?,?,?)";
  return this.get().query(
    {sql: sql},
    [newKey, claimedKey, newUser, server_ID]
  );
}

exports.updateSettings = function (newKey, claimedKey, newUser, server_ID) {
  var sql = "UPDATE NotificationSettings SET newKey = ?, claimedKey = ?, newUser = ? WHERE Server_ID = ?";
  return this.get().query(
    {sql: sql},
    [newKey, claimedKey, newUser, server_ID]
  );
}

exports.getSettings = function (server_ID) {
  var sql = "SELECT newKey, claimedKey, newUser FROM NotificationSettings WHERE Server_ID = ?";
  return this.get().query(
    {sql: sql},
    [server_ID]
  );
}

exports.getIdFromSettings = function (serverID) {
  var sql = "SELECT Server_ID from NotificationSettings WHERE Server_ID = ?";
  return this.get().query(
    {sql: sql},
    [serverID]
  );
}

exports.getChannelId = function (serverID) {
  var sql = "SELECT Channel_ID from Channels WHERE Server_ID = ?";
  return this.get().query(
    {sql: sql},
    [serverID]
  );
}

exports.getChannels = function (server_ID) {
  var sql = "SELECT Channel_ID from Channels WHERE Server_ID=?";
  return this.get().query(
    {sql: sql},
    [server_ID]
  );
}

exports.insertChannel = function (channelID, serverID) {
  var sql = "INSERT INTO Channels(Channel_ID, Server_ID) VALUES (?,?)";
  return this.get().query(
    {sql: sql},
    [channelID, serverID]
  );
}

exports.updateChannel = function (channelID, serverID) {
  var sql = "UPDATE Channels SET Channel_ID = ? WHERE Server_ID = ?";
  return this.get().query(
    {sql: sql},
    [channelID, serverID]
  );
}

exports.getBools = function (server_ID) {
  var sql = "SELECT firstBool, secondBool, thirdBool from NotificationSettings WHERE Server_ID = ?";
  return this.get().query(
    {sql: sql},
    [server_ID]
  );
}

exports.keyNumber = function (serverID) {
  var sql = "SELECT COUNT(*) FROM Game_Keys WHERE Server_ID = ?"
  return this.get().query(
    {sql: sql},
    [serverID]
  );
}

exports.getGuildRoles = function (serverID) {
  var sql = "SELECT Roles.Role_Name, User_Role.User_Role_Def FROM Roles JOIN User_Role on Roles.User_Role_ID = User_Role.User_Role_ID WHERE Server_ID=?;";
  return this.get().query(
    {sql: sql},
    [serverID]
  );
}
