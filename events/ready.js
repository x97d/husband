const fs = require('fs');
const path = require('path');

const countdownChannels = require('./jobs/countdownChannels');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`✅ Logged in as ${client.user.tag}`);

    // Load and schedule jobs
    const jobsPath = path.join(__dirname, '../jobs');
    const jobFiles = fs.readdirSync(jobsPath).filter(file => file.endsWith('.js'));

    for (const file of jobFiles) {
      const job = require(`${jobsPath}/${file}`);
      if (typeof job.schedule === 'function') {
        job.schedule(client);
      }
    }

    countdownChannels.schedule(client);

    console.log('🛠️ All scheduled jobs initialized.');
  }
};
