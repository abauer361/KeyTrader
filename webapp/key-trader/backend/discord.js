const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const databaseRecords = require('./db');
const {catchAsync, encodeWwwFormUrl } = require('../utils');
const http = require('http');
const jwt = require('jsonwebtoken');


const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirectLoginUnencoded = process.env.REDIRECT_URI_LOGIN_CB;
const redirectLogin = encodeURIComponent(process.env.REDIRECT_URI_LOGIN_CB);
const redirectBot = encodeURIComponent(process.env.REDIRECT_URI_BOT_CB);


router.get('/login', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectLogin}&response_type=code&scope=identify%20guilds%20email`);
});

router.get('/callback', catchAsync(async (req, res) => {
  if (!req.query.code) throw new Error('NoCodeProvided');
  const code = req.query.code;
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const data = {
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': redirectLoginUnencoded,
    'scope': 'identity guilds email'
  }
  const response = await fetch(`https://discordapp.com/api/oauth2/token`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: encodeWwwFormUrl(data)
    });
  const json = await response.json();
  const TOKEN = json.access_token;
  userTOKEN = TOKEN;
  const user = await fetch('http://discordapp.com/api/users/@me',
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  const userData = await user.json();
  const username = userData.username;
  const id = userData.id;

  const jwt_key = 'softwareengineeringismymajorandwegraduateinmay';
  const jwt_expires = 3600;

  const json_token = jwt.sign({username: username, id: id, token: TOKEN}, jwt_key, {
    algorithm: 'HS256',
    expiresIn: jwt_expires
  });
  const jwtInfo = {'token': json_token, 'expiresIn': 3600};
 // console.log(json_token);
  databaseRecords.createUser(id, username, TOKEN, function(){
    console.log("success");
    res.cookie('jwt', JSON.stringify(jwtInfo));
    res.redirect('/');
  },function(err){
      return res.status(500).json(err);
  });
}));

