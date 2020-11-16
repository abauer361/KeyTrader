const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const databaseRecords = require('./db');
const { catchAsync,
        encodeWwwFormUrl,
        RequiredParam,
        checkRequestQueryParams,
        checkRequestBodyFields,
        checkResponse,
        checkResponseArray} = require('../utils');
const http = require('http');
const jwt = require('jsonwebtoken');
const { getErrorType, BadRequestError, InternalServerError, ForbiddenError } = require('./errorUtil');


const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirectLoginUnencoded = process.env.REDIRECT_URI_LOGIN_CB;
const redirectLogin = encodeURIComponent(process.env.REDIRECT_URI_LOGIN_CB);
const redirectBot = encodeURIComponent(process.env.REDIRECT_URI_BOT_CB);

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

router.get('/login', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectLogin}&response_type=code&scope=identify%20guilds%20email`);
});

router.get('/callback', async (req,res,next) =>
{
  const reqErr = checkRequestQueryParams(req, [
    new RequiredParam("code", String)
  ], next);

  if (reqErr) {
    return;
  }

  // return res.status(200).json({msg:"Got code"});
  const code = req.query.code;
  const data = {
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': redirectLoginUnencoded,
    'scope': 'identity guilds email'
  }
  let TOKEN;
  try {
    const response = await fetch(`https://discordapp.com/api/oauth2/token`, //check response and make sure it returns a 200 code and it has a token attached
    {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: encodeWwwFormUrl(data)
    })

    const json = await response.json();

    const resErr = checkResponse(response, json, "Get discord token fail", [
      new RequiredParam("access_token", String)
    ], next);

    if (resErr) {
      return;
    }

    TOKEN = json.access_token;
  }
  catch (err)
  {
    return next(new BadRequestError("General HTTP error oauth2/token", err));
  }

  let userData;
  try
  {
    //changed from const to var to have it exist outside of try-catch
    const user = await fetch('http://discordapp.com/api/users/@me',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    userData = await user.json();

    const resMeErr = checkResponse(user, userData, "Failed to get discord api users/@me", [
      new RequiredParam("username", String),
      new RequiredParam("id")
    ], next);

    if (resMeErr) {
      return;
    }
  }
  catch (err)
  {
    return next(new BadRequestError("General HTTP error users/@me", err));
  }

  const username = userData.username;
  localStorage.setItem('username', username);
  const id = userData.id;

  const jwt_key = 'softwareengineeringismymajorandwegraduateinmay';
  const jwt_expires = 3600;

  const json_token = jwt.sign({username: username, id: id, token: TOKEN}, jwt_key, {
    algorithm: 'HS256',
    expiresIn: jwt_expires
  });

  const jwtInfo = {'token': json_token, 'expiresIn': 3600 };

  try {
    await databaseRecords.createUser(id, username, TOKEN);
    res.cookie('jwt', JSON.stringify(jwtInfo));
    res.redirect('/');
  }
  catch (err) {
    return next(new BadRequestError("Could not create user",err))
  }
});

