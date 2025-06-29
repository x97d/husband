const cron = require('node-cron');
const { ChannelType } = require('discord.js');

// ✅ List of count-up channels
const countups = [
  {
    channelId: '1386357384045269082', // Replace with real channel ID
    startDate: new Date('2024-06-22'),
    label: 'Together'
  },
  {
    channelId: '1388892461455249521', // Example second channel
    startDate: new Date('2025-06-05'),
    label: 'Married'
  },
];

function calculateDayCount(startDate) {
  const now = new Date();
  const diffTime = now.getTime() - startDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

async function updateChannelName(client, { channelId, startDate, label }) {
  const days = calculateDayCount(startDate);

  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel || (channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildText)) {
      console.error(`❌ Invalid channel type for ID: ${channelId}`);
      return;
    }

    const newName = `🗓️ Day ${days} ${label}`;
    await channel.setName(newName);
    console.log(`✅ Updated channel (${channelId}) to: ${newName}`);
  } catch (err) {
    console.error(`❌ Failed to update channel ${channelId}:`, err);
  }
}

module.exports = {
  name: 'countupChannels',
  schedule(client) {
    console.log('📆 Starting multiple count-up channel job');

    // 🔄 Run immediately on start
    countups.forEach(entry => updateChannelName(client, entry));

    // 🕛 Schedule to run every day at 12:00 AM
    cron.schedule('0 0 * * *', () => {
      countups.forEach(entry => updateChannelName(client, entry));
    });
  }
};