//gets all servers for homepage. Both owned servers and linked servers
router.get('/getServers', catchAsync(async (req, res) => {
  var linkedArray = new Array();
  let json_token = req.query.token;
  let guildArray = new Array();
  let token;
  jwt.verify(json_token, 'softwareengineeringismymajorandwegraduateinmay', function (err, decoded) {
    if (err) {
      return res.status(500).json({
        title: 'An error occurred, not verified',
        error: err,
        message: err.message
      });
    }
    const username = decoded.username;
    const id = decoded.id;
    token = decoded.token;
    console.log("success");
  })
  if (token) {

    const guilds = await fetch('http://discordapp.com/api/users/@me/guilds',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    const guildJson = await guilds.json();
    for (const guild in guildJson) {
      if (guildJson[guild].owner) {
        guildArray.push({serverName: guildJson[guild].name, serverID: guildJson[guild].id})
      }
    }
    databaseRecords.getLinkedServers(function(results){
      var linkedJson = JSON.parse(JSON.stringify(results));
      for (const guild in guildJson) {
        for (const linkedGuild in linkedJson){
          if (guildJson[guild].id == linkedJson[linkedGuild].Server_ID){
            linkedArray.push({serverName: linkedJson[linkedGuild].Server_Name, serverID: linkedJson[linkedGuild].Server_ID});
          }
        }
      }
      let notInLinkedArray = guildArray.filter(serverObject => !linkedArray.map(linkedServer => linkedServer.serverID).includes(serverObject.serverID));
      console.log(notInLinkedArray);
      // for (let i =0; i < guildArray.length; i++){
      //   if (guildArray[i].serverID != difference[i]){
      //     delete guildArray[i];
      //   }
      // }
      // guildArray = guildArray.filter(function (el) {
      //   return el != null;
      // });
      return res.status(200).json({message: "Success", servers: notInLinkedArray, serversLinked: linkedArray});
    },function(err){
      if (err){
        console.log("There was an error with the db call");
        return res.status(500).json(err);
      }
    });
  }
}));
//add bot to server
router.get('/linkKeyTrader', catchAsync(async(req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=68672&redirect_uri=${redirectBot}&response_type=code&scope=guilds.join%20bot&guild_id=` + req.query.guildID)
}))

//link roles
router.get('/linkRoles', catchAsync(async(req, res) => {
  const roles = await fetch('http://localhost:1337/all-roles?guild_id='+ req.query.guildID,
  {
    method: 'POST'
  });

  var roleJson = await roles.json();
  console.log(roleJson);
  roleJson = roleJson.roles;
  console.log(roleJson);
  let rolesArray = new Array();
  for (role in roleJson.names){
    rolesArray.push(roleJson.names[role]);
  }

  for(let roleIndex = 0; roleIndex < rolesArray.length; roleIndex++){
    databaseRecords.checkRolesExist(rolesArray[roleIndex], req.query.guildID, function(results) {
      const countJson = JSON.parse(JSON.stringify(results));
      if (countJson[0]['COUNT(*)'] == 0){
        databaseRecords.saveRoles(rolesArray[roleIndex], 1, req.query.guildID, function() {
          console.log('roles saved');
          if(roleIndex == rolesArray.length - 1){
            res.redirect('/')
          }
        }, function(err){
          console.log(err);
          res.status(500).json(err);
        })
      }
      else{
        if(roleIndex == rolesArray.length - 1){
          res.redirect('/')
        }
        else{return;}
        }
    }, function(err){
      console.log(err);
      res.status(500).json(err);
    })
  }
}));

//redirect after adding bot ADDING SERVER TO DATABASE
router.get('/addServer', catchAsync(async(req, res) => {
  var serverLink = ' '
  const guildInfo = await fetch('http://localhost:1337/guild-info?guild_id=' + req.query.guild_id,
    {
      method: 'POST',
    });
    var guildJson = await guildInfo.json()
    const guildName = guildJson.name;

    databaseRecords.addServer(req.query.guild_id, guildName, serverLink, function(){
      console.log('adding server success');
      res.redirect('/api/discord/linkRoles?guildID=' + req.query.guild_id)
    },function(err){
      if (err){
        return res.status(500).json(err);
      }
    })
}))


//adding a key
router.post('/addKey',catchAsync(async(req, res) => {
  var price = req.body.key.gamePrice;
  var name = req.body.key.gameName;
  var id = req.body.key.gameID;
  var guildID = req.body.guildID;

  //inserting key into database
  databaseRecords.addKey(guildID, id, name, price, req.body.key.keyString, function(results){
    console.log(results);
    res.status(200).json(results);
  },function(err){
      return res.status(500).json(err);
  });
}));

//getting available keys
router.get('/getKeys', catchAsync(async (req, res) => { //gets server id in req.body and queries to get the keys
  console.log(req.query.guildID);
  databaseRecords.getKeys(req.query.guildID, function(results){
    var keyArray = new Array();
    const keyJson = JSON.parse(JSON.stringify(results));
    for (const key in keyJson){
      keyArray.push({gameName: keyJson[key].Key_name, gamePrice: keyJson[key].Key_price, keyString: keyJson[key].Key_string, gameID: keyJson[key].Key_ID});
    }
    res.status(200).json({message: "Success", keys: keyArray});
  },function(err){
    if (err){
      //console.log(err);
      return res.status(500).json(err);
    }
  });
}));

//sends what roles that user has to front end
router.get('/getUserRoles', catchAsync(async (req, res) => {
  let json_token = req.query.token;
  var id;
  jwt.verify(json_token, 'softwareengineeringismymajorandwegraduateinmay', function (err, decoded) {
        if(err){
           return res.status(500).json({
               title: 'An error occurred',
               error:err,
               message:err.message
           });
        }
        id = decoded.id;
    })
  // getting the roles
  const rolesInfo = await fetch('http://localhost:1337/user-roles?guild_id=' + req.query.guildID + '&user_id=' + id,
  {
    method: 'POST',
  });

  var userRolesTypes = await rolesInfo.json();
  var rolesArray = userRolesTypes.roles.names;

  var accessArray = new Array();
  rolesArray.forEach(role => {
    databaseRecords.getRoleType(role, req.query.guildID, function(results){
      const roleJson = JSON.parse(JSON.stringify(results));
      for (const role in roleJson){
        accessArray.push(roleJson[role].User_Role_Def);
        if (accessArray.length == rolesArray.length){
          //example of accessArray: ['Admin', 'Donor/Recipient']
          res.status(200).json({message: "Success", roleTypes: accessArray})
          break;
        }
      }
    }, function(err){
      console.log(err);
      return res.status(500).json(err);
    })
  });
}));


//getting all roles of a server
router.get('/getRoles', catchAsync(async (req, res) => {
  let guildID = req.query.guildID;
  const roles = await fetch('http://localhost:1337/all-roles?guild_id='+ guildID,
  {
    method: 'POST'
  });

  var roleJson = await roles.json();
  roleJson = roleJson.roles;
  let rolesArray = new Array();
  for (role in roleJson.names){
    rolesArray.push(roleJson.names[role]);
  }
  //example of rolesArray: [test1, test2]
  res.status(200).json({message: "Success", roles: rolesArray});
}));

//saving roles to database
router.post ('/saveRoles', catchAsync(async (req, res) => {

  //****** DISCORDROLES AND KEYTRADEROLES MUST LOOK LIKE THIS
  // let discordRoles = ["test1", "test2", "test3"];
  // let keyTraderRoles = ["Donor/Recipient", "Viewer", "Admin"];

  let discordRoles = req.body.serverRoles;
  let keyTraderRoles = req.body.serverUpdates;

  for(let roleIndex = 0; roleIndex < discordRoles.length; roleIndex++){
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

    databaseRecords.updateRoles(discordRoles[roleIndex], userRoleID, req.body.guildID, function() {
      console.log('roles updated');
      res.status(200).json({message: 'sucess'});
    }, function(err){
      console.log(err);
      return res.status(500).json(err);
    })
  }
}));

//getting keytrader roles
router.get('/getKeyTraderRoles', catchAsync( async(req, res) => {
  var roleDataArray = new Array();
  databaseRecords.getKeyTraderRoles(req.query.guildID, function(results) {

    const rolesDataJson = JSON.parse(JSON.stringify(results));
    for (const data in rolesDataJson){
      roleDataArray.push({roleName: rolesDataJson[data].Role_Name, roleType: rolesDataJson[data].User_Role_Def});
    }
    res.status(200).json({message: "Success", keyTraderRoles: roleDataArray});
    // example of rolesData: [roleName: 'test1', roleType: 'Admin'], [roleName: 'test2', roleType: 'Donor']
  }, function(err){
    console.log(err);
    res.status(500).json(err);
  })

}));

//Redeem a key for a user
router.post('/redeemKey', catchAsync(async (req, res) => {
  let keyString = req.body.keyString;
  let json_token = req.body.token;
  let userID = null;
  jwt.verify(json_token, 'softwareengineeringismymajorandwegraduateinmay', function (err, decoded) {
        if(err){
           return res.status(500).json({
               title: 'An error occurred',
               error:err,
               message:err.message
           });
        }
        userID = decoded.id;
    })

  databaseRecords.redeemKey(keyString, userID, function(){
    res.status(200).json({message: "Success"})
  })
}))

//getting redeemed keys of user
router.get('/userKeys', catchAsync(async (req, res) => {
  let json_token = req.query.token;
  let userID = null;
  jwt.verify(json_token, 'softwareengineeringismymajorandwegraduateinmay', function (err, decoded) {
    if(err){
      return res.status(500).json({
        title: 'An error occurred',
        error:err,
        message:err.message
      });
    }
    userID = decoded.id;
  })

  databaseRecords.getUserKeys(userID, function(results){
    let keyArray = new Array();
    const keyJson = JSON.parse(JSON.stringify(results));
    for (const key in keyJson){
      keyArray.push({gameName: keyJson[key].Key_name, gamePrice: keyJson[key].Key_price, keyString: keyJson[key].Key_string, gameID: keyJson[key].Key_ID});
    }
    res.status(200).json({message: "Success", keys: keyArray});
  })
}));

router.get('/checkSteamKey', catchAsync(async(req, res) => {
   const gameID = req.query.gameID;

    //getting JSON of game info
    const gameInfo = await fetch("https://store.steampowered.com/api/appdetails?appids=" + gameID,
    {
      method: 'GET',
    });

    const gameJson = await gameInfo.json();
    var price = gameJson[gameID].data.price_overview.final;
    var name = gameJson[gameID].data.name;

    await res.status(200).json({message: "Success", key: {gameName: name, gamePrice: price}})
}));

router.get('/isVerified', catchAsync(async(req, res)=> {
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
}));

router.get('/kickBot', catchAsync(async(req, res)=>{
  var oldArray = new Array();
  var newArray = new Array();
  databaseRecords.getLinkedServers(function(results){
    var linkedJson = JSON.parse(JSON.stringify(results));
    for (const linkedGuild in linkedJson){
      oldArray.push({serverName: linkedJson[linkedGuild].Server_Name}) //insert serverName into old array
    }
  })
  //Need to make a call here to get newArray.
  // We are going to be comparing Server names because im not sure Server_IDs are working correctly in db.
  let difference = newArray.filter(x => !oldArray.includes(x));
  //difference array is the diff of the two arrays with server names
  for (let i =0; i < difference.length; i++){
    detabaseRecords.deleteServer(difference[i], function(results){
      res.status(200).json({message: "Success, server deleted from Database"});
    })
  }
}))

router.post('/storeChannel', catchAsync(async(req, res)=>{
  let guildID = req.body.guildID;
  let channelID = req.body.channelID;
  databaseRecords.getChannelId(guildID,function(results){
  var channelArray = new Array();
  let channelJson = JSON.parse(JSON.stringify(results));
    for(const channel in channelJson){
      channelArray.push(channelJson[channel]);
    }
    if(typeof channelArray[0] === 'undefined'){
      databaseRecords.insertChannel(channelID, guildID, function(){
        res.status(200).json({message: "Channel inserted to database."})
      })
    }
    else{
      databaseRecords.updateChannel(channelID, guildID, function(){
        res.status(200).json({message:"Channel updated in database."})
      })
    }
  })
}))

//
router.post('/storeSettings', catchAsync(async(req, res)=>{
  let keysAdded = req.body.keysAdded;
  let keysClaimed = req.body.keysClaimed;
  let newUser = req.body.newUser;
  let guildID = req.body.guildID;
  let idJson;

  var idArray = new Array();
  databaseRecords.getIdFromSettings(guildID,function(results){
    idJson = JSON.parse(JSON.stringify(results));
    console.log(idJson)
    for(const id in idJson){
      idArray.push(idJson[id]);
    }

    if(idArray[0]){
      console.log('defined');
      databaseRecords.updateSettings(keysAdded, keysClaimed, newUser, guildID, function(){
        res.status(200).json({message:"Settings updated in database."});
      })
    }
    else{
      console.log('undefined');
      databaseRecords.insertSettings(keysAdded, keysClaimed, newUser, guildID, function(){
        res.status(200).json({message: "Settings saved to database."});
      }, function(err) {
        res.status(500).json({message: "Failed to insert settings", err})
      })
    }

    }
  )
  console.log(idJson);
  console.log(idArray);
  console.log(typeof(idArray[0]))

}))


 router.post('/sendNotification', catchAsync(async(req, res)=>{
  let server_ID = req.body.guildID;
  var settingArray = new Array();
  var channelArray = new Array();
  let channel_ID;
   getSettings(async function(settingArray, server_ID, channel_ID){
//Callback method starts here
//If the channel_ID is undefined, we request the bot to give us channels for a specific server ID
     if (typeof(channel_ID) == 'undefined'){
      const channels = await fetch(`http://localhost:1337/channels?guild_id=`+server_ID,
      {
        method: 'POST',
      });
      //Channels are in channelJson
      var channelJson = await channels.json();
      channel_ID = channelJson.channels[0].id;
     }
     //Check the notification type passed by front end
    let notificationType = req.body.notificationType;
    //Depending on the notification type, we send out a different message to a given server/channel.
    switch(notificationType){
      case 'newKey':
        if (settingArray[0].newKey == '1'){
          var message = "A new key has been created."
          channel_ID = channel_ID.Channel_ID;
          const sendNotification = await fetch(`http://localhost:1337/announce?message=${message}&guild_id=${server_ID}&channel_id=${channel_ID}`,
          {
            method: 'POST',
          });
          console.log(sendNotification);
          await res.status(200).json({message: "Notification sent for new key"});
        }
        else{
          await res.status(200).json({message:"Notification disregarded for new key"})
        }
        break;
      case 'claimedKey':
        if (settingArray[0].claimedKey == '1'){
          var message = "A new key has been claimed."
          channel_ID = channel_ID.Channel_ID;
          const sendNotification = await fetch(`http://localhost:1337/announce?message=${message}&guild_id=${server_ID}&channel_id=${channel_ID}`,
          {
            method: 'POST',
          });
          console.log(sendNotification);
          await res.status(200).json({message: "Notification sent for claim"});
        }
        else{
          await res.status(200).json({message:"Notification disregarded for claim"});
        }
        break;
      case 'newUser':
        if (settingArray[0].newUser == '1'){
          var message = "A new user has been created."
          channel_ID = channel_ID.Channel_ID;
          const sendNotification = await fetch(`http://localhost:1337/announce?message=${message}&guild_id=${server_ID}&channel_id=${channel_ID}`,
          {
            method: 'POST',
          });
          console.log(sendNotification);
          await res.status(200).json({message: "Notification sent new user"});
        }
        else{
          await res.status(200).json({message:"Notification disregarded new user"})
        }
        break;
    }
   }, function(err){
    console.log(err);
    console.log("Somethings gone wrong");
    return res.status(500).json(err);
  });

  //Logic starts here
   function getSettings(callback){
     //Check database for existing settings
    databaseRecords.getSettings(server_ID, function(results){
      var settingsJson = JSON.parse(JSON.stringify(results));
      for (const setting in settingsJson){
        settingArray.push({newKey: settingsJson[setting].newKey, claimedKey: settingsJson[setting].claimedKey, newUser: settingsJson[setting].newUser})
      }
      //Push those settings into settingArray, Check database for existing channel selection
      databaseRecords.getChannels(server_ID, function(resultstwo){
        var channelJson = JSON.parse(JSON.stringify(resultstwo));

        for (const channel in channelJson){
          channelArray.push(channelJson[channel]);
          //Push existing channel selection into channelArray
        }
        //If settingArray[0] is undefined that means settings have not been previously set in the DB and we will default all settings to be 1.
        if (typeof(settingArray[0])=='undefined'){
          settingArray.push({newKey: '1', claimedKey: '1', newUser: '1'});
        }
        //Set the channel_ID to the ID in the channel, might be empty - we check later. channelArray should not have more than one channel in it because we can only select 1 channel.
        channel_ID = channelArray[0];

        //We call our callback method which starts on line 524. We pass settingArray, server ID, and channel ID.
        callback(settingArray, server_ID, channel_ID);
      })
     })
   }
  }))


