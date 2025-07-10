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

// 🧮 Calculate remaining time (to 00:00 of target day)
function getTimeRemaining(targetDate) {
  const now = new Date();

  // Target at START of day (00:00:00)
  const target = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
    0, 0, 0
  );

  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return null; // already today or past
  }

  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  return { days, hours };
}

// 🔁 Update all countdown channels
async function updateCountdowns(client) {
  console.log('🔄 Running updateCountdowns...');

  for (const countdown of COUNTDOWNS) {
    console.log(`⏳ Updating countdown: ${countdown.name}`);

    try {
      const channel = await client.channels.fetch(countdown.channelId);

      if (!channel) {
        console.error(`❌ Channel not found: ${countdown.channelId} (${countdown.name})`);
        continue;
      }

      console.log(`🔍 Found channel "${channel.name}" of type ${channel.type}`);

      if (channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildText) {
        console.error(`❌ Invalid channel type for ${countdown.name}: ${channel.type}`);
        continue;
      }

      const remaining = getTimeRemaining(countdown.date);
      let newName;
      if (!remaining) {
        newName = `🎉 Today! - ${countdown.name}`;
      } else {
        newName = `${countdown.emoji} ${remaining.days}d ${remaining.hours}h - ${countdown.name}`;
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
