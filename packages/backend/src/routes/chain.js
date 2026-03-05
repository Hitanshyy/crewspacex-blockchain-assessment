'use strict';

const express = require('express');
const { state } = require('../store/chainStore');

const router = express.Router();

// GET /api/chain/blocks - list latest blocks
router.get('/blocks', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
  // BUG: Candidate - should return last `limit` blocks (e.g. slice(-limit)), not first
  const blocks = state.blocks.slice(-limit);
  res.json({ blocks });
});

// GET /api/chain/blocks/:number - get block by number (1-based index)
router.get('/blocks/:number', (req, res) => {
  const number = parseInt(req.params.number, 10);
  if (Number.isNaN(number) || number < 1) {
    return res.status(400).json({ error: 'Invalid block number' });
  }
  const block = state.blocks.find(b => b.number === number);
  if (!block) {
    return res.status(404).json({ error: 'Block not found' });
  }
  res.json(block);
});

module.exports = router;
