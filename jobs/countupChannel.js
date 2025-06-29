const cron = require('node-cron');
const { ChannelType } = require('discord.js');

// List of count-up channels to update
const countups = [
  {
    channelId: '1386357384045269082', // Your first channel ID
    startDate: new Date('2024-06-22'),
    label: 'Together',
  },
  {
    channelId: '1388892461455249521', // Your second channel ID
    startDate: new Date('2025-06-05'),
    label: 'Married',
  },
];

function calculateDayCount(startDate) {
  const now = new Date();

  // Normalize both dates to midnight (local time)
  const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = today.getTime() - startDay.getTime();

  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
}

async function updateChannelName(client, { channelId, startDate, label }) {
  const days = calculateDayCount(startDate);

  try {
    const channel = await client.channels.fetch(channelId);
    console.log(`Channel fetched: Name=${channel.name}`);

    if (!channel) {
      console.error(`❌ Channel not found: ${channelId}`);
      return;
    }

    // You can comment out this check for debugging if needed
    if (channel.type !== ChannelType.GuildText && channel.type !== ChannelType.GuildVoice) {
      console.warn(`⚠️ Channel type not supported for rename: ${channel.type}`);
      // return; // Uncomment if you want to block unsupported types
    }

    const newName = `🗓️ Day ${days} ${label}`;
    await channel.setName(newName);
    console.log(`✅ Updated channel (${channelId}) to: ${newName}`);
  } catch (err) {
    console.error(`❌ Failed to update channel ${channelId}:`, err);
  }
}

// Optional: Test renaming a channel once on bot ready
async function testRename(client, channelId) {
  try {
    const channel = await client.channels.fetch(channelId);
    await channel.setName(`🧪 Test Rename ${Date.now()}`);
    console.log(`Successfully renamed channel ${channelId} (test rename)`);
  } catch (err) {
    console.error(`Failed test rename for channel ${channelId}:`, err);
  }
}

module.exports = {
  name: 'countupChannels',
  schedule(client) {
    console.log('📆 Starting multiple count-up channel job');

    // Run immediately on bot startup
    countups.forEach(entry => updateChannelName(client, entry));

    // Run a test rename on second channel to troubleshoot (optional)
    // Uncomment below line to run test rename once on startup
    // testRename(client, '1388892461455249521');

    // Schedule daily updates at midnight
    cron.schedule('0 0 * * *', () => {
      countups.forEach(entry => updateChannelName(client, entry));
    });
  },
};
