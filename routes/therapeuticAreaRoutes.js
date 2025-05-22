const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const TherapeuticArea = require('../models/therapeuticArea');
const { auth } = require('../middleware/auth');

// @route   GET api/therapeutic-areas
// @desc    Get all therapeutic areas
// @access  Public
router.get('/', async (req, res) => {
  try {
    const therapeuticAreas = await TherapeuticArea.find()
      .sort({ name: 1 });
    
    res.json(therapeuticAreas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/therapeutic-areas/:id
// @desc    Get therapeutic area by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const therapeuticArea = await TherapeuticArea.findById(req.params.id);
    
    if (!therapeuticArea) {
      return res.status(404).json({ msg: 'Therapeutic area not found' });
    }
    
    res.json(therapeuticArea);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Therapeutic area not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/therapeutic-areas
// @desc    Create a therapeutic area
// @access  Private/Admin
router.post('/', [
  auth,
  check('name', 'Name is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to create therapeutic areas' });
    }
    
    // Check if therapeutic area with same name already exists
    let therapeuticArea = await TherapeuticArea.findOne({ name: req.body.name });
    if (therapeuticArea) {
      return res.status(400).json({ msg: 'Therapeutic area with this name already exists' });
    }
    
    // Create new therapeutic area
    therapeuticArea = new TherapeuticArea({
      name: req.body.name,
      description: req.body.description,
      code: req.body.code,
      parentArea: req.body.parentArea,
      status: req.body.status || 'active'
    });
    
    await therapeuticArea.save();
    res.json(therapeuticArea);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/therapeutic-areas/:id
// @desc    Update a therapeutic area
// @access  Private/Admin
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to update therapeutic areas' });
    }
    
    const therapeuticArea = await TherapeuticArea.findById(req.params.id);
    
    if (!therapeuticArea) {
      return res.status(404).json({ msg: 'Therapeutic area not found' });
    }
    
    // Update fields
    if (req.body.name) therapeuticArea.name = req.body.name;
    if (req.body.description) therapeuticArea.description = req.body.description;
    if (req.body.code) therapeuticArea.code = req.body.code;
    if (req.body.parentArea) therapeuticArea.parentArea = req.body.parentArea;
    if (req.body.status) therapeuticArea.status = req.body.status;
    
    therapeuticArea.updatedAt = Date.now();
    
    await therapeuticArea.save();
    res.json(therapeuticArea);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Therapeutic area not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/therapeutic-areas/:id
// @desc    Delete a therapeutic area
// @access  Private/Admin
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete therapeutic areas' });
    }
    
    const therapeuticArea = await TherapeuticArea.findById(req.params.id);
    
    if (!therapeuticArea) {
      return res.status(404).json({ msg: 'Therapeutic area not found' });
    }
    
    await therapeuticArea.remove();
    res.json({ msg: 'Therapeutic area removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Therapeutic area not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;