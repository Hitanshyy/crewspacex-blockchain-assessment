'use strict';

const express = require('express');
const cors = require('cors');
const walletRoutes = require('./routes/wallet');
const contractRoutes = require('./routes/contract');
const chainRoutes = require('./routes/chain');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/wallet', walletRoutes);
app.use('/api/contract', contractRoutes);
app.use('/api/chain', chainRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'blockchain-api' });
});

// TODO: Candidate - add global error handler middleware that returns { error: message } and status 500
// app.use((err, req, res, next) => { ... });

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      throw err;
    }
  });
}

startServer(PORT);
