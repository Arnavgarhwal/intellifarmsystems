const express = require('express');
const { body, validationResult } = require('express-validator');
const Weather = require('../models/Weather');
const Crop = require('../models/Crop');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/weather/current/:state/:district
// @desc    Get current weather for location
// @access  Public
router.get('/current/:state/:district', async (req, res) => {
  try {
    const { state, district } = req.params;

    const weather = await Weather.getCurrentWeather(state, district);

    if (!weather) {
      return res.status(404).json({
        success: false,
        message: 'Weather data not available for this location'
      });
    }

    res.json({
      success: true,
      data: weather
    });

  } catch (error) {
    console.error('Get current weather error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/weather/forecast/:state/:district
// @desc    Get weather forecast for location
// @access  Public
router.get('/forecast/:state/:district', async (req, res) => {
  try {
    const { state, district } = req.params;
    const { days = 5 } = req.query;

    const forecast = await Weather.getWeatherForecast(state, district, parseInt(days));

    if (!forecast || forecast.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Weather forecast not available for this location'
      });
    }

    res.json({
      success: true,
      count: forecast.length,
      location: { state, district },
      data: forecast
    });

  } catch (error) {
    console.error('Get weather forecast error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/weather/agricultural-advice/:state/:district
// @desc    Get agricultural advice based on weather
// @access  Public
router.get('/agricultural-advice/:state/:district', async (req, res) => {
  try {
    const { state, district } = req.params;

    // Get current weather
    const weather = await Weather.getCurrentWeather(state, district);

    if (!weather) {
      return res.status(404).json({
        success: false,
        message: 'Weather data not available for this location'
      });
    }

    // Get suitable crops for current season
    const currentMonth = new Date().getMonth();
    const currentSeason = currentMonth >= 6 && currentMonth <= 9 ? 'Kharif' : 
                         currentMonth >= 10 && currentMonth <= 12 ? 'Rabi' : 'Zaid';

    const crops = await Crop.find({
      isActive: true,
      season: currentSeason,
      $or: [
        { suitableStates: state },
        { 'suitableDistricts.state': state, 'suitableDistricts.districts': district }
      ]
    }).limit(5);

    // Generate agricultural advice
    const advice = [];

    // Weather-based advice
    if (weather.rainfall > 50) {
      advice.push({
        type: 'warning',
        title: 'Heavy Rainfall Expected',
        message: 'Consider drainage management and protect crops from waterlogging',
        priority: 'high'
      });
    } else if (weather.rainfall < 5) {
      advice.push({
        type: 'warning',
        title: 'Low Rainfall',
        message: 'Ensure proper irrigation systems are in place',
        priority: 'medium'
      });
    }

    if (weather.temperature.max > 35) {
      advice.push({
        type: 'warning',
        title: 'High Temperature Alert',
        message: 'Protect crops from heat stress, consider shade nets',
        priority: 'high'
      });
    } else if (weather.temperature.min < 10) {
      advice.push({
        type: 'warning',
        title: 'Low Temperature',
        message: 'Protect sensitive crops from cold, consider frost protection',
        priority: 'medium'
      });
    }

    if (weather.humidity > 80) {
      advice.push({
        type: 'info',
        title: 'High Humidity',
        message: 'Monitor for fungal diseases, ensure proper air circulation',
        priority: 'medium'
      });
    }

    // General farming advice
    advice.push({
      type: 'info',
      title: 'Seasonal Farming',
      message: `Current season is ${currentSeason}. Consider crops suitable for this season.`,
      priority: 'low'
    });

    // Crop-specific advice
    if (crops.length > 0) {
      advice.push({
        type: 'success',
        title: 'Recommended Crops',
        message: `Consider growing: ${crops.map(c => c.name).join(', ')}`,
        priority: 'medium',
        crops: crops.map(c => ({ id: c._id, name: c.name }))
      });
    }

    res.json({
      success: true,
      data: {
        weather: {
          temperature: weather.temperature,
          rainfall: weather.rainfall,
          humidity: weather.humidity,
          description: weather.description,
          icon: weather.icon
        },
        location: { state, district },
        season: currentSeason,
        advice: advice.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        })
      }
    });

  } catch (error) {
    console.error('Get agricultural advice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/weather/risks/:state/:district
// @desc    Get weather-related risks for farming
// @access  Public
router.get('/risks/:state/:district', async (req, res) => {
  try {
    const { state, district } = req.params;

    // Get current weather
    const weather = await Weather.getCurrentWeather(state, district);

    if (!weather) {
      return res.status(404).json({
        success: false,
        message: 'Weather data not available for this location'
      });
    }

    // Analyze risks
    const risks = [];

    // Drought risk
    if (weather.rainfall < 10 && weather.temperature.max > 30) {
      risks.push({
        type: 'Drought',
        severity: 'High',
        probability: 'High',
        description: 'Low rainfall combined with high temperatures indicates drought risk',
        recommendations: [
          'Implement water conservation measures',
          'Consider drought-resistant crop varieties',
          'Prepare irrigation backup systems',
          'Monitor soil moisture regularly'
        ]
      });
    }

    // Flood risk
    if (weather.rainfall > 100) {
      risks.push({
        type: 'Flood',
        severity: 'High',
        probability: 'Medium',
        description: 'Heavy rainfall may cause flooding',
        recommendations: [
          'Ensure proper drainage systems',
          'Elevate sensitive crops if possible',
          'Monitor water levels',
          'Prepare emergency response plan'
        ]
      });
    }

    // Heat stress risk
    if (weather.temperature.max > 35) {
      risks.push({
        type: 'Heat',
        severity: 'Medium',
        probability: 'High',
        description: 'High temperatures may cause heat stress in crops',
        recommendations: [
          'Provide shade for sensitive crops',
          'Increase irrigation frequency',
          'Apply mulch to retain soil moisture',
          'Monitor for heat stress symptoms'
        ]
      });
    }

    // Disease risk
    if (weather.humidity > 80 && weather.temperature.max > 25) {
      risks.push({
        type: 'Disease',
        severity: 'Medium',
        probability: 'High',
        description: 'High humidity and moderate temperatures favor disease development',
        recommendations: [
          'Monitor crops for disease symptoms',
          'Apply preventive fungicides if needed',
          'Ensure proper air circulation',
          'Remove infected plant parts'
        ]
      });
    }

    res.json({
      success: true,
      data: {
        location: { state, district },
        weather: {
          temperature: weather.temperature,
          rainfall: weather.rainfall,
          humidity: weather.humidity
        },
        risks: risks.sort((a, b) => {
          const severityOrder = { High: 3, Medium: 2, Low: 1 };
          return severityOrder[b.severity] - severityOrder[a.severity];
        })
      }
    });

  } catch (error) {
    console.error('Get weather risks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/weather/update
// @desc    Update weather data (for admin/external API)
// @access  Private (Admin only)
router.post('/update', [
  body('state').notEmpty().withMessage('State is required'),
  body('district').notEmpty().withMessage('District is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('temperature.min').isNumeric().withMessage('Minimum temperature is required'),
  body('temperature.max').isNumeric().withMessage('Maximum temperature is required'),
  body('humidity').isInt({ min: 0, max: 100 }).withMessage('Valid humidity is required'),
  body('rainfall').isFloat({ min: 0 }).withMessage('Valid rainfall is required'),
  body('windSpeed').isFloat({ min: 0 }).withMessage('Valid wind speed is required'),
  body('description').notEmpty().withMessage('Weather description is required')
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

    const {
      state,
      district,
      date,
      temperature,
      humidity,
      rainfall,
      windSpeed,
      description,
      icon,
      agriculturalAdvice,
      risks
    } = req.body;

    // Check if weather data already exists for this date and location
    const existingWeather = await Weather.findOne({
      'location.state': state,
      'location.district': district,
      date: new Date(date)
    });

    let weather;
    if (existingWeather) {
      // Update existing weather
      weather = await Weather.findByIdAndUpdate(
        existingWeather._id,
        {
          temperature,
          humidity,
          rainfall,
          windSpeed,
          description,
          icon,
          agriculturalAdvice,
          risks,
          lastUpdated: new Date()
        },
        { new: true, runValidators: true }
      );
    } else {
      // Create new weather entry
      weather = await Weather.create({
        location: { state, district },
        date: new Date(date),
        temperature,
        humidity,
        rainfall,
        windSpeed,
        description,
        icon,
        agriculturalAdvice,
        risks
      });
    }

    res.json({
      success: true,
      message: existingWeather ? 'Weather data updated' : 'Weather data created',
      data: weather
    });

  } catch (error) {
    console.error('Update weather error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 