import cron from 'node-cron';
import NotificationService from '../services/notificationService.js';

// Run every hour
cron.schedule('0 * * * *', async () => {
  console.log('Processing scheduled notifications...');
  await NotificationService.processScheduledNotifications();
}); 