module.exports = {
  name: 'ping',
  description: 'Replies with the bot latency and API latency.',
  async execute(message, args, client) {
    const sent = await message.channel.send('Pinging...');
    const latency = sent.createdTimestamp - message.createdTimestamp;
    const apiPing = client.ws.ping;

    const apiLatencyDisplay = apiPing >= 0 ? `${Math.round(apiPing)}ms` : 'Unknown';

    sent.edit(`🏓 Pong!\nBot Latency: ${latency}ms\nAPI Latency: ${apiLatencyDisplay}`);
  }
};
