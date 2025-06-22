const cron = require('node-cron');
const { ChannelType } = require('discord.js');

// 🎯 Define each countdown target and channel
const COUNTDOWNS = [
  {
    name: 'Cody Flies',
    date: new Date('2025-07-25'),
    channelId: '1363961717104840785',
    emoji: '✈️'
  },
  {
    name: 'Finish Work',
    date: new Date('2025-07-24'),
    channelId: '1345850539035852911',
    emoji: '🏢'
  },
  {
    name: 'Move In',
    date: new Date('2025-07-30'),
    channelId: '1365092582824349776',
    emoji: '🏡'
  }
];

// 🔢 Calculate remaining days
function getDaysRemaining(targetDate) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// 🔁 Update all countdowns
async function updateCountdowns(client) {
  for (const countdown of COUNTDOWNS) {
    const daysRemaining = getDaysRemaining(countdown.date);

    const newName = `${countdown.emoji} ${daysRemaining} Day${daysRemaining !== 1 ? 's' : ''} - ${countdown.name}`;

    try {
      const channel = await client.channels.fetch(countdown.channelId);
      if (!channel || (channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildText)) {
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

module.exports = {
  name: 'countdownChannels',
  schedule(client) {
    console.log('📅 Starting countdown channels job');

    // ✅ Run immediately on bot start
    updateCountdowns(client);

    // 🕛 Then run daily at 12:00 AM
    cron.schedule('0 0 * * *', () => {
      updateCountdowns(client);
    });
  }
};
