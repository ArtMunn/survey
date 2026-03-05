const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const https = require('https');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const CustomerSource = require('./models/CustomerSource');

// connect to MongoDB
const mongoUri = process.env.MONGO_URI // || "mongodb+srv://artmunn_db_user:1OTKUAvFmJRkgAKx@cluster0.trud1bi.mongodb.net/survey-collection?appName=Cluster0";
mongoose.connect(mongoUri) // just this line, no options needed with Mongoose 6+
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
  console.log(process.env.MONGO_URI);

// endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Cron job to prevent cold starts - pings server every 5 minutes
if (process.env.RENDER_EXTERNAL_URL) {
  const keepAliveUrl = process.env.RENDER_EXTERNAL_URL;
  
  cron.schedule('*/5 * * * *', () => {
    https.get(`${keepAliveUrl}/health`, (res) => {
      console.log(`Keep-alive ping at ${new Date().toISOString()} - Status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error('Keep-alive ping failed:', err.message);
    });
  });
  
  console.log('Cold start prevention enabled: Server will ping itself every 5 minutes');
}

app.post('/api/sources', async (req, res) => {
  try {
    const { source } = req.body;
    const entry = new CustomerSource({ source });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/sources', async (req, res) => {
  try {
    const entries = await CustomerSource.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
