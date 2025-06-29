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

  // Normalize both dates to midnight (local time)
  const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = today.getTime() - startDay.getTime();

  // Floor the difference to get full days passed, no +1
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
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

    // Run immediately on bot startup
    countups.forEach(entry => updateChannelName(client, entry));

    // Schedule daily updates at midnight
    cron.schedule('0 0 * * *', () => {
      countups.forEach(entry => updateChannelName(client, entry));
    });
  }
};