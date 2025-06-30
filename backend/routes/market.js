const express = require('express');
const MarketPrice = require('../models/MarketPrice');
const Crop = require('../models/Crop');

const router = express.Router();

// @route   GET /api/market/prices
// @desc    Get current market prices
// @access  Public
router.get('/prices', async (req, res) => {
  try {
    const { state, district, crop, limit = 20, page = 1 } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (state) query['location.state'] = state;
    if (district) query['location.district'] = district;
    if (crop) query.crop = crop;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const prices = await MarketPrice.find(query)
      .populate('crop', 'name scientificName image')
      .sort({ lastUpdated: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MarketPrice.countDocuments(query);

    res.json({
      success: true,
      count: prices.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: prices
    });

  } catch (error) {
    console.error('Get market prices error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/market/prices/:state/:district
// @desc    Get market prices by location
// @access  Public
router.get('/prices/:state/:district', async (req, res) => {
  try {
    const { state, district } = req.params;

    const prices = await MarketPrice.getCurrentPricesByLocation(state, district);

    res.json({
      success: true,
      count: prices.length,
      location: { state, district },
      data: prices
    });

  } catch (error) {
    console.error('Get market prices by location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/market/trends/:cropId
// @desc    Get price trends for a crop
// @access  Public
router.get('/trends/:cropId', async (req, res) => {
  try {
    const { cropId } = req.params;
    const { days = 30 } = req.query;

    const trends = await MarketPrice.getPriceTrends(cropId, parseInt(days));

    res.json({
      success: true,
      count: trends.length,
      cropId,
      days: parseInt(days),
      data: trends
    });

  } catch (error) {
    console.error('Get price trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/market/summary
// @desc    Get market summary
// @access  Public
router.get('/summary', async (req, res) => {
  try {
    const summary = await MarketPrice.getMarketSummary();

    res.json({
      success: true,
      count: summary.length,
      data: summary
    });

  } catch (error) {
    console.error('Get market summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 