import Crew from "../models/crewModel.js";

// Create new crew member
export const createCrew = async (req, res) => {
  try {
    const crew = new Crew(req.body);
    await crew.save();
    res.status(201).json(crew);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all crew members
export const getAllCrew = async (req, res) => {
  try {
    const crew = await Crew.find();
    res.json(crew);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get crew member by ID
export const getCrewById = async (req, res) => {
  try {
    const crew = await Crew.findById(req.params.id);
    if (!crew) {
      return res.status(404).json({ message: "Crew member not found" });
    }
    res.json(crew);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update crew member
export const updateCrew = async (req, res) => {
  try {
    const crew = await Crew.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!crew) {
      return res.status(404).json({ message: "Crew member not found" });
    }
    res.json(crew);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete crew member
export const deleteCrew = async (req, res) => {
  try {
    const crew = await Crew.findByIdAndDelete(req.params.id);
    if (!crew) {
      return res.status(404).json({ message: "Crew member not found" });
    }
    res.json({ message: "Crew member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 