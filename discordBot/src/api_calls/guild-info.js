// Give the requester important information about the guild

exports.path = '/guild-info'

exports.requiredParameters = ['guild_id'];

exports.run = (client, req, res) => {
  // get guild or tell respond with an error
  let guild = client.guilds.fetch(req.query.guild_id)
  .then(guild => {
    res.send({
      success: true,
      name: guild.name,
      icon: guild.iconURL
    });
  })
  .catch( err => {
    console.error(err);
    res.send({
      success: false,
      info: "The guild you requested does not exist"
    });
  }
  );
  // let guild = client.guilds.cache.get(req.query.guild_id);
  // if (guild == undefined)
  // {
  //   return;
  // }

}
