const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true,
    unique: true
  },
  scientificName: {
    type: String,
    required: [true, 'Scientific name is required'],
    trim: true
  },
  // Growing Information
  season: [{
    type: String,
    enum: ['Kharif', 'Rabi', 'Zaid'],
    required: true
  }],
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [30, 'Duration must be at least 30 days']
  },
  // Environmental Requirements
  minTemperature: {
    type: Number,
    required: [true, 'Minimum temperature is required']
  },
  maxTemperature: {
    type: Number,
    required: [true, 'Maximum temperature is required']
  },
  rainfall: {
    type: Number,
    required: [true, 'Rainfall requirement is required'],
    min: [0, 'Rainfall cannot be negative']
  },
  soilType: [{
    type: String,
    required: [true, 'Soil type is required']
  }],
  // Economic Information
  profitPerHectare: {
    type: Number,
    required: [true, 'Profit per hectare is required'],
    min: [0, 'Profit cannot be negative']
  },
  marketPrice: {
    type: Number,
    required: [true, 'Market price is required'],
    min: [0, 'Market price cannot be negative']
  },
  yieldPerHectare: {
    type: Number,
    required: [true, 'Yield per hectare is required'],
    min: [0, 'Yield cannot be negative']
  },
  // Media and Description
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  // Detailed Information
  sowingTime: {
    start: {
      type: String,
      required: [true, 'Sowing start time is required']
    },
    end: {
      type: String,
      required: [true, 'Sowing end time is required']
    }
  },
  harvestingTime: {
    start: {
      type: String,
      required: [true, 'Harvesting start time is required']
    },
    end: {
      type: String,
      required: [true, 'Harvesting end time is required']
    }
  },
  // Disease and Pest Information
  commonDiseases: [{
    name: String,
    symptoms: [String],
    treatments: [String],
    preventions: [String]
  }],
  commonPests: [{
    name: String,
    damage: [String],
    control: [String]
  }],
  // Fertilizer and Pesticide Requirements
  fertilizers: [{
    name: String,
    quantity: Number,
    unit: String,
    applicationTime: String,
    method: String
  }],
  pesticides: [{
    name: String,
    quantity: Number,
    unit: String,
    applicationTime: String,
    targetPest: String
  }],
  // Regional Suitability
  suitableStates: [{
    type: String,
    required: [true, 'Suitable states are required']
  }],
  suitableDistricts: [{
    state: String,
    districts: [String]
  }],
  // Market Information
  marketDemand: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  exportPotential: {
    type: Boolean,
    default: false
  },
  // AI Scoring
  aiScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  // Timestamps
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
cropSchema.index({ name: 1 });
cropSchema.index({ season: 1 });
cropSchema.index({ suitableStates: 1 });
cropSchema.index({ isActive: 1 });

// Virtual for growing period
cropSchema.virtual('growingPeriod').get(function() {
  return `${this.duration} days`;
});

// Virtual for temperature range
cropSchema.virtual('temperatureRange').get(function() {
  return `${this.minTemperature}°C - ${this.maxTemperature}°C`;
});

// Method to check if crop is suitable for a location
cropSchema.methods.isSuitableForLocation = function(state, district) {
  return this.suitableStates.includes(state) || 
         this.suitableDistricts.some(sd => 
           sd.state === state && sd.districts.includes(district)
         );
};

// Method to check if crop is suitable for current season
cropSchema.methods.isSuitableForSeason = function(currentSeason) {
  return this.season.includes(currentSeason);
};

// Static method to get crops by season
cropSchema.statics.getCropsBySeason = function(season) {
  return this.find({ 
    season: season, 
    isActive: true 
  }).sort({ aiScore: -1 });
};

// Static method to get crops by location
cropSchema.statics.getCropsByLocation = function(state, district) {
  return this.find({
    $or: [
      { suitableStates: state },
      { 'suitableDistricts.state': state, 'suitableDistricts.districts': district }
    ],
    isActive: true
  }).sort({ aiScore: -1 });
};

module.exports = mongoose.model('Crop', cropSchema); 