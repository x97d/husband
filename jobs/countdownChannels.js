const cron = require('node-cron');
const { ChannelType } = require('discord.js');

// 🎯 Define each countdown target and channel
const COUNTDOWNS = [
  {
    name: 'Cody Checkin',
    date: new Date('2025-07-22'),
    channelId: '1390991160272617522',
    emoji: '✈️'
  },
  {
    name: 'Cody Flies',
    date: new Date('2025-07-25'),
    channelId: '1386363914513813645',
    emoji: '✈️'
  },
  {
    name: 'Finish Work',
    date: new Date('2025-07-24'),
    channelId: '1386363902400663582',
    emoji: '🏢'
  },
  {
    name: 'Move In',
    date: new Date('2025-07-30'),
    channelId: '1386363926341746769',
    emoji: '🏡'
  }
];

// 🧮 Calculate remaining time (days, hours, minutes)
function getTimeRemaining(targetDate) {
  const now = new Date();

  // Target at END of day (23:59:59)
  const target = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
    23, 59, 59
  );

  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  const totalMinutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return { days, hours, minutes };
}

// 🔁 Update all countdown channels
async function updateCountdowns(client) {
  for (const countdown of COUNTDOWNS) {
    const remaining = getTimeRemaining(countdown.date);

    const newName =
      `${countdown.emoji} ` +
      `${remaining.days}d ${remaining.hours}h ${remaining.minutes}m - ${countdown.name}`;

    try {
      const channel = await client.channels.fetch(countdown.channelId);

      if (!channel || 
        (channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildText)) {
        console.error(`❌ Invalid channel type for ${countdown.name}`);
        continue;
      }

      await channel.setName(newName);
      console.log(`✅ Updated ${countdown.name} channel to "${newName}"`);
    } catch (err) {
      console.error(`❌ Error updating ${countdown.name} channel:`, err);
    }
  }
}

// 🗓️ Schedule the job
module.exports = {
  name: 'countdownChannels',
  schedule(client) {
    console.log('📅 Starting countdown channels job');

    // Run immediately when bot starts
    updateCountdowns(client);

    // Then run hourly, at minute 0
    cron.schedule('0 * * * *', () => {
      updateCountdowns(client);
    });
  }
};