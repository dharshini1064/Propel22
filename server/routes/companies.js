const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Company } = require('../models');

// @route   GET api/companies
// @desc    Get all companies
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const companies = await Company.findAll({
      where: { isPartner: false },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    res.json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/companies/:id
// @desc    Get company by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }
    
    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/companies
// @desc    Create or update company
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, logo, website, industry, size, address, phone } = req.body;
  
  try {
    let company = await Company.findOne({ where: { id: req.user.companyId } });
    
    if (company) {
      // Update
      await company.update({
        name,
        logo,
        website,
        industry,
        size,
        address,
        phone
      });
    } else {
      // Create
      company = await Company.create({
        name,
        logo,
        website,
        industry,
        size,
        address,
        phone,
        isPartner: false
      });
    }
    
    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;