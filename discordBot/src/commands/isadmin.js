// relays whether the calling user is an admin on this guild.

exports.run = (client, message, args) => {
    if(message.member.hasPermission("ADMINISTRATOR"))
    {
      message.reply(`You're an admin!`).catch(console.error);
    }
    else
    {
      message.reply(`You're not an admin!`).catch(console.error);
    }
}
