import Profile from "../models/profileModel.js";

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const upsertProfile = async (req, res) => {
  try {
    const { favoriteGenres, favoriteActors, bio } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: { favoriteGenres, favoriteActors, bio } },
      { new: true, upsert: true }
    );

    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const avatarData = {
      filename: req.file.filename,
      path: req.file.path,
      contentType: req.file.mimetype,
      size: req.file.size,
    };

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: { avatar: avatarData } },
      { new: true, upsert: true }
    );
    console.log(profile);
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    await Profile.findOneAndDelete({ user: req.user.id });
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateProfileFields = async (req, res) => {
  try {
    const { field, data } = req.body;
    
    // Validate field name
    const allowedFields = ['favoriteGenres', 'favoriteActors', 'bio'];
    if (!allowedFields.includes(field)) {
      return res.status(400).json({ 
        message: `Invalid field. Allowed fields are: ${allowedFields.join(', ')}` 
      });
    }

    // Validate data based on field type
    if (field === 'bio') {
      if (typeof data !== 'string' || data.length > 500) { // assuming 500 char limit
        return res.status(400).json({ 
          message: 'Bio must be a string with maximum 500 characters' 
        });
      }
    } else {
      if (!Array.isArray(data)) {
        return res.status(400).json({ 
          message: `${field} must be an array` 
        });
      }
      // Validate array items are strings and within limits
      if (!data.every(item => typeof item === 'string') || data.length > 20) { // assuming 20 items limit
        return res.status(400).json({ 
          message: `${field} must contain strings and have maximum 20 items` 
        });
      }
    }

    // Create update object
    const updateData = { [field]: data };

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: `${field} updated successfully`,
      profile
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
};

// Add field-specific update methods for clearer API
export const updateFavoriteGenres = async (req, res) => {
  try {
    const { genres } = req.body;
    
    if (!Array.isArray(genres)) {
      return res.status(400).json({ 
        message: 'Genres must be an array' 
      });
    }

    if (!genres.every(genre => typeof genre === 'string') || genres.length > 20) {
      return res.status(400).json({ 
        message: 'Genres must be strings and have maximum 20 items' 
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: { favoriteGenres: genres } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: 'Favorite genres updated successfully',
      profile
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
};

export const updateFavoriteActors = async (req, res) => {
  try {
    const { actors } = req.body;
    
    if (!Array.isArray(actors)) {
      return res.status(400).json({ 
        message: 'Actors must be an array' 
      });
    }

    if (!actors.every(actor => typeof actor === 'string') || actors.length > 20) {
      return res.status(400).json({ 
        message: 'Actors must be strings and have maximum 20 items' 
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: { favoriteActors: actors } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: 'Favorite actors updated successfully',
      profile
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
};

export const updateBio = async (req, res) => {
  try {
    const { bio } = req.body;
    
    if (typeof bio !== 'string' || bio.length > 500) {
      return res.status(400).json({ 
        message: 'Bio must be a string with maximum 500 characters' 
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: { bio } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: 'Bio updated successfully',
      profile
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
};
