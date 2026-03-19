'use strict';

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Security & common middleware
app.use(helmet({
	crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting for API
const limiter = rateLimit({
	windowMs: 60 * 1000,
	max: 60,
	standardHeaders: true,
	legacyHeaders: false
});
app.use('/api/', limiter);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (_req, res) => {
	res.json({ status: 'ok', service: 'fazzaplay-tiktok-downloader' });
});

// TikTok download proxy endpoint
// Uses RapidAPI: tiktok-downloader-download-tiktok-videos-without-watermark
// Set env RAPIDAPI_KEY
app.post('/api/download', async (req, res) => {
	try {
		const { url } = req.body || {};
		if (!url || typeof url !== 'string') {
			return res.status(400).json({ error: 'برجاء إدخال رابط صحيح من تيك توك' });
		}

		if (!process.env.RAPIDAPI_KEY) {
			return res.status(500).json({ error: 'الخادم غير مُعد. مفتاح RAPIDAPI مفقود.' });
		}

		// Example API: https://rapidapi.com/TerminalWarlord/api/tiktok-downloader-download-tiktok-videos-without-watermark/
		// Some APIs use GET with query param 'url' or 'link'
		const options = {
			method: 'GET',
			url: 'https://tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com/vid/index',
			params: { url },
			headers: {
				'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
				'X-RapidAPI-Host': 'tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com'
			}
		};

		const response = await axios.request(options);
		// Expected response contains download links
		return res.json({ success: true, data: response.data });
	} catch (error) {
		const status = error.response?.status || 500;
		return res.status(status).json({
			success: false,
			error: 'تعذر جلب رابط التحميل. برجاء المحاولة لاحقاً.',
			details: process.env.NODE_ENV === 'development' ? (error.response?.data || error.message) : undefined
		});
	}
});

// Fallback to index.html
app.get('*', (_req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`FazzaPlay TikTok Downloader running on http://localhost:${PORT}`);
});


