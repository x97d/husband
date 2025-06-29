module.exports = {
  name: 'ping',
  description: 'Replies with the bot latency and API latency.',
  async execute(message, args, client) {
    const sent = await message.channel.send('Pinging...');
    const latency = sent.createdTimestamp - message.createdTimestamp;
    const apiPing = Math.round(client.ws.ping);
    sent.edit(`🏓 Pong!\nBot Latency: ${latency}ms\nAPI Latency: ${apiPing}ms`);
  }
};
