// List all channels in text a guild that are available to KeyTrader Bot
exports.path = "/channels"

exports.requiredParameters = ["guild_id"];

exports.run = (client, req, res) => {
  // get guild or tell respond with an error
  let guild = client.guilds.get(req.query.guild_id);
  if (guild == undefined)
  {
    res.send({
      success: false,
      info: "The guild you requested does not exist"
    });
    return;
  }

  channels = [];
  guild.channels.forEach((c) => {
    if (c.type !== "text") {
      return;
    }
    channels.push({
      name: c.name,
      id: c.id
    });
  });

  res.send({
    success: true,
    channels: channels
  });
}
