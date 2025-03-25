const express = require('express');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 300;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// URL Schema
const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
    createdAt: { type: Date, default: Date.now }
});

const URL = mongoose.model('URL', urlSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/shorten', async (req, res) => {
    try {
        let { url } = req.body;
        console.log('Received URL:', url);

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Clean and validate URL
        url = url.trim();
        
        // Remove any special characters at the start
        if (url.startsWith('@') || url.startsWith('!') || url.startsWith('#')) {
            url = url.substring(1);
        }

        // Add https:// if no protocol is specified
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        // Basic URL validation
        if (!url.includes('.')) {
            return res.status(400).json({ error: 'Invalid URL format. Please enter a valid URL (e.g., www.example.com or https://www.example.com)' });
        }

        // Generate short URL
        const shortId = nanoid(6);
        const shortUrl = `${shortId}-zag-eng`;

        // Save to database
        const newUrl = new URL({
            originalUrl: url,
            shortUrl: shortUrl
        });
        await newUrl.save();
        console.log('URL saved successfully:', shortUrl);

        res.json({ shortUrl });
    } catch (error) {
        console.error('Error in /api/shorten:', error);
        if (error.name === 'MongoServerError' || error.name === 'MongoError') {
            res.status(500).json({ error: 'Database error: Please check database connection' });
        } else {
            res.status(500).json({ error: 'Server error: ' + error.message });
        }
    }
});

app.get('/:shortUrl', async (req, res) => {
    try {
        const { shortUrl } = req.params;
        console.log('Looking up shortUrl:', shortUrl);

        const url = await URL.findOne({ shortUrl });
        
        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }

        res.redirect(url.originalUrl);
    } catch (error) {
        console.error('Error in redirect:', error);
        if (error.name === 'MongoServerError' || error.name === 'MongoError') {
            res.status(500).json({ error: 'Database error: Please check database connection' });
        } else {
            res.status(500).json({ error: 'Server error: ' + error.message });
        }
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// MongoDB Connection with retry logic
const connectWithRetry = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Successfully connected to MongoDB.');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

connectWithRetry();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the application at http://localhost:${PORT}`);
}); 