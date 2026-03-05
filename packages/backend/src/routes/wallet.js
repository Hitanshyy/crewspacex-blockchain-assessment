'use strict';

const express = require('express');
const { getWallet } = require('../store/chainStore');

const router = express.Router();

// GET /api/wallet/:address - get balance and nonce
router.get('/:address', (req, res) => {
  const { address } = req.params;

  if (!address || !address.startsWith('0x')) {
    return res.status(400).json({ error: 'Invalid address format' });
  }

  const wallet = getWallet(address);

  if (!wallet) {
    return res.status(404).json({ error: 'Wallet not found' });
  }

  res.json({
  address: address.toLowerCase(),
  balance: wallet.balance !== undefined ? wallet.balance.toString() : "0",
  nonce: wallet.nonce !== undefined ? wallet.nonce.toString() : "0"
});
});

module.exports = router;