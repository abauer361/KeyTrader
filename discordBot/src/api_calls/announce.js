// Send announcement to server channel
utils = require("../apiutils.js")

exports.path = "/announce"

exports.requiredParameters = ['guild_id', 'channel_id', 'message'];

exports.run = (client, req, res) => {
  utils.SendToChannel(client, res, req.query.guild_id, req.query.channel_id, req.query.message);
}
