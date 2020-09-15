// Send a mention to a player in the server channel
utils = require("../apiutils.js")

exports.path = '/mention'

exports.requiredParameters = ['guild_id', 'channel_id', 'message', 'user'];

exports.run = (client, req, res) => {
  // get guild object
  let guild = client.guilds.get(req.query.guild_id);
  if (guild == undefined)
  {
    res.send({
      success: false,
      info: "The guild you requested does not exist"
    });
    return;
  }

  // find id of user to use for mentions.
  let member = guild.members.find(member => member.user.username.toLowerCase() == req.query.user.toLowerCase())

  if (member == null) {
    res.send({
      success: false,
      info: "Cannot find user: " + req.query.user
    });
    return;
  }

  let message = "<@" + member.id + "> " + req.query.message;
  utils.SendToChannel(client, res, req.query.guild_id, req.query.channel_id, message);
}
