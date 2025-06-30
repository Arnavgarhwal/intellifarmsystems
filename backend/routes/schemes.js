const express = require('express');
const router = express.Router();

// Mock data for government schemes
const schemes = [
  {
    id: 1,
    name: 'PM-KISAN',
    fullName: 'Pradhan Mantri Kisan Samman Nidhi',
    description: 'Direct income support of ₹6,000 per year to eligible farmer families',
    eligibility: [
      'Small and marginal farmers',
      'Landholding up to 2 hectares',
      'Valid bank account'
    ],
    benefits: [
      '₹6,000 per year in 3 installments',
      'Direct bank transfer',
      'No middlemen involved'
    ],
    applicationProcess: [
      'Visit nearest Common Service Centre',
      'Submit required documents',
      'Verification by authorities',
      'Direct credit to bank account'
    ],
    documents: [
      'Aadhaar card',
      'Land records',
      'Bank account details',
      'Passport size photo'
    ],
    contact: {
      phone: '1800-180-1551',
      email: 'pmkisan@gov.in',
      website: 'https://pmkisan.gov.in'
    },
    status: 'Active',
    category: 'Income Support'
  },
  {
    id: 2,
    name: 'PMFBY',
    fullName: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Comprehensive crop insurance scheme to protect farmers against natural calamities',
    eligibility: [
      'All farmers growing notified crops',
      'Compulsory for loanee farmers',
      'Optional for non-loanee farmers'
    ],
    benefits: [
      'Coverage for natural calamities',
      'Prevented sowing/planting risk',
      'Post-harvest losses',
      'Localized calamities'
    ],
    applicationProcess: [
      'Contact nearest bank/branch',
      'Submit application form',
      'Pay premium amount',
      'Receive insurance certificate'
    ],
    documents: [
      'Land records',
      'Bank account details',
      'Crop details',
      'Premium payment receipt'
    ],
    contact: {
      phone: '1800-425-1551',
      email: 'pmfby@gov.in',
      website: 'https://pmfby.gov.in'
    },
    status: 'Active',
    category: 'Insurance'
  },
  {
    id: 3,
    name: 'KCC',
    fullName: 'Kisan Credit Card',
    description: 'Credit facility for farmers to meet agricultural and allied needs',
    eligibility: [
      'Individual farmers',
      'Joint borrowers',
      'Tenant farmers',
      'Sharecroppers'
    ],
    benefits: [
      'Credit limit up to ₹3 lakh',
      'Interest subvention of 2%',
      'Additional 3% for timely repayment',
      'Flexible repayment options'
    ],
    applicationProcess: [
      'Visit nearest bank branch',
      'Submit application with documents',
      'Verification by bank',
      'Card issuance'
    ],
    documents: [
      'Aadhaar card',
      'Land records',
      'Income certificate',
      'Bank account details'
    ],
    contact: {
      phone: '1800-425-1551',
      email: 'kcc@gov.in',
      website: 'https://kcc.gov.in'
    },
    status: 'Active',
    category: 'Credit'
  }
];

// @route   GET /api/schemes
// @desc    Get all government schemes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, status, limit = 10 } = req.query;

    let filteredSchemes = schemes;

    if (category) {
      filteredSchemes = filteredSchemes.filter(scheme => 
        scheme.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (status) {
      filteredSchemes = filteredSchemes.filter(scheme => 
        scheme.status.toLowerCase() === status.toLowerCase()
      );
    }

    const limitedSchemes = filteredSchemes.slice(0, parseInt(limit));

    res.json({
      success: true,
      count: limitedSchemes.length,
      total: schemes.length,
      data: limitedSchemes
    });

  } catch (error) {
    console.error('Get schemes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/schemes/:id
// @desc    Get specific scheme details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const scheme = schemes.find(s => s.id === parseInt(req.params.id));

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    res.json({
      success: true,
      data: scheme
    });

  } catch (error) {
    console.error('Get scheme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/schemes/categories
// @desc    Get all scheme categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = [...new Set(schemes.map(scheme => scheme.category))];

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 