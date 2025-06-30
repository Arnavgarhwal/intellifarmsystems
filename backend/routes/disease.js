const express = require('express');
const multer = require('multer');
const DiseaseDetection = require('../models/DiseaseDetection');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/disease-detection/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @route   POST /api/disease/detect
// @desc    Detect diseases from uploaded image
// @access  Private
router.post('/detect', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const { cropId, plantType, growthStage, location } = req.body;

    // Simulate AI disease detection (in real app, this would call an AI service)
    const mockDetection = {
      detectedDiseases: [
        {
          name: 'Leaf Blight',
          confidence: 87,
          severity: 'Medium',
          symptoms: [
            'Brown spots on leaves',
            'Yellowing of leaf edges',
            'Wilting of affected leaves'
          ],
          causes: [
            'Fungal infection (Alternaria spp.)',
            'High humidity conditions',
            'Poor air circulation'
          ],
          treatments: [
            'Apply fungicide (Mancozeb 2g/L)',
            'Remove and destroy infected leaves',
            'Improve air circulation'
          ],
          preventions: [
            'Use disease-resistant varieties',
            'Maintain proper plant spacing',
            'Avoid overhead watering'
          ],
          affectedArea: 25,
          stage: 'Early'
        }
      ],
      recommendations: [
        {
          type: 'Immediate',
          action: 'Apply fungicide treatment',
          priority: 'High',
          description: 'Start treatment within 24 hours',
          estimatedCost: 500,
          timeRequired: '2-3 hours'
        },
        {
          type: 'Short-term',
          action: 'Improve air circulation',
          priority: 'Medium',
          description: 'Prune overcrowded areas',
          estimatedCost: 200,
          timeRequired: '1-2 hours'
        }
      ]
    };

    // Create disease detection record
    const detection = await DiseaseDetection.create({
      user: req.user._id,
      crop: cropId,
      image: {
        original: req.file.path,
        thumbnail: req.file.path // In real app, create thumbnail
      },
      detectedDiseases: mockDetection.detectedDiseases,
      location: location ? JSON.parse(location) : {
        state: req.user.state,
        district: req.user.district
      },
      plantInfo: {
        type: plantType || 'Leaf',
        growthStage: growthStage || 'Vegetative'
      },
      recommendations: mockDetection.recommendations,
      status: 'Completed',
      aiModel: {
        version: '1.0.0',
        accuracy: 87,
        processingTime: 2.5
      }
    });

    res.json({
      success: true,
      message: 'Disease detection completed',
      data: detection
    });

  } catch (error) {
    console.error('Disease detection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during disease detection'
    });
  }
});

// @route   GET /api/disease/history
// @desc    Get user's disease detection history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const detections = await DiseaseDetection.find({ user: req.user._id })
      .populate('crop', 'name scientificName image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await DiseaseDetection.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      count: detections.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: detections
    });

  } catch (error) {
    console.error('Get detection history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/disease/statistics
// @desc    Get disease detection statistics
// @access  Public
router.get('/statistics', async (req, res) => {
  try {
    const statistics = await DiseaseDetection.getDiseaseStatistics();

    res.json({
      success: true,
      count: statistics.length,
      data: statistics
    });

  } catch (error) {
    console.error('Get disease statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 