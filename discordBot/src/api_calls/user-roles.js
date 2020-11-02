// Check the rank of a given user
exports.path = "/user-roles"

exports.requiredParameters = ['guild_id', 'user_id'];

exports.run = (client, req, res) => {
  // get guild
  let guild = client.guilds.cache.get(req.query.guild_id);
  if (guild == undefined)
  {
    res.send({
      success: false,
      info: "The guild you requested does not exist"
    });
    return;
  }

  // find id of user to use for mentions.
  let member = guild.members.cache.get(req.query.user_id)

  if (member == null) {
    res.send({
      success: false,
      info: "Cannot find user: " + req.query.user_id
    });
    return;
  }

  let roles = {
    ids: [],
    names: [],
  }
  member.roles.cache.forEach(role => {
    roles.ids.push(role.id);
    roles.names.push(role.name);
  });


  // let rank = member.hasPermission("ADMINISTRATOR") ? 'admin' : 'standard';

  res.send({
    success: true,
    user: req.query.user,
    roles: roles
  });
}
