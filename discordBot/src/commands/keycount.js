// Reports the number of keys in this server
const fetch = require('node-fetch');

exports.run = async (client, message, args) => {

  // form request body
  body = {
    guildID: message.guild.id,
    roles: []
  };

  // fill body.roles with the calling user's roles
  message.member.roles.forEach(role => {
    body.roles.push(role.name);
  });

  body = JSON.stringify(body);
  const response = await fetch(`https://localhost/api/discord/getKeyCount`, {
    headers: {'Content-Type': 'application/json'},
    method: 'POST',
    body: body
  });
  console.log(response);

  const content = await response.json();

  console.log(content);
  numKeys = content.count;

  if (response.status === 200) {
    message.channel.send(`This KeyTrader server has ${numKeys} keys`).catch(console.error);
  }
}
