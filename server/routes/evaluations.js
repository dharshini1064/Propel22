const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Evaluation, BusinessPlan, User } = require('../models');

// @route   GET api/evaluations/business-plan/:businessPlanId
// @desc    Get all evaluations for a business plan
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
    
    const evaluations = await Evaluation.findAll({
      where: { businessPlanId: req.params.businessPlanId },
      include: [{
        model: User,
        as: 'evaluator',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['evaluationDate', 'DESC']]
    });
    
    res.json(evaluations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/evaluations/:id
// @desc    Get evaluation by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const evaluation = await Evaluation.findByPk(req.params.id, {
      include: [
        {
          model: BusinessPlan,
          where: { companyId: req.user.companyId },
          attributes: ['id', 'title', 'status']
        },
        {
          model: User,
          as: 'evaluator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });
    
    if (!evaluation) {
      return res.status(404).json({ msg: 'Evaluation not found or not authorized' });
    }
    
    res.json(evaluation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/evaluations
// @desc    Create a new evaluation
// @access  Private
router.post('/', auth, async (req, res) => {
  const { 
    businessPlanId, evaluationDate, criteria,
    overallScore, feedback, nextSteps 
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
    
    const evaluation = await Evaluation.create({
      businessPlanId,
      evaluationDate,
      evaluatorId: req.user.id,
      criteria,
      overallScore,
      feedback,
      nextSteps
    });
    
    res.json(evaluation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/evaluations/:id
// @desc    Update an evaluation
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { 
    evaluationDate, criteria, overallScore, feedback, nextSteps 
  } = req.body;
  
  try {
    let evaluation = await Evaluation.findByPk(req.params.id, {
      include: [{
        model: BusinessPlan,
        where: { companyId: req.user.companyId }
      }]
    });
    
    if (!evaluation) {
      return res.status(404).json({ msg: 'Evaluation not found or not authorized' });
    }
    
    // Only the evaluator or an admin can update the evaluation
    if (evaluation.evaluatorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to update this evaluation' });
    }
    
    evaluation = await evaluation.update({
      evaluationDate,
      criteria,
      overallScore,
      feedback,
      nextSteps
    });
    
    res.json(evaluation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/evaluations/:id
// @desc    Delete an evaluation
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const evaluation = await Evaluation.findByPk(req.params.id, {
      include: [{
        model: BusinessPlan,
        where: { companyId: req.user.companyId }
      }]
    });
    
    if (!evaluation) {
      return res.status(404).json({ msg: 'Evaluation not found or not authorized' });
    }
    
    // Only the evaluator or an admin can delete the evaluation
    if (evaluation.evaluatorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete this evaluation' });
    }
    
    await evaluation.destroy();
    
    res.json({ msg: 'Evaluation removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;