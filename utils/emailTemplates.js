export const emailTemplates = {
  RELEASE_REMINDER: (userName, movie) => ({
    subject: `🎬 ${movie.title} is releasing soon!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Movie Release Reminder</h2>
        <p>Hello ${userName},</p>
        <p>Just a friendly reminder that <strong>${movie.title}</strong> is releasing in 3 days!</p>
        ${movie.posterUrl ? `
          <div style="text-align: center;">
            <img src="${movie.posterUrl}" alt="${movie.title}" style="max-width: 300px; border-radius: 8px;">
          </div>
        ` : ''}
        <p>Release Date: ${movie.releaseDate.toLocaleDateString()}</p>
        <p>
          <a href="${process.env.WEBSITE_URL}/movies/${movie._id}" 
             style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Movie Details
          </a>
        </p>
        <p style="color: #666; font-size: 12px;">
          If you wish to unsubscribe from these notifications, please visit your profile settings.
        </p>
      </div>
    `
  }),

  TRAILER_RELEASE: (userName, movie) => ({
    subject: `🎥 New Trailer Alert: ${movie.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Trailer Available</h2>
        <p>Hello ${userName},</p>
        <p>The trailer for <strong>${movie.title}</strong> is now available!</p>
        ${movie.posterUrl ? `
          <div style="text-align: center;">
            <img src="${movie.posterUrl}" alt="${movie.title}" style="max-width: 300px; border-radius: 8px;">
          </div>
        ` : ''}
        <p>
          <a href="${process.env.WEBSITE_URL}/movies/${movie._id}" 
             style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Watch Trailer
          </a>
        </p>
        <p style="color: #666; font-size: 12px;">
          If you wish to unsubscribe from these notifications, please visit your profile settings.
        </p>
      </div>
    `
  }),

  NEW_IN_GENRE: (userName, movie) => ({
    subject: `🎯 New ${movie.genre.join('/')} Movie: ${movie.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Movie in Your Favorite Genre</h2>
        <p>Hello ${userName},</p>
        <p>A new movie in your favorite genre has been added: <strong>${movie.title}</strong></p>
        ${movie.posterUrl ? `
          <div style="text-align: center;">
            <img src="${movie.posterUrl}" alt="${movie.title}" style="max-width: 300px; border-radius: 8px;">
          </div>
        ` : ''}
        <p>Genre: ${movie.genre.join(', ')}</p>
        <p>Release Date: ${movie.releaseDate.toLocaleDateString()}</p>
        <p>
          <a href="${process.env.WEBSITE_URL}/movies/${movie._id}" 
             style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Learn More
          </a>
        </p>
        <p style="color: #666; font-size: 12px;">
          If you wish to unsubscribe from these notifications, please visit your profile settings.
        </p>
      </div>
    `
  })
}; 