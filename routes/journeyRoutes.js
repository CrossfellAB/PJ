const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const JourneyTemplate = require('../models/journeyTemplate');

// @route   GET api/journeys
// @desc    Get all journey templates
// @access  Public
router.get('/', async (req, res) => {
  try {
    const journeys = await JourneyTemplate.find()
      .populate('therapeuticArea', 'name')
      .populate('region', 'name healthcareSystem')
      .sort({ createdAt: -1 });
    
    res.json(journeys);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/journeys/:id
// @desc    Get journey template by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const journey = await JourneyTemplate.findById(req.params.id)
      .populate('therapeuticArea')
      .populate('region')
      .populate('createdBy', 'firstName lastName');
    
    if (!journey) {
      return res.status(404).json({ msg: 'Journey template not found' });
    }
    
    res.json(journey);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Journey template not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/journeys
// @desc    Create a journey template
// @access  Private (would normally have auth middleware)
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('therapeuticArea', 'Therapeutic area is required').not().isEmpty(),
  check('region', 'Region is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const newJourney = new JourneyTemplate({
      name: req.body.name,
      description: req.body.description,
      therapeuticArea: req.body.therapeuticArea,
      region: req.body.region,
      stages: req.body.stages || [],
      createdBy: req.body.createdBy // Would normally come from auth middleware
    });
    
    const journey = await newJourney.save();
    res.json(journey);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/journeys/:id
// @desc    Update a journey template
// @access  Private (would normally have auth middleware)
router.put('/:id', async (req, res) => {
  try {
    const journey = await JourneyTemplate.findById(req.params.id);
    
    if (!journey) {
      return res.status(404).json({ msg: 'Journey template not found' });
    }
    
    // Update fields
    if (req.body.name) journey.name = req.body.name;
    if (req.body.description) journey.description = req.body.description;
    if (req.body.therapeuticArea) journey.therapeuticArea = req.body.therapeuticArea;
    if (req.body.region) journey.region = req.body.region;
    if (req.body.stages) journey.stages = req.body.stages;
    if (req.body.status) journey.status = req.body.status;
    
    journey.updatedAt = Date.now();
    
    await journey.save();
    res.json(journey);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Journey template not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/journeys/:id
// @desc    Delete a journey template
// @access  Private (would normally have auth middleware)
router.delete('/:id', async (req, res) => {
  try {
    const journey = await JourneyTemplate.findById(req.params.id);
    
    if (!journey) {
      return res.status(404).json({ msg: 'Journey template not found' });
    }
    
    await journey.remove();
    res.json({ msg: 'Journey template removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Journey template not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;