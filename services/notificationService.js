import nodemailer from "nodemailer";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import Movie from "../models/movieModel.js";
import Profile from "../models/profileModel.js";
import { emailTemplates } from '../utils/emailTemplates.js';

class NotificationService {
  constructor() {
    try {
      // Check if required environment variables are set
      if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
        throw new Error('Email configuration missing: EMAIL_USER and EMAIL_APP_PASSWORD are required');
      }

      console.log('Initializing email transporter with:', {
        user: process.env.EMAIL_USER,
        // Don't log the password
      });

      // Initialize transporter
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD
        },
        debug: true // Enable debug logs
      });

      // Verify the connection
      this.verifyConnection();
    } catch (error) {
      console.error('Failed to initialize email transporter:', error);
      // Don't throw here, just log the error
    }
  }

  async verifyConnection() {
    try {
      const verification = await this.transporter.verify();
      console.log('SMTP connection verified:', verification);
      return verification;
    } catch (error) {
      console.error('SMTP verification failed:', error);
      throw error;
    }
  }

  async createReleaseReminder(userId, movieId, releaseDate) {
    try {
      const movie = await Movie.findById(movieId);
      if (!movie) throw new Error("Movie not found");

      // Create notification 3 days before release
      const reminderDate = new Date(releaseDate);
      reminderDate.setDate(reminderDate.getDate() - 3);

      const notification = await Notification.create({
        user: userId,
        movie: movieId,
        type: "RELEASE_REMINDER",
        message: `${movie.title} is releasing in 3 days!`,
        scheduledFor: reminderDate,
      });

      return notification;
    } catch (error) {
      console.error("Error creating release reminder:", error);
      throw error;
    }
  }

  async sendEmailNotification(notification) {
    try {
      const user = await User.findById(notification.user).select('email name');
      const movie = await Movie.findById(notification.movie).select('title releaseDate posterUrl');

      const template = emailTemplates[notification.type](user.name, movie);

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: template.subject,
        html: template.html
      };

      await this.transporter.sendMail(mailOptions);

      // Update notification status
      notification.isRead = true;
      await notification.save();

      return true;
    } catch (error) {
      console.error('Error sending email notification:', error);
      throw error;
    }
  }

  async processScheduledNotifications() {
    try {
      const now = new Date();
      const notifications = await Notification.find({
        scheduledFor: { $lte: now },
        isRead: false
      }).populate('user movie');

      for (const notification of notifications) {
        await this.sendEmailNotification(notification);
      }
    } catch (error) {
      console.error('Error processing scheduled notifications:', error);
    }
  }

  async notifyNewInGenre(movie) {
    try {
      // Find users interested in movie's genres
      const interestedUsers = await Profile.find({
        favoriteGenres: { $in: movie.genre },
      }).populate("user");

      const notifications = await Promise.all(
        interestedUsers.map((profile) =>
          Notification.create({
            user: profile.user._id,
            movie: movie._id,
            type: "NEW_IN_GENRE",
            message: `New ${movie.genre.join("/")} movie: ${movie.title}`,
            scheduledFor: new Date(),
          })
        )
      );

      return notifications;
    } catch (error) {
      console.error("Error creating genre notifications:", error);
      throw error;
    }
  }

  async getUpcomingMoviesWithReminders(userId, page = 1, limit = 20) {
    try {
      const now = new Date();
      const threeMonthsFromNow = new Date(now.setMonth(now.getMonth() + 3));
      
      // Get upcoming movies
      const movies = await Movie.find({
        releaseDate: {
          $gt: now,
          $lt: threeMonthsFromNow
        }
      })
      .sort({ releaseDate: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

      // Get user's existing reminders
      const existingReminders = await Notification.find({
        user: userId,
        movie: { $in: movies.map(m => m._id) },
        type: { $in: ['RELEASE_REMINDER', 'TRAILER_RELEASE'] }
      });

      // Add hasReminder flag to movies
      const moviesWithReminders = movies.map(movie => ({
        ...movie.toObject(),
        hasReleaseReminder: existingReminders.some(r => 
          r.movie.equals(movie._id) && r.type === 'RELEASE_REMINDER'
        ),
        hasTrailerReminder: existingReminders.some(r => 
          r.movie.equals(movie._id) && r.type === 'TRAILER_RELEASE'
        )
      }));

      return moviesWithReminders;
    } catch (error) {
      console.error('Error getting upcoming movies with reminders:', error);
      throw error;
    }
  }

  async setMovieReminder(userId, movieId, reminderType) {
    try {
      const movie = await Movie.findById(movieId);
      if (!movie) throw new Error('Movie not found');

      // Check if reminder already exists
      const existingReminder = await Notification.findOne({
        user: userId,
        movie: movieId,
        type: reminderType
      });

      if (existingReminder) {
        return existingReminder;
      }

      let reminderDate;
      let message;

      switch (reminderType) {
        case 'RELEASE_REMINDER':
          reminderDate = new Date(movie.releaseDate);
          reminderDate.setDate(reminderDate.getDate() - 3);
          message = `${movie.title} is releasing in 3 days!`;
          break;
        case 'TRAILER_RELEASE':
          // Assuming trailer releases 1 month before movie
          reminderDate = new Date(movie.releaseDate);
          reminderDate.setMonth(reminderDate.getMonth() - 1);
          message = `New trailer for ${movie.title} is now available!`;
          break;
        default:
          throw new Error('Invalid reminder type');
      }

      const notification = await Notification.create({
        user: userId,
        movie: movieId,
        type: reminderType,
        message,
        scheduledFor: reminderDate
      });

      // Schedule email notification
      await this.scheduleEmailReminder(notification);

      return notification;
    } catch (error) {
      console.error('Error setting movie reminder:', error);
      throw error;
    }
  }

  async scheduleEmailReminder(notification) {
    // Here you could integrate with a task scheduler like agenda.js or bull
    // For now, we'll just store the scheduled time
    return notification;
  }

  async sendTestEmail(userId) {
    try {
      // Check if transporter exists
      if (!this.transporter) {
        // Try to reinitialize the transporter
        await this.initializeTransporter();
        
        if (!this.transporter) {
          throw new Error('Email transporter not initialized. Please check email configuration.');
        }
      }

      const user = await User.findById(userId).select('email name');
      
      if (!user || !user.email) {
        throw new Error('User email not found');
      }

      console.log('Sending test email to:', user.email);

      const mailOptions = {
        from: process.env.EMAIL_FROM || `"Movie App" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Test Email from Movie App',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Test Email</h2>
            <p>Hello ${user.name},</p>
            <p>This is a test email to verify that the notification system is working correctly.</p>
            <p>If you received this email, it means your email notification system is properly configured!</p>
            <div style="margin: 20px 0; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
              <p style="margin: 0;"><strong>Details:</strong></p>
              <p style="margin: 5px 0;">Sent at: ${new Date().toLocaleString()}</p>
              <p style="margin: 5px 0;">User ID: ${userId}</p>
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              This is an automated test email. Please do not reply.
            </p>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      
      return {
        messageId: info.messageId,
        sentTo: user.email,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error sending test email:', error);
      throw error;
    }
  }

  async initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD
        }
      });

      await this.verifyConnection();
    } catch (error) {
      console.error('Failed to initialize transporter:', error);
      throw error;
    }
  }
}

export default new NotificationService();
