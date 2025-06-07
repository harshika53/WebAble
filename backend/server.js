const express = require('express');
const cors = require('cors');
const { scanUrl } = require('./scan_service');

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// Your existing scan endpoint
app.post('/scan', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  try {
    console.log(`Scanning URL: ${url}`);
    const results = await scanUrl(url);
    res.json(results);
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Scan failed', details: error.message });
  }
});

// This endpoint currently fetches a report by URL, not by scan ID.
// If you want to support fetching by scan ID, you must implement scan result storage and lookup by ID.
// Otherwise, make sure your frontend never calls this endpoint with a scan ID.
app.get('/api/reports/:url', async (req, res) => {
  const url = decodeURIComponent(req.params.url);
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  try {
    console.log(`Getting report for URL: ${url}`);
    const results = await scanUrl(url);
    res.json(results);
  } catch (error) {
    console.error('Report fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch report', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', port: PORT, timestamp: new Date().toISOString() });
});

// Change port to 5000 to match your frontend expectations
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Scan service running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
});