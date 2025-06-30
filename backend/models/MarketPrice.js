const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
  crop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
    required: [true, 'Crop reference is required']
  },
  location: {
    state: {
      type: String,
      required: [true, 'State is required']
    },
    district: {
      type: String,
      required: [true, 'District is required']
    },
    market: {
      type: String,
      required: [true, 'Market name is required']
    }
  },
  // Price Information
  currentPrice: {
    type: Number,
    required: [true, 'Current price is required'],
    min: [0, 'Price cannot be negative']
  },
  previousPrice: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  change: {
    type: Number,
    default: 0
  },
  changePercentage: {
    type: Number,
    default: 0
  },
  // Price Details
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['kg', 'quintal', 'ton', 'dozen', 'piece']
  },
  quality: {
    type: String,
    enum: ['Grade A', 'Grade B', 'Grade C', 'Mixed'],
    default: 'Mixed'
  },
  // Market Information
  supply: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  demand: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  // Price Predictions
  predictions: [{
    date: {
      type: Date,
      required: true
    },
    predictedPrice: {
      type: Number,
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    factors: [String],
    trend: {
      type: String,
      enum: ['increasing', 'decreasing', 'stable'],
      required: true
    }
  }],
  // Historical Data
  historicalPrices: [{
    date: {
      type: Date,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    volume: Number,
    source: String
  }],
  // Market Analysis
  marketTrend: {
    type: String,
    enum: ['Bullish', 'Bearish', 'Sideways'],
    default: 'Sideways'
  },
  volatility: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  // Data Source
  source: {
    type: String,
    default: 'Government Market Data'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
marketPriceSchema.index({ crop: 1 });
marketPriceSchema.index({ 'location.state': 1, 'location.district': 1 });
marketPriceSchema.index({ 'location.market': 1 });
marketPriceSchema.index({ lastUpdated: -1 });
marketPriceSchema.index({ crop: 1, 'location.state': 1, 'location.district': 1 });

// Virtual for price change status
marketPriceSchema.virtual('priceChangeStatus').get(function() {
  if (this.changePercentage > 0) return 'increasing';
  if (this.changePercentage < 0) return 'decreasing';
  return 'stable';
});

// Virtual for price change color
marketPriceSchema.virtual('priceChangeColor').get(function() {
  if (this.changePercentage > 0) return 'success';
  if (this.changePercentage < 0) return 'error';
  return 'default';
});

// Method to calculate price change
marketPriceSchema.methods.calculatePriceChange = function() {
  if (this.previousPrice && this.currentPrice) {
    this.change = this.currentPrice - this.previousPrice;
    this.changePercentage = ((this.change / this.previousPrice) * 100);
  }
};

// Method to add historical price
marketPriceSchema.methods.addHistoricalPrice = function(price, date, volume = null, source = null) {
  this.historicalPrices.push({
    date: date || new Date(),
    price: price,
    volume: volume,
    source: source || this.source
  });
  
  // Keep only last 365 days of historical data
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  this.historicalPrices = this.historicalPrices.filter(
    hp => hp.date >= oneYearAgo
  );
};

// Method to add price prediction
marketPriceSchema.methods.addPrediction = function(predictedPrice, date, confidence, factors, trend) {
  this.predictions.push({
    date: date,
    predictedPrice: predictedPrice,
    confidence: confidence,
    factors: factors || [],
    trend: trend
  });
  
  // Keep only future predictions
  const now = new Date();
  this.predictions = this.predictions.filter(
    p => p.date > now
  );
};

// Static method to get current prices by location
marketPriceSchema.statics.getCurrentPricesByLocation = function(state, district) {
  return this.find({
    'location.state': state,
    'location.district': district,
    isActive: true
  }).populate('crop', 'name scientificName image').sort({ lastUpdated: -1 });
};

// Static method to get price trends
marketPriceSchema.statics.getPriceTrends = function(cropId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        crop: mongoose.Types.ObjectId(cropId),
        'historicalPrices.date': { $gte: startDate }
      }
    },
    {
      $unwind: '$historicalPrices'
    },
    {
      $match: {
        'historicalPrices.date': { $gte: startDate }
      }
    },
    {
      $sort: { 'historicalPrices.date': 1 }
    },
    {
      $project: {
        date: '$historicalPrices.date',
        price: '$historicalPrices.price'
      }
    }
  ]);
};

// Static method to get market summary
marketPriceSchema.statics.getMarketSummary = function() {
  return this.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: '$crop',
        avgPrice: { $avg: '$currentPrice' },
        maxPrice: { $max: '$currentPrice' },
        minPrice: { $min: '$currentPrice' },
        totalMarkets: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'crops',
        localField: '_id',
        foreignField: '_id',
        as: 'cropInfo'
      }
    },
    {
      $unwind: '$cropInfo'
    },
    {
      $project: {
        cropName: '$cropInfo.name',
        avgPrice: 1,
        maxPrice: 1,
        minPrice: 1,
        totalMarkets: 1
      }
    }
  ]);
};

module.exports = mongoose.model('MarketPrice', marketPriceSchema); 