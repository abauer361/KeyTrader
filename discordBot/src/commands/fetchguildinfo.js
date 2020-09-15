// relays important guild information: a guild's roles, guild id, and guild icon

exports.run = (client, message, args) => {
    message.guild.roles.forEach(role => message.channel.send(`Roles: ${role.name}, ${role.id}`));
    message.channel.send(`Guild ID: ${message.guild.id}`).catch(console.error);
    message.channel.send(`Guild Icon URL: ${message.guild.iconURL}`).catch(console.error)
}
