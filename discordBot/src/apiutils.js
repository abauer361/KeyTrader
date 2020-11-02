// a set of helpful functions used by some of the api calls

// SendToChannel:
// Send a message `message` to a given channel on a given guild,
// then tell the caller of the api call whether this function succeeded
exports.SendToChannel = (discordClient, res, guild_id, channel_id, message) => {
  // get guild or tell respond with an error
  let guild = discordClient.guilds.cache.get(guild_id);
  if (guild == undefined)
  {
    res.send({
      success: false,
      info: "The guild you requested does not exist, or the bot does not have access to it."
    });
    return;
  }
  // get the guild's announcement channel
  let channel = guild.channels.cache.get(channel_id);
  if (channel == undefined)
  {
    res.send({
      success: false,
      info: "The channel you requested does not exist, or the bot does not have access to it."
    });
    return;
  }

  // send message to the channel
  channel.send(message);
  // send success message
  res.send({
    success: true,
    message: message
  });
};
