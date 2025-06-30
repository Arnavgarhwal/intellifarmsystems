const mongoose = require('mongoose');

const diseaseDetectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  crop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop'
  },
  // Image Information
  image: {
    original: {
      type: String,
      required: [true, 'Original image is required']
    },
    processed: {
      type: String
    },
    thumbnail: {
      type: String
    }
  },
  // Detection Results
  detectedDiseases: [{
    name: {
      type: String,
      required: [true, 'Disease name is required']
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: [true, 'Confidence score is required']
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: [true, 'Severity level is required']
    },
    // Disease Details
    symptoms: [{
      type: String,
      required: [true, 'Symptoms are required']
    }],
    causes: [{
      type: String,
      required: [true, 'Causes are required']
    }],
    treatments: [{
      type: String,
      required: [true, 'Treatments are required']
    }],
    preventions: [{
      type: String,
      required: [true, 'Preventions are required']
    }],
    // AI Analysis
    affectedArea: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    stage: {
      type: String,
      enum: ['Early', 'Mid', 'Late'],
      default: 'Early'
    }
  }],
  // Location Information
  location: {
    state: String,
    district: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  // Plant Information
  plantInfo: {
    type: {
      type: String,
      enum: ['Leaf', 'Stem', 'Root', 'Flower', 'Fruit', 'Whole Plant'],
      required: [true, 'Plant part type is required']
    },
    age: {
      type: Number,
      min: 0
    },
    growthStage: {
      type: String,
      enum: ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Mature'],
      default: 'Vegetative'
    }
  },
  // AI Model Information
  aiModel: {
    version: {
      type: String,
      default: '1.0.0'
    },
    accuracy: {
      type: Number,
      min: 0,
      max: 100
    },
    processingTime: {
      type: Number,
      min: 0
    }
  },
  // Recommendations
  recommendations: [{
    type: {
      type: String,
      enum: ['Immediate', 'Short-term', 'Long-term'],
      required: true
    },
    action: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true
    },
    description: String,
    estimatedCost: Number,
    timeRequired: String
  }],
  // Follow-up
  followUp: {
    required: {
      type: Boolean,
      default: false
    },
    date: Date,
    notes: String,
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Cancelled'],
      default: 'Pending'
    }
  },
  // Expert Review
  expertReview: {
    reviewed: {
      type: Boolean,
      default: false
    },
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewDate: Date,
    comments: String,
    accuracy: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  // Status
  status: {
    type: String,
    enum: ['Processing', 'Completed', 'Failed', 'Reviewed'],
    default: 'Processing'
  },
  // Metadata
  metadata: {
    deviceInfo: String,
    appVersion: String,
    uploadTime: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
diseaseDetectionSchema.index({ user: 1 });
diseaseDetectionSchema.index({ crop: 1 });
diseaseDetectionSchema.index({ status: 1 });
diseaseDetectionSchema.index({ createdAt: -1 });
diseaseDetectionSchema.index({ 'detectedDiseases.confidence': -1 });

// Virtual for primary disease
diseaseDetectionSchema.virtual('primaryDisease').get(function() {
  if (this.detectedDiseases.length === 0) return null;
  return this.detectedDiseases.reduce((prev, current) => 
    (prev.confidence > current.confidence) ? prev : current
  );
});

// Virtual for overall severity
diseaseDetectionSchema.virtual('overallSeverity').get(function() {
  if (this.detectedDiseases.length === 0) return 'None';
  
  const severityLevels = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };
  const maxSeverity = this.detectedDiseases.reduce((max, disease) => {
    return severityLevels[disease.severity] > severityLevels[max] ? disease.severity : max;
  }, 'Low');
  
  return maxSeverity;
});

// Method to get treatment recommendations
diseaseDetectionSchema.methods.getTreatmentRecommendations = function() {
  const treatments = [];
  this.detectedDiseases.forEach(disease => {
    treatments.push(...disease.treatments);
  });
  return [...new Set(treatments)]; // Remove duplicates
};

// Method to get prevention recommendations
diseaseDetectionSchema.methods.getPreventionRecommendations = function() {
  const preventions = [];
  this.detectedDiseases.forEach(disease => {
    preventions.push(...disease.preventions);
  });
  return [...new Set(preventions)]; // Remove duplicates
};

// Method to calculate overall confidence
diseaseDetectionSchema.methods.getOverallConfidence = function() {
  if (this.detectedDiseases.length === 0) return 0;
  
  const totalConfidence = this.detectedDiseases.reduce((sum, disease) => 
    sum + disease.confidence, 0
  );
  
  return totalConfidence / this.detectedDiseases.length;
};

// Static method to get detections by user
diseaseDetectionSchema.statics.getDetectionsByUser = function(userId, limit = 10) {
  return this.find({ user: userId })
    .populate('crop', 'name scientificName image')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get detections by crop
diseaseDetectionSchema.statics.getDetectionsByCrop = function(cropId, limit = 20) {
  return this.find({ crop: cropId })
    .populate('user', 'name state district')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get disease statistics
diseaseDetectionSchema.statics.getDiseaseStatistics = function() {
  return this.aggregate([
    {
      $unwind: '$detectedDiseases'
    },
    {
      $group: {
        _id: '$detectedDiseases.name',
        count: { $sum: 1 },
        avgConfidence: { $avg: '$detectedDiseases.confidence' },
        severityCounts: {
          $push: '$detectedDiseases.severity'
        }
      }
    },
    {
      $project: {
        diseaseName: '$_id',
        count: 1,
        avgConfidence: { $round: ['$avgConfidence', 2] },
        severityBreakdown: {
          Low: { $size: { $filter: { input: '$severityCounts', cond: { $eq: ['$$this', 'Low'] } } } },
          Medium: { $size: { $filter: { input: '$severityCounts', cond: { $eq: ['$$this', 'Medium'] } } } },
          High: { $size: { $filter: { input: '$severityCounts', cond: { $eq: ['$$this', 'High'] } } } },
          Critical: { $size: { $filter: { input: '$severityCounts', cond: { $eq: ['$$this', 'Critical'] } } } }
        }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

module.exports = mongoose.model('DiseaseDetection', diseaseDetectionSchema); 