const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Region = require('../models/region');
const { auth } = require('../middleware/auth');

// @route   GET api/regions
// @desc    Get all regions
// @access  Public
router.get('/', async (req, res) => {
  try {
    const regions = await Region.find()
      .sort({ name: 1 });
    
    res.json(regions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/regions/:id
// @desc    Get region by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const region = await Region.findById(req.params.id);
    
    if (!region) {
      return res.status(404).json({ msg: 'Region not found' });
    }
    
    res.json(region);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Region not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/regions
// @desc    Create a region
// @access  Private/Admin
router.post('/', [
  auth,
  check('name', 'Name is required').not().isEmpty(),
  check('countryCode', 'Country code is required').not().isEmpty(),
  check('healthcareSystem', 'Healthcare system is required').not().isEmpty(),
  check('currencyCode', 'Currency code is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to create regions' });
    }
    
    // Check if region with same name already exists
    let region = await Region.findOne({ name: req.body.name });
    if (region) {
      return res.status(400).json({ msg: 'Region with this name already exists' });
    }
    
    // Create new region
    region = new Region({
      name: req.body.name,
      countryCode: req.body.countryCode,
      description: req.body.description,
      healthcareSystem: req.body.healthcareSystem,
      healthcareTiers: req.body.healthcareTiers || [],
      currencyCode: req.body.currencyCode,
      active: req.body.active !== undefined ? req.body.active : true
    });
    
    await region.save();
    res.json(region);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/regions/:id
// @desc    Update a region
// @access  Private/Admin
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to update regions' });
    }
    
    const region = await Region.findById(req.params.id);
    
    if (!region) {
      return res.status(404).json({ msg: 'Region not found' });
    }
    
    // Update fields
    if (req.body.name) region.name = req.body.name;
    if (req.body.countryCode) region.countryCode = req.body.countryCode;
    if (req.body.description) region.description = req.body.description;
    if (req.body.healthcareSystem) region.healthcareSystem = req.body.healthcareSystem;
    if (req.body.healthcareTiers) region.healthcareTiers = req.body.healthcareTiers;
    if (req.body.currencyCode) region.currencyCode = req.body.currencyCode;
    if (req.body.active !== undefined) region.active = req.body.active;
    
    region.updatedAt = Date.now();
    
    await region.save();
    res.json(region);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Region not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/regions/:id
// @desc    Delete a region
// @access  Private/Admin
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete regions' });
    }
    
    const region = await Region.findById(req.params.id);
    
    if (!region) {
      return res.status(404).json({ msg: 'Region not found' });
    }
    
    await region.remove();
    res.json({ msg: 'Region removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Region not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;