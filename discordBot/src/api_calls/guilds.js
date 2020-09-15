// List the guilds that KeyTrader Bot is connected to.
exports.path = "/guilds"

exports.requiredParameters = [];

exports.run = (client, req, res) => {
  guilds = [];

  client.guilds.forEach((guild) => {
    guilds.push({
      name: guild.name,
      id: guild.id
    });
  });

  res.send({
    success: true,
    guilds: guilds
  });
}
