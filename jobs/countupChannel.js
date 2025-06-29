const cron = require('node-cron');
const { ChannelType } = require('discord.js');

const START_DATE = new Date('2024-06-22');
const CHANNEL_ID = '1386357384045269082';

function calculateDayCount() {
  const now = new Date();

  // Normalize both dates to start of day (midnight)
  const startDay = new Date(
    START_DATE.getFullYear(),
    START_DATE.getMonth(),
    START_DATE.getDate(),
  );
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = today.getTime() - startDay.getTime();

  // Floor the difference to get full days passed, no +1
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
}

async function updateChannelName(client) {
  const days = calculateDayCount();

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel || (channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildText)) {
      console.error('❌ Invalid or unsupported channel type');
      return;
    }

    await channel.setName(`🗓️ Day ${days} Together`);
    console.log(`✅ Channel name updated to: Day ${days}`);
  } catch (err) {
    console.error('❌ Failed to update channel name:', err);
  }
}

module.exports = {
  name: 'countupChannel',
  schedule(client) {
    console.log('🗓️ Starting count-up channel job');

    // ⏱️ Run immediately when bot starts
    updateChannelName(client);

    // 🕛 Schedule daily at 12:00 AM
    cron.schedule('0 0 * * *', () => {
      updateChannelName(client);
    });
  }
};