//gets all servers for homepage. Both owned servers and linked servers
router.get('/getServers', async (req, res, next) => {
  const reqErr = checkRequestQueryParams(req, [
    new RequiredParam("token", String)
  ], next);

  if (reqErr) {
    return;
  }

  let json_token = req.query.token;
  var linkedArray = new Array();
  let guildArray = new Array();
  let token;

  jwt.verify(json_token, 'softwareengineeringismymajorandwegraduateinmay', function (err, decoded) {
    if (err) {
      return next(new BadRequestError("JWT Verify error",err));
    }
    token = decoded.token;
  });

  let guildJson
  try {
    const guilds = await fetch('http://discordapp.com/api/users/@me/guilds',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    guildJson = await guilds.json();

    const resGuildErr = checkResponseArray(guilds, guildJson, "Error getting @me/guilds", [
      new RequiredParam("name", String),
      new RequiredParam("id", String)
    ], next);

    if (resGuildErr) {
      return;
    }

    for (const guild in guildJson) {
      if (guildJson[guild].owner) {
        guildArray.push({serverName: guildJson[guild].name, serverID: guildJson[guild].id})
      }
    }

  }
  catch (err) {
    return next(new BadRequestError("General HTTP error @me/guilds", err));
  }

  try {
    const results = await databaseRecords.getLinkedServers()
    const linkedJson = JSON.parse(JSON.stringify(results));
    for (const guild in guildJson) {
      for (const linkedGuild in linkedJson) {
        if (guildJson[guild].id == linkedJson[linkedGuild].Server_ID) {
          linkedArray.push({serverName: linkedJson[linkedGuild].Server_Name, serverID: linkedJson[linkedGuild].Server_ID});
        }
      }
    }

    let notInLinkedArray = guildArray.filter(serverObject => !linkedArray.map(linkedServer => linkedServer.serverID).includes(serverObject.serverID));

    return res.status(200).json({
      message: "Success",
      servers: notInLinkedArray,
      serversLinked: linkedArray
    });

  } catch (err) {
    next(new InternalServerError("Failed to get Linked Servers", err));
  }
});

//add bot to server
router.get('/linkKeyTrader', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=68672&redirect_uri=${redirectBot}&response_type=code&scope=guilds.join%20bot&guild_id=` + req.query.guildID)
});

//link roles
router.get('/linkRoles', async (req, res, next) => {
  const reqErr = checkRequestQueryParams(req, [
    new RequiredParam("guildID", String)
  ], next);

  if (reqErr) {
    return;
  }

  let roleJson;
  try {
    const roles = await fetch('http://localhost:1337/all-roles?guild_id=' + req.query.guildID,
      {
        method: 'POST'
      }
    );

    roleJson = await roles.json();

    const rolesErr = checkResponse(roles, roleJson, "Failed to get roles from bot", [
      new RequiredParam("roles")
    ], next);

    if (rolesErr) {
      return;
    }

  } catch (err) {
    return next(new BadRequestError("General HTTP error bot/all-roles", err));
  }

  let rolesArray = new Array();
  for (const role of roleJson.roles.names) {
    rolesArray.push(role);
  }

  for (let roleIndex = 0; roleIndex < rolesArray.length; roleIndex++) {
    try {
      const results = await databaseRecords.checkRolesExist(rolesArray[roleIndex], req.query.guildID)
      const countJson = JSON.parse(JSON.stringify(results));
      if (countJson[0]['COUNT(*)'] == 0) {
        await databaseRecords.saveRoles(rolesArray[roleIndex], 1, req.query.guildID);

        if (roleIndex == rolesArray.length - 1) {
          res.redirect('/');
        }
      }
      else {
        if (roleIndex == rolesArray.length - 1) {
          res.redirect('/');
        }
        else { return; }
      }
    } catch (err) {
      return next(new InternalServerError("Cannot link roles", err))
    }
  }
});

//redirect after adding bot ADDING SERVER TO DATABASE
router.get('/addServer', async(req, res, next) => {
  var serverLink = ' '
  const reqErr = checkRequestQueryParams(req, [
    new RequiredParam("guild_id")
  ], next);

  if (reqErr) {
    return;
  }

  let guildName;
  try {
    const guildInfo = await fetch('http://localhost:1337/guild-info?guild_id=' + req.query.guild_id, // check for success code and .name exists; throw error if neither exists
      {
        method: 'POST',
      }
    );

    const guildJson = await guildInfo.json()
    const guildErr = checkResponse(guildInfo, guildJson, "Failed to get guild info from bot", [
      new RequiredParam("name", String)
    ], next);

    if (guildErr) {
      return;
    }

    guildName = guildJson.name;
  }
  catch (err) {
    return next(new BadRequestError("General HTTP error bot/guild-info", err));
  }

  try {
    await databaseRecords.addServer(req.query.guild_id, guildName, serverLink);

    res.redirect('/api/discord/linkRoles?guildID=' + req.query.guild_id);
  } catch (err) {
    return next(new InternalServerError("Cannot add server "), err);
  }
});

generateSteamLink = (gameName, id) => {
  const turnToUnderscore = [' ', ':']
  let newGameName = ''
  for (let char of gameName) {
    newGameName += turnToUnderscore.includes(char) ? '_' : char
  }
  return `https://store.steampowered.com/app/${id}/${newGameName}/`
}

//adding a key
router.post('/addKey', async (req, res, next) => {
  try {
    const price = req.body.key.gamePrice;
    const name = req.body.key.gameName;
    const id = req.body.key.gameID;
    const guildID = req.body.guildID;
    const reqErr = checkRequestBodyFields(req, [
      new RequiredParam("key"),
      new RequiredParam("guildID", String)
    ], next);
    if (reqErr) {
      return;
    }

    localStorage.setItem('gameName', name);
    localStorage.setItem('gameLink', generateSteamLink(name, id))

    //inserting key into database
    const results = await databaseRecords.addKey(guildID, id, name, price, req.body.key.keyString);

    res.status(200).json(results);
  }
  catch (err) {
    return next(new InternalServerError("Cannot add key", err))
  }
});

//getting available keys
router.get('/getKeys', async (req, res, next) => { //gets server id in req.body and queries to get the keys
  console.log(req.query.guildID);
  const reqErr = checkRequestQueryParams(req, [
    new RequiredParam("guildID", String)
  ], next);

  if (reqErr) {
    return;
  }

  try {
    const results = await databaseRecords.getKeys(req.query.guildID);
    let keyArray = new Array();
    const keyJson = JSON.parse(JSON.stringify(results));

    for (const key in keyJson) {
      keyArray.push({gameName: keyJson[key].Key_name, gamePrice: keyJson[key].Key_price, keyString: keyJson[key].Key_string, gameID: keyJson[key].Key_ID});
    }

    res.status(200).json({message: "Success", keys: keyArray});
  }
  catch (err) {
    return next(new InternalServerError("Cannot get keys.", err));
  }
});

//sends what roles that user has to front end
router.get('/getUserRoles', async (req, res, next) => {
  const reqErr = checkRequestQueryParams(req, [
    new RequiredParam("guildID", String),
    new RequiredParam("token", String)
  ], next);

  if (reqErr) {
    return;
  }

  let json_token = req.query.token;
  let id;

  jwt.verify(json_token, 'softwareengineeringismymajorandwegraduateinmay', function (err, decoded) {
    if (err) {
      return next(new InternalServerError("cannot get user roles", err));
    }
    id = decoded.id;
  });

  let userRolesTypes;
  try {
    // getting the roles
    const rolesInfo = await fetch('http://localhost:1337/user-roles?guild_id=' + req.query.guildID + '&user_id=' + id,
      {
        method: 'POST',
      });

    userRolesTypes = await rolesInfo.json();

    const rolesErr = checkResponse(rolesInfo, userRolesTypes, "Could not get user roles from bot", [
      new RequiredParam("roles")
    ], next);

    if (rolesErr) {
      return;
    }
  }
  catch (err) {
    return next(new BadRequestError("General HTTP error bot/user-roles", err));
  }

  let rolesArray = userRolesTypes.roles.names;

  let accessArray = new Array();
  try {
    for (const role of rolesArray) {
      const results = await databaseRecords.getRoleType(role, req.query.guildID);
      const roleJson = JSON.parse(JSON.stringify(results));
      for (const role in roleJson) {
        accessArray.push(roleJson[role].User_Role_Def);
        if (accessArray.length == rolesArray.length) {
          //example of accessArray: ['Admin', 'Donor/Recipient']
          res.status(200).json({message: "Success", roleTypes: accessArray})
          break;
        }
      }
    };
  } catch (err) {
    return next(new InternalServerError("cannot access role types", err));
  }
});


//getting all roles of a server
router.get('/getRoles', async (req, res, next) => {
  const reqErr = checkRequestQueryParams(req, [
    new RequiredParam("guildID", String)
  ], next);

  if (reqErr) {
    return;
  }

  let rolesJson;
  try {
    const roles = await fetch('http://localhost:1337/all-roles?guild_id=' + req.query.guildID,
      {
        method: 'POST'
      }
    );

    roleJson = await roles.json();

    const rolesErr = checkResponse(roles, roleJson, "Could not get all-roles from bot", [
      new RequiredParam("roles")
    ], next);

    if (rolesErr) {
      return;
    }
  }
  catch (err) {
    return next(new BadRequestError("General HTTP error bot/all-roles", err));
  }

  roleJson = roleJson.roles;
  let rolesArray = new Array();
  for (role in roleJson.names) {
    rolesArray.push(roleJson.names[role]);
  }
  //example of rolesArray: [test1, test2]
  res.status(200).json({message: "Success", roles: rolesArray});
});

//saving roles to database
router.post('/saveRoles', async (req, res, next) =>{
  //****** DISCORDROLES AND KEYTRADEROLES MUST LOOK LIKE THIS
  // let discordRoles = ["test1", "test2", "test3"];
  // let keyTraderRoles = ["Donor/Recipient", "Viewer", "Admin"];
  const reqErr = checkRequestBodyFields(req, [
    new RequiredParam("serverRoles"),
    new RequiredParam("serverUpdates"),
    new RequiredParam("guildID")
  ], next);

  let discordRoles = req.body.serverRoles;
  let keyTraderRoles = req.body.serverUpdates;
  // TODO breaks when only updating one role
  for (let roleIndex = 0; roleIndex < discordRoles.length; roleIndex++) {
    let userRoleID;
    switch (keyTraderRoles[roleIndex]) {
      case 'Admin':
        userRoleID = 1;
        break;
      case 'Donor/Recipient':
        userRoleID = 2;
        break;
      case 'Donor':
        userRoleID = 3;
        break;
      case 'Recipient':
        userRoleID = 4;
        break;
      case 'Viewer':
        userRoleID = 5;
        break;
      case 'Blocked':
        userRoleID = 6;
        break;
    }

    try {
      await databaseRecords.updateRoles(discordRoles[roleIndex], userRoleID, req.body.guildID)
      console.log('roles updated');

    } catch (err) {
      return next(new InternalServerError("could not update roles", err));
    }
  }
  res.status(200).json({ message: 'Roles updated' });
});

//getting keytrader roles
router.get('/getKeyTraderRoles', async(req, res, next) => {
  const reqErr = checkRequestQueryParams(req, [
    new RequiredParam("guildID", String)
  ], next);

  if (reqErr) {
    return;
  }

  let roleDataArray = new Array();
  try {
    const results = await databaseRecords.getKeyTraderRoles(req.query.guildID);

    const rolesDataJson = JSON.parse(JSON.stringify(results));
    for (const data in rolesDataJson) {
      roleDataArray.push({ roleName: rolesDataJson[data].Role_Name, roleType: rolesDataJson[data].User_Role_Def });
    }
    res.status(200).json({ message: "Success", keyTraderRoles: roleDataArray });
    // example of rolesData: [roleName: 'test1', roleType: 'Admin'], [roleName: 'test2', roleType: 'Donor']
  } catch (err) {
    return next(new InternalServerError("cannot get key trader roles", err));
  }
});

//Redeem a key for a user
router.post('/redeemKey', async (req, res, next) => {
  const reqErr = checkRequestBodyFields(req, [
    new RequiredParam("keyString", String),
    new RequiredParam("token", String)
  ], next);
  if (reqErr) {
    return;
  }

  let keyString = req.body.keyString;
  let json_token = req.body.token;
  let userID = null;
  jwt.verify(json_token, 'softwareengineeringismymajorandwegraduateinmay', function (err, decoded) {
    if (err) {
      return next(new InternalServerError("Failed to verify token", err));
    }
    userID = decoded.id;
  })

  try {
    await databaseRecords.redeemKey(keyString, userID);
    res.status(200).json({ message: "Success" });
  }
  catch (err) {
    return next(new InternalServerError("Cannot redeem key", err));
  }
});

//getting redeemed keys of user
router.get('/userKeys', async (req, res, next) => {
  const reqErr = checkRequestQueryParams(req, [
    new RequiredParam("token", String)
  ], next);

  if (reqErr) {
    return;
  }

  let json_token = req.query.token;
  let userID = null;
  jwt.verify(json_token, 'softwareengineeringismymajorandwegraduateinmay', function (err, decoded) {
    if (err) {
      return next(new InternalServerError("Failed to verify jwt", err));
    }
    userID = decoded.id;
  });

  try {
    const results = await databaseRecords.getUserKeys(userID);
    let keyArray = new Array();
    const keyJson = JSON.parse(JSON.stringify(results));
    for (const key in keyJson) {
      keyArray.push({ gameName: keyJson[key].Key_name, gamePrice: keyJson[key].Key_price, keyString: keyJson[key].Key_string, gameID: keyJson[key].Key_ID });
    }
    res.status(200).json({ message: "Success", keys: keyArray });
  }
  catch (err) {
    return next(new InternalServerError("Cannot get user keys", err));
  }
});

router.get('/checkSteamKey', async (req, res, next) => {
  const reqErr = checkRequestQueryParams(req, [
    new RequiredParam("gameID", String)
  ], next);
  const gameID = req.query.gameID;

  if (reqErr) {
    return;
  }

  //getting JSON of game info
  try {
    const gameInfo = await fetch("https://store.steampowered.com/api/appdetails?appids=" + gameID,
      {
        method: 'GET',
      }
    );

    const gameJson = await gameInfo.json();

    const gameErr = checkResponse(gameInfo, gameJson, "Failed to get steam details", [
      new RequiredParam(gameID)
    ], next);

    if (gameErr) {
      return;
    }

    const price = gameJson[gameID].data.price_overview.final;
    const name = gameJson[gameID].data.name;

    res.status(200).json({ message: "Success", key: { gameName: name, gamePrice: price } })
  }
  catch (err) {
    return next(new BadRequestError("General HTTP error steam/appdetails", err));
  }
});

router.get('/isVerified', (req, res) => {
  let jwt_token = req.query.token;
  let verified = false;
  jwt.verify(jwt_token, 'softwareengineeringismymajorandwegraduateinmay', function (err) {
    if (err) {
      verified = false;
      return res.status(200).json(verified);
    } else {
      verified = true;
      return res.status(200).json(verified);
    }
  });
});

/*
// TODO Figure out how to properly kick the bot and delete the server
router.get('/kickBot', async(req, res, next)=>{
  var oldArray = new Array();
  var newArray = new Array();
  try {
    const results = await databaseRecords.getLinkedServers()
    var linkedJson = JSON.parse(JSON.stringify(results));
    for (const linkedGuild in linkedJson) {
      oldArray.push({ serverName: linkedJson[linkedGuild].Server_Name }) //insert serverName into old array
    }
  }
  catch (err) {
    return next(new InternalServerError("Failed to get linked servers", err));
  }

  //Need to make a call here to get newArray.
  // We are going to be comparing Server names because im not sure Server_IDs are working correctly in db.
  let difference = newArray.filter(x => !oldArray.includes(x));
  //difference array is the diff of the two arrays with server names
  for (let i = 0; i < difference.length; i++) {
    try {
      const results = await detabaseRecords.deleteServer(difference[i]);
      res.status(200).json({ message: "Success, server deleted from Database" });
    }
    catch(err) {
      return next(new InternalServerError("Failed to delete server", err));
    }
  }
});
*/

router.post('/storeChannel', async (req, res, next) => {
  const reqErr = checkRequestBodyFields(req, [
    new RequiredParam("guildID", String),
    new RequiredParam("channelID", String)
  ], next);

  if (reqErr) {
    return;
  }

  const guildID = req.body.guildID;
  const channelID = req.body.channelID;

  try {
    const results = await databaseRecords.getChannelId(guildID)
    let channelArray = new Array();
    let channelJson = JSON.parse(JSON.stringify(results));

    for (const channel in channelJson) {
      channelArray.push(channelJson[channel]);
    }
    if (typeof channelArray[0] === 'undefined') {
      await databaseRecords.insertChannel(channelID, guildID);
      res.status(200).json({ message: "Channel inserted to database." })
    }
    else {
      await databaseRecords.updateChannel(channelID, guildID);
      res.status(200).json({ message: "Channel updated in database." });
    }
  }
  catch (err) {
    return next(new InternalServerError("Failed to store channel", err));
  }
});

router.post('/storeSettings', async (req, res, next) => {
  const reqErr = checkRequestBodyFields(req, [
    new RequiredParam("keysAdded"),
    new RequiredParam("keysClaimed"),
    new RequiredParam("newUser"),
    new RequiredParam("guildID"),
  ], next);

  if (reqErr) {
    return;
  }

  const keysAdded = req.body.keysAdded;
  const keysClaimed = req.body.keysClaimed;
  const newUser = req.body.newUser;
  const guildID = req.body.guildID;

  try {
    let idArray = new Array();
    const results = await databaseRecords.getIdFromSettings(guildID);
    const idJson = JSON.parse(JSON.stringify(results));

    for (const id in idJson) {
      idArray.push(idJson[id]);
    }

    if (idArray[0]) {
      // settings already exist, just need to update
      await databaseRecords.updateSettings(keysAdded, keysClaimed, newUser, guildID);
      res.status(200).json({ message: "Settings updated in database." });
    }
    else {
      // need to create new settings
      await databaseRecords.insertSettings(keysAdded, keysClaimed, newUser, guildID);
      res.status(200).json({ message: "Settings saved to database." });
    }

  } catch (err) {
    return next(new InternalServerError("Failed to insert settings", err));
  }
});

router.post('/sendNotification', async(req, res, next) => {
  const reqErr = checkRequestBodyFields(req, [
    new RequiredParam("guildID"),
    new RequiredParam("notificationType")
  ], next);
  if (reqErr) {
    return;
  }

  const server_ID = req.body.guildID;
  var settingArray = new Array();
  var channelArray = new Array();

  try {
    const results = await databaseRecords.getSettings(server_ID);
    var settingsJson = JSON.parse(JSON.stringify(results));
    for (const setting in settingsJson) {
      settingArray.push({ newKey: settingsJson[setting].newKey, claimedKey: settingsJson[setting].claimedKey, newUser: settingsJson[setting].newUser })
    }
    //Push those settings into settingArray, Check database for existing channel selection
    const resultstwo = await databaseRecords.getChannels(server_ID);
    const channelJson = JSON.parse(JSON.stringify(resultstwo));

    for (const channel in channelJson) {
      //Push existing channel selection into channelArray
      channelArray.push(channelJson[channel]);
    }
    //If settingArray[0] is undefined that means settings have not been previously set in the DB and we will default all settings to be 1.
    if (!settingArray[0]) {
      settingArray.push({ newKey: '1', claimedKey: '1', newUser: '1' });
    }

    //Set the channel_ID to the ID in the channel, might be empty - we check later. channelArray should not have more than one channel in it because we can only select 1 channel.
    let channel_ID = channelArray[0];

    //We call our callback method which starts on line 524. We pass settingArray, server ID, and channel ID.
    //Callback method starts here
    //If the channel_ID is undefined, we request the bot to give us channels for a specific server ID
    if (!channel_ID) {
      const channels = await fetch(`http://localhost:1337/channels?guild_id=` + server_ID,
        {
          method: 'POST',
        }
      );
      //Channels are in channelJson
      const channelJson = await channels.json();
      channel_ID = channelJson.channels[0].id;
    }
    //Check the notification type passed by front end
    let notificationType = req.body.notificationType;
    //Depending on the notification type, we send out a different message to a given server/channel.
    const username = localStorage.getItem('username');
    if ((notificationType === 'newKey') && (settingArray[0].newKey == '1')) {
      const message = `added key for [${localStorage.getItem('gameName')}](${localStorage.getItem('gameLink')})`
      const url = `http://localhost:1337/mention?message=${message}&guild_id=${server_ID}&channel_id=${channel_ID.Channel_ID}&user=${username}`;
      const sendNotification = await fetch(url,
        {
          method: 'POST',
        }
      );
    }
    else if ((notificationType === 'claimedKey') && (settingArray[0].claimedKey == '1')) {
      const message = `claimed key for [${localStorage.getItem('gameName')}](${localStorage.getItem('gameLink')})`
      const url = `http://localhost:1337/mention?message=${message}&guild_id=${server_ID}&channel_id=${channel_ID.Channel_ID}&user=${username}`
      const sendNotification = await fetch(url,
        {
          method: 'POST',
        }
      );
    }
    else if ((notificationType === 'newUser') && (settingArray[0].newUser == '1')) {
      const message = "A new user has been created."
      channel_ID = channel_ID.Channel_ID;
      const sendNotification = await fetch(`http://localhost:1337/announce?message=${message}&guild_id=${server_ID}&channel_id=${channel_ID}`,
        {
          method: 'POST',
        }
      );
    }
    else {
      return res.status(200).json({message: `Notification disregarded for ${notificationType}`});
    }
    return res.status(200).json({message: `Notification sent for ${notificationType}`});
  }
  catch(err) {
    return next(new InternalServerError("Failed to send notification", err));
  }
});

router.get('/getChannels', async(req, res, next) => {
  const reqErr = checkRequestQueryParams(req, [
    new RequiredParam("guildID", String)
  ], next);

  if (reqErr) {
    return;
  }

  try {
    const channels = await fetch(`http://localhost:1337/channels?guild_id=` + req.query.guildID,
      {
        method: 'POST',
      }
    );
    const channelJson = await channels.json();
    const channelErr = checkResponseArray(channels, channelJson.channels, "Failed to get channels from bot", [
      new RequiredParam("id"),
      new RequiredParam("name")
    ], next);

    if (channelErr) {
      return;
    }

    let channelArray = new Array();
    for (let channel in channelJson) {
      channelArray.push(channelJson[channel]);
    }
    res.status(200).json({ message: "Channels for server retrieved.", channels: channelArray });
  }
  catch (err) {
    return next(new BadRequestError("General HTTP error bot/channels", err));
  }
});

router.get('/getNotifications', async (req, res, next) => {
  const reqErr = checkRequestQueryParams(req, [
    new RequiredParam("guildID", String)
  ], next);

  if (reqErr) {
    return;
  }

  try {
    let settingArray = new Array();
    const results = await databaseRecords.getSettings(req.query.guildID)
    const settingsJson = JSON.parse(JSON.stringify(results));

    for (const setting in settingsJson) {
      settingArray.push({ newKey: settingsJson[setting].newKey, claimedKey: settingsJson[setting].claimedKey, newUser: settingsJson[setting].newUser })
    }

    if (typeof settingArray[0] == 'undefined') {
      settingArray.push({ newKey: 1, claimedKey: 1, newUser: 1 });
    }

    res.status(200).json({ message: "Settings saved to database.", notifications: settingArray });
  } catch (err) {
    return next(new InternalServerError("no new notifications", err))
  }
});

router.post('/getKeyCount', async (req, res, next) => {
  const reqErr = checkRequestBodyFields(req, [
    new RequiredParam("guildID"),
    new RequiredParam("roles")
  ], next);

  if (reqErr) {
    return;
  }

  //check if user is admin, if it is, then count # of keys
  try {
    const results = await databaseRecords.getGuildRoles(req.body.guildID);
    const roleJson = JSON.parse(JSON.stringify(results));
    if(roleJson == {}) {
      return next(new InternalServerError("Failed to get roleJson"));
    }
    // iterate over req.body.roles
    for (const role in roleJson) {
      if (roleJson[role].User_Role_Def === 'Admin' && req.body.roles.includes(roleJson[role].Role_Name)) {
        const results = await databaseRecords.keyNumber(req.body.guildID);
        const countJson = JSON.parse(JSON.stringify(results));
        return res.status(200).json({ message: "Success", count: countJson[0]['COUNT(*)'] });
      }
    }
    return next(new ForbiddenError("User is not admin"));
  }
  catch (err) {
    return next(new InternalServerError("Failed to get key count", err));
  }

});

module.exports = router;
