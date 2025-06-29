const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`✅ Logged in as ${client.user.tag}`);

    try {
    const channel = await client.channels.fetch('1388892461455249521');
    await channel.setName(`Test Rename ${Date.now()}`);
    console.log('Rename success');
  } catch (err) {
    console.error('Rename failed:', err);
  }

    // Load and schedule jobs
    const jobsPath = path.join(__dirname, '../jobs');
    const jobFiles = fs.readdirSync(jobsPath).filter(file => file.endsWith('.js'));

    for (const file of jobFiles) {
      const job = require(`${jobsPath}/${file}`);
      if (typeof job.schedule === 'function') {
        job.schedule(client);
      }
    }

    console.log('🛠️ All scheduled jobs initialized.');
  }
};