router.get('/getChannels', catchAsync(async(req, res)=>{
  let guildID = req.query.guildID;
  const channels = await fetch(`http://localhost:1337/channels?guild_id=`+guildID,
    {
      method: 'POST',
    });
  var channelJson = await channels.json();
  let channelArray = new Array();
  for (let channel in channelJson){
    channelArray.push(channelJson[channel]);
  }
  res.status(200).json({message: "Channels for server retrieved.", channels: channelArray});
}))

router.get('/getNotifications', catchAsync(async(req, res)=>{
  let settingArray = new Array();
  let guildID = req.query.guildID;

  databaseRecords.getSettings(guildID, function(results){
    var settingsJson = JSON.parse(JSON.stringify(results));
    for (const setting in settingsJson){
      settingArray.push({newKey: settingsJson[setting].newKey, claimedKey: settingsJson[setting].claimedKey, newUser: settingsJson[setting].newUser})
    }
    if (typeof settingArray[0] == 'undefined'){
      settingArray.push({newKey: 1, claimedKey: 1, newUser: 1});
    }
    res.status(200).json({message: "Settings saved to database.", notifications: settingArray});
  }, error => {
    console.log(error);
  })
}))

router.post('/getKeyCount', catchAsync(async (req, res) => {
  console.log(req.body);
  //check if user is admin, if it is, then count # of keys
  databaseRecords.getGuildRoles(req.body.guildID, function(results){
    const roleJson = JSON.parse(JSON.stringify(results));
    // iterate over req.body.roles
    console.log(roleJson);
    for (const role in roleJson){
      console.log(roleJson[role]);
      if (roleJson[role].User_Role_Def === 'Admin' && req.body.roles.includes(roleJson[role].Role_Name)){
        console.log("sdfgsdfglknsdfg")
        return databaseRecords.keyNumber(req.body.guildID, function(results){
          const countJson = JSON.parse(JSON.stringify(results));
          return res.status(200).json({message: "Success", count: countJson[0]['COUNT(*)']});
        }, function(err) {
          return res.status(500).json({message: "get key count"});
        })
      }
    }
    return res.status(403).json({message: "Fail. User is not an Admin"});
  }, function(err) {
    return res.status(500).json({message: "getGuildRoles err", err: err});
  })
  //if fail return res.status(403)
}))

module.exports = router;
