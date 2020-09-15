// Tests the discord bot connection. (Responds with "Pong!")

exports.run = (client, message, args) => {
    message.channel.send("pongu!").catch(console.error);
}
