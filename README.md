# MovieVerse - Movie Database & Community Platform 🎬

A comprehensive movie database and community platform built with Node.js, Express, and MongoDB. This platform provides a rich set of features for movie enthusiasts, including movie information, ratings, reviews, community interactions, and personalized recommendations.

## 🌟 Features

- **User Authentication & Authorization**

  - Secure user registration and login
  - JWT-based authentication
  - Role-based access control (Admin, User)

- **Movie Management**

  - Comprehensive movie database
  - Detailed movie information
  - Box office tracking
  - Awards and nominations
  - Crew information

- **Community Features**

  - User reviews and ratings
  - Personalized movie recommendations
  - User watchlists and favorites
  - Community discussions
  - News and articles

- **Advanced Features**
  - Real-time notifications
  - Image upload capabilities
  - Search functionality
  - News article management
  - Box office tracking
  - Award management

## 🛠️ Tech Stack

- **Backend Framework:** Node.js with Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Security:**
  - Helmet for security headers
  - CORS protection
  - Rate limiting
  - Request size limits
- **Documentation:** Swagger/OpenAPI
- **File Upload:** Multer
- **Email Service:** Nodemailer
- **Scheduling:** Node-cron
- **Logging:** Morgan

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/movieverse.git
   cd movieverse
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   EMAIL_USER=your_email
   EMAIL_APP_PASSWORD=your_email_app_password
   EMAIL_FROM=your_email
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

Access the Swagger API documentation at:

```
http://localhost:5000/api-docs
```

## 📁 Project Structure

```
├── controllers/     # Route controllers
├── middlewares/     # Custom middlewares
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
├── uploads/        # File uploads
├── app.js          # Express app configuration
└── server.js       # Server entry point
```

## 🔒 Security Features

- Rate limiting (100 requests per 15 minutes)
- Request size limits (10MB)
- Helmet security headers
- CORS protection
- Secure file upload handling
- Environment variable protection

## 📧 Email Integration

The platform includes email functionality for:

- User notifications
- Account verification
- Password reset
- Important updates

## 🔄 Cron Jobs

Automated tasks for:

- Data updates
- Cache management
- System maintenance

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- [Abdullah Asif](https://github.com/AbdullahAsif296)

## 🙏 Acknowledgments

- Express.js community
- MongoDB team
- All contributors and users

---

Made with ❤️ for movie enthusiasts
