const express = require('express');
const cors = require('cors');
const { scanUrl } = require('./scan_service');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/scan', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  try {
    const results = await scanUrl(url);
    res.json(results);
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Scan failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Scan service running on port ${PORT}`);
});