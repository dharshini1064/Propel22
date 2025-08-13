const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Company } = require('../models');

// @route   GET api/partners
// @desc    Get all partner companies
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const partners = await Company.findAll({
      where: { isPartner: true },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    res.json(partners);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/partners/:id
// @desc    Get partner by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const partner = await Company.findOne({
      where: { 
        id: req.params.id,
        isPartner: true 
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    
    if (!partner) {
      return res.status(404).json({ msg: 'Partner not found' });
    }
    
    res.json(partner);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/partners
// @desc    Create a new partner
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to add partners' });
  }
  
  const { name, logo, website, industry, size, address, phone } = req.body;
  
  try {
    const partner = await Company.create({
      name,
      logo,
      website,
      industry,
      size,
      address,
      phone,
      isPartner: true
    });
    
    res.json(partner);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;