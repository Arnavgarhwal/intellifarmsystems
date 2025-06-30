const express = require('express');
const { body, validationResult } = require('express-validator');
const Crop = require('../models/Crop');
const Weather = require('../models/Weather');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/crops
// @desc    Get all crops
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { season, state, district, limit = 20, page = 1 } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (season) {
      query.season = season;
    }
    
    if (state) {
      query.suitableStates = state;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const crops = await Crop.find(query)
      .sort({ aiScore: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Crop.countDocuments(query);

    res.json({
      success: true,
      count: crops.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: crops
    });

  } catch (error) {
    console.error('Get crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/crops/:id
// @desc    Get single crop
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.json({
      success: true,
      data: crop
    });

  } catch (error) {
    console.error('Get crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/crops/recommendations
// @desc    Get AI crop recommendations
// @access  Public
router.post('/recommendations', [
  body('state')
    .notEmpty()
    .withMessage('State is required'),
  body('district')
    .notEmpty()
    .withMessage('District is required'),
  body('landArea')
    .isFloat({ min: 0.1 })
    .withMessage('Land area must be at least 0.1 hectares')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { state, district, landArea, season } = req.body;

    // Get current season if not provided
    let currentSeason = season;
    if (!currentSeason) {
      const currentMonth = new Date().getMonth();
      currentSeason = currentMonth >= 6 && currentMonth <= 9 ? 'Kharif' : 
                     currentMonth >= 10 && currentMonth <= 12 ? 'Rabi' : 'Zaid';
    }

    // Get weather data for the location
    const weather = await Weather.getCurrentWeather(state, district);

    // Get suitable crops
    let query = {
      isActive: true,
      season: currentSeason,
      $or: [
        { suitableStates: state },
        { 'suitableDistricts.state': state, 'suitableDistricts.districts': district }
      ]
    };

    const crops = await Crop.find(query).sort({ aiScore: -1 });

    // Generate AI recommendations
    const recommendations = crops.map(crop => {
      // Calculate suitability score based on multiple factors
      let suitabilityScore = 70; // Base score

      // Weather compatibility
      if (weather) {
        const tempSuitable = crop.minTemperature <= weather.temperature.max && 
                           crop.maxTemperature >= weather.temperature.min;
        if (tempSuitable) suitabilityScore += 10;

        const rainfallSuitable = Math.abs(crop.rainfall - weather.rainfall) < 200;
        if (rainfallSuitable) suitabilityScore += 10;
      }

      // Market demand bonus
      if (crop.marketDemand === 'High') suitabilityScore += 5;
      if (crop.exportPotential) suitabilityScore += 5;

      // Cap score at 100
      suitabilityScore = Math.min(suitabilityScore, 100);

      // Calculate expected profit
      const expectedProfit = (crop.profitPerHectare * landArea * (suitabilityScore / 100));

      // Calculate expenses
      const expenses = {
        seeds: crop.profitPerHectare * 0.15 * landArea,
        fertilizers: crop.profitPerHectare * 0.25 * landArea,
        pesticides: crop.profitPerHectare * 0.10 * landArea,
        labor: crop.profitPerHectare * 0.20 * landArea,
        irrigation: crop.profitPerHectare * 0.15 * landArea,
        machinery: crop.profitPerHectare * 0.10 * landArea,
        other: crop.profitPerHectare * 0.05 * landArea,
        total: crop.profitPerHectare * landArea * 0.4
      };

      // Determine risk level
      const riskLevel = suitabilityScore > 85 ? 'low' : 
                       suitabilityScore > 75 ? 'medium' : 'high';

      // Generate recommendations
      const recommendations = [
        `Best suited for ${currentSeason} season`,
        `Requires ${crop.rainfall}mm rainfall`,
        `Optimal temperature: ${crop.minTemperature}-${crop.maxTemperature}°C`,
        `Soil type: ${crop.soilType.join(', ')}`
      ];

      if (weather) {
        if (weather.rainfall < crop.rainfall * 0.5) {
          recommendations.push('Consider irrigation due to low rainfall');
        }
        if (weather.temperature.max > crop.maxTemperature) {
          recommendations.push('Monitor for heat stress');
        }
      }

      return {
        crop: {
          id: crop._id,
          name: crop.name,
          scientificName: crop.scientificName,
          image: crop.image,
          description: crop.description,
          duration: crop.duration,
          season: crop.season
        },
        suitabilityScore: Math.round(suitabilityScore),
        expectedProfit: Math.round(expectedProfit),
        expenses,
        riskLevel,
        recommendations,
        weatherAdvice: weather ? weather.agriculturalAdvice : []
      };
    });

    // Sort by suitability score
    recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

    res.json({
      success: true,
      data: {
        location: { state, district },
        landArea,
        season: currentSeason,
        weather: weather ? {
          temperature: weather.temperature,
          rainfall: weather.rainfall,
          humidity: weather.humidity,
          description: weather.description
        } : null,
        recommendations: recommendations.slice(0, 10) // Top 10 recommendations
      }
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/crops/season/:season
// @desc    Get crops by season
// @access  Public
router.get('/season/:season', async (req, res) => {
  try {
    const { season } = req.params;
    const { limit = 20 } = req.query;

    const crops = await Crop.getCropsBySeason(season).limit(parseInt(limit));

    res.json({
      success: true,
      count: crops.length,
      season,
      data: crops
    });

  } catch (error) {
    console.error('Get crops by season error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/crops/location/:state/:district
// @desc    Get crops suitable for location
// @access  Public
router.get('/location/:state/:district', async (req, res) => {
  try {
    const { state, district } = req.params;
    const { limit = 20 } = req.query;

    const crops = await Crop.getCropsByLocation(state, district).limit(parseInt(limit));

    res.json({
      success: true,
      count: crops.length,
      location: { state, district },
      data: crops
    });

  } catch (error) {
    console.error('Get crops by location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/crops/search
// @desc    Search crops
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const crops = await Crop.find({
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { scientificName: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    })
    .sort({ aiScore: -1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      count: crops.length,
      query: q,
      data: crops
    });

  } catch (error) {
    console.error('Search crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/crops/:id/rate
// @desc    Rate a crop (for AI learning)
// @access  Private
router.post('/:id/rate', protect, [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('feedback')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Feedback must be less than 500 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { rating, feedback } = req.body;
    const cropId = req.params.id;

    // Check if crop exists
    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // In a real application, you would store the rating in a separate collection
    // For now, we'll just return a success message
    res.json({
      success: true,
      message: 'Rating submitted successfully',
      data: {
        cropId,
        rating,
        feedback,
        userId: req.user._id
      }
    });

  } catch (error) {
    console.error('Rate crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 