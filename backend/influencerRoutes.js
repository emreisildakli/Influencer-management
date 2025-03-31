const express = require("express");
const Influencer = require("./models/influencer");

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/influencers");
});

router.get("/influencers", async (req, res) => {
  try {
    const { name } = req.query;

    let query = {};
    if (name && name.trim() !== "") {
      query = {
        $or: [{ name: { $regex: name, $options: "i" } }, { lastName: { $regex: name, $options: "i" } }]
      };
    }

    const influencers = await Influencer.find(query);

    if (!influencers.length) {
      return res.status(404).json({
        success: false,
        message: "No influencers found matching the criteria"
      });
    }

    res.status(200).json({
      success: true,
      data: influencers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching influencers",
      error: error.message
    });
  }
});

router.delete("/influencers/:id", async (req, res) => {
  try {
    const influencer = await Influencer.findByIdAndDelete(req.params.id);

    if (!influencer) {
      return res.status(404).json({
        success: false,
        message: "Influencer not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Influencer deleted successfully",
      data: influencer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting influencer",
      error: error.message
    });
  }
});

router.post("/influencers", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body cannot be empty"
      });
    }

    const influencer = new Influencer(req.body);

    const savedInfluencer = await influencer.save();

    res.status(201).json({
      success: true,
      message: "Influencer created successfully",
      data: savedInfluencer
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(error.errors).map((err) => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating influencer",
      error: error.message
    });
  }
});

module.exports = router;
