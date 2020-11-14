/////////////////////////////////////////////////////////////////
// This file is the most important file.
// To run the project, call `node ktbot.js`.
// This file loads all of the bot commands and api calls,
// and it creates the API web server.
/////////////////////////////////////////////////////////////////

const Discord = require('discord.js');
const Enmap = require('enmap');
const fs = require("fs");
const dotenv = require('dotenv').config()

const client = new Discord.Client({ ws: { intents: ['GUILDS', 'GUILD_PRESENCES', 'GUILD_MEMBERS'] }});

const CONFIG = require('../config.json');
try {
  CONFIG.BOT_TOKEN = process.env.BOT_TOKEN
} catch (e) {
  console.log("Error: Missing discord bot token.")
  console.log("Please save your token in a file called \"bot-token.json\", in the same directory as your config.json")
  process.exit(1);
}

client.config = CONFIG;

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
  });
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('Type !kt_help for commands');
});

client.login(CONFIG.BOT_TOKEN);

////////////////////////////////////////////////////////////////////////////////
// Web API for sending messages to Discord
////////////////////////////////////////////////////////////////////////////////
const express = require('express');
const app = express();
const port = 1337;

// get every module in api_calls folder and turn it into a post api call
fs.readdir("./api_calls/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const call = require(`./api_calls/${file}`);
    app.post(call.path, runOrListMissingParams(call));
    console.log("[API] adding post request: " + call.path)
  });
  app.listen(port);
  console.log("Web server API is loaded.");
});

function runOrListMissingParams(api_call) {
  return (req, res) => {
    let missingParams = getMissingParameters(req.query, api_call.requiredParameters)
    if (missingParams.length !== 0) {
      res.send({
        success: false,
        info: "Post request is missing the parameters: " + missingParams
      });
      return;
    }
    api_call.run(client, req, res)
  }
}

// get a list of the missing parameters for a given api call
function getMissingParameters(query, params) {
  let missingParameters = '';
  params.forEach((param, i) => {
    if (!(param in query)) {
      hasAllParameters = false;
      if (missingParameters != '') {
        missingParameters += ', '
      }
      missingParameters += param
    }
  });
  return missingParameters;
}
// // get the guild id
// let guild_id = message.guild.id;
//
// // get a guild object by id
// let guild = client.guilds.get(guild_id);
//
// // get a member object from nku.-'s id
// let member = guild.members.get("193102196584349696")
//
// console.log(member.user)
//
// // is-admin api:
// // request parameters: guild-id, [list of nicknames#1234])

/*
function checkAdmin(member)
{
  var isAdmin = false;
  var jsonData = {};

  if(member.hasPermission("ADMINISTRATOR")){
    isAdmin = true;
  }

  jsonData = {"isAdmin": isAdmin};
  return jsonData;
}
*/
