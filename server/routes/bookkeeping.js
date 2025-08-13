const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Bookkeeping, BusinessPlan } = require('../models');

// @route   GET api/bookkeeping/business-plan/:businessPlanId
// @desc    Get all bookkeeping entries for a business plan
// @access  Private
router.get('/business-plan/:businessPlanId', auth, async (req, res) => {
  try {
    // Verify the business plan belongs to the user's company
    const businessPlan = await BusinessPlan.findOne({
      where: { 
        id: req.params.businessPlanId,
        companyId: req.user.companyId 
      }
    });
    
    if (!businessPlan) {
      return res.status(404).json({ msg: 'Business plan not found' });
    }
    
    const bookkeepingEntries = await Bookkeeping.findAll({
      where: { businessPlanId: req.params.businessPlanId },
      order: [['month', 'ASC'], ['category', 'ASC'], ['subcategory', 'ASC']]
    });
    
    res.json(bookkeepingEntries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/bookkeeping
// @desc    Create a new bookkeeping entry
// @access  Private
router.post('/', auth, async (req, res) => {
  const { 
    businessPlanId, month, category, subcategory, 
    plannedAmount, actualAmount, notes 
  } = req.body;
  
  try {
    // Verify the business plan belongs to the user's company
    const businessPlan = await BusinessPlan.findOne({
      where: { 
        id: businessPlanId,
        companyId: req.user.companyId 
      }
    });
    
    if (!businessPlan) {
      return res.status(404).json({ msg: 'Business plan not found' });
    }
    
    const bookkeepingEntry = await Bookkeeping.create({
      businessPlanId,
      month,
      category,
      subcategory,
      plannedAmount,
      actualAmount,
      notes
    });
    
    res.json(bookkeepingEntry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/bookkeeping/:id
// @desc    Update a bookkeeping entry
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { 
    month, category, subcategory, 
    plannedAmount, actualAmount, notes 
  } = req.body;
  
  try {
    let bookkeepingEntry = await Bookkeeping.findByPk(req.params.id, {
      include: [{
        model: BusinessPlan,
        where: { companyId: req.user.companyId }
      }]
    });
    
    if (!bookkeepingEntry) {
      return res.status(404).json({ msg: 'Bookkeeping entry not found or not authorized' });
    }
    
    bookkeepingEntry = await bookkeepingEntry.update({
      month,
      category,
      subcategory,
      plannedAmount,
      actualAmount,
      notes
    });
    
    res.json(bookkeepingEntry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/bookkeeping/:id
// @desc    Delete a bookkeeping entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const bookkeepingEntry = await Bookkeeping.findByPk(req.params.id, {
      include: [{
        model: BusinessPlan,
        where: { companyId: req.user.companyId }
      }]
    });
    
    if (!bookkeepingEntry) {
      return res.status(404).json({ msg: 'Bookkeeping entry not found or not authorized' });
    }
    
    await bookkeepingEntry.destroy();
    
    res.json({ msg: 'Bookkeeping entry removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;