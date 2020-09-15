// Shows the bot's help page

const Discord = require('discord.js');

exports.run = (client, message, args) => {
  message.react('👍');
  let embed;

  if (args[0] == "commands") {
    embed = new Discord.RichEmbed()
      .setColor('#F200FF')
      .setTitle("KeyTrader Bot Commands")
      .setDescription(
        `!kt_help - Shows the bot's help page
        !kt_keycount - Tells you how many keys are currently saved for this guild.
        !kt_ping - Tests the discord bot connection. (Responds with "Pong!")
        !kt_reload [commandName] - reloads a command
        !kt_fetchguildinfo - relays important guild information: a guild's roles, guild id, and guild icon
        !kt_isadmin - relays whether the calling user is an admin on this guild.
        !kt_kanye - a fun little Kanye West inspired easter egg
        `
      );
        // !kt_listgames - WIP
        // !kt_getstats - WIP
  } else {
    embed = new Discord.RichEmbed()
    .setColor('#F200FF')
    .setTitle("KeyTrader Bot Help")
    .setDescription(
      `This is the Discord bot for KeyTrader.
      KeyTrader is a program for trading game keys between friends.
      The project is designed as part of the Chapman Software Engineering program.

      All configuration for the bot can be found at:
      https://keytrader.xyz/
      (Or wherever your version of KeyTrader is hosted)

      This bot has a few commands that are helpful for developers.
      To list commands, call:
      \`!kt_help commands\`
      (Note: KeyTrader refers to Discord servers as "guilds", to match the Discord API's official terminology)
      `
    );
  }

  // Send the help info as a private message to whoever called the help command
  message.author.send(embed);
}
