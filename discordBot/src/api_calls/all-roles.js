// Check the role of a given user
exports.path = "/all-roles"

exports.requiredParameters = ['guild_id'];

exports.run = (client, req, res) => {
  // get guild or tell respond with an error
  let guild = client.guilds.cache.get(req.query.guild_id);
  if (guild == undefined)
  {
    res.send({
      success: false,
      info: "The guild you requested does not exist"
    });
    return;
  }

  let roles = {
    ids: [],
    names: [],
  }

  guild.roles.cache.forEach(role => {
    roles.ids.push(role.id);
    roles.names.push(role.name);
  });

  res.send({
    success: true,
    roles: roles
  });
}
