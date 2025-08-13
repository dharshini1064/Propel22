const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { BusinessPlan, Company } = require('../models');

// @route   GET api/business-plans
// @desc    Get all business plans for user's company
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const businessPlans = await BusinessPlan.findAll({
      where: { companyId: req.user.companyId },
      include: [{ 
        model: Company,
        as: 'partner',
        attributes: ['id', 'name', 'logo']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(businessPlans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/business-plans/:id
// @desc    Get business plan by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const businessPlan = await BusinessPlan.findOne({
      where: { 
        id: req.params.id,
        companyId: req.user.companyId 
      },
      include: [{ 
        model: Company,
        as: 'partner',
        attributes: ['id', 'name', 'logo', 'industry', 'website']
      }]
    });
    
    if (!businessPlan) {
      return res.status(404).json({ msg: 'Business plan not found' });
    }
    
    res.json(businessPlan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/business-plans
// @desc    Create a new business plan
// @access  Private
router.post('/', auth, async (req, res) => {
  const { 
    title, partnerId, startDate, endDate, status,
    acv, sqlToWinRatio, talToSqlRatio, commissionRate,
    contractTerms, kpis
  } = req.body;
  
  try {
    const businessPlan = await BusinessPlan.create({
      title,
      companyId: req.user.companyId,
      partnerId,
      startDate,
      endDate,
      status,
      acv,
      sqlToWinRatio,
      talToSqlRatio,
      commissionRate,
      contractTerms,
      kpis
    });
    
    res.json(businessPlan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/business-plans/:id
// @desc    Update a business plan
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { 
    title, partnerId, startDate, endDate, status,
    acv, sqlToWinRatio, talToSqlRatio, commissionRate,
    contractTerms, kpis
  } = req.body;
  
  try {
    let businessPlan = await BusinessPlan.findOne({
      where: { 
        id: req.params.id,
        companyId: req.user.companyId 
      }
    });
    
    if (!businessPlan) {
      return res.status(404).json({ msg: 'Business plan not found' });
    }
    
    businessPlan = await businessPlan.update({
      title,
      partnerId,
      startDate,
      endDate,
      status,
      acv,
      sqlToWinRatio,
      talToSqlRatio,
      commissionRate,
      contractTerms,
      kpis
    });
    
    res.json(businessPlan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/business-plans/:id
// @desc    Delete a business plan
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const businessPlan = await BusinessPlan.findOne({
      where: { 
        id: req.params.id,
        companyId: req.user.companyId 
      }
    });
    
    if (!businessPlan) {
      return res.status(404).json({ msg: 'Business plan not found' });
    }
    
    await businessPlan.destroy();
    
    res.json({ msg: 'Business plan removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;