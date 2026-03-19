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

// Static files with cache control
app.use(express.static(path.join(__dirname, 'public'), {
	setHeaders: (res, path) => {
		// Disable caching for HTML, CSS, and JS files
		if (path.endsWith('.html') || path.endsWith('.css') || path.endsWith('.js')) {
			res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
			res.setHeader('Pragma', 'no-cache');
			res.setHeader('Expires', '0');
		}
		// Cache images and fonts for 1 hour
		else if (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.gif') || path.endsWith('.svg') || path.endsWith('.woff') || path.endsWith('.woff2')) {
			res.setHeader('Cache-Control', 'public, max-age=3600');
		}
	}
}));

// Health check
app.get('/health', (_req, res) => {
	res.json({ status: 'ok', service: 'fazzaplay-tiktok-downloader' });
});

// TikTok download proxy endpoint with provider fallback
// Set env RAPIDAPI_KEY
app.post('/api/download', async (req, res) => {
	try {
		const { url: videoUrl } = req.body || {};
		if (!videoUrl || typeof videoUrl !== 'string') {
			return res.status(400).json({ error: 'برجاء إدخال رابط صحيح من تيك توك' });
		}

		const apiKey = process.env.RAPIDAPI_KEY;
		if (!apiKey || /ضع-مفتاح|your-rapidapi-key/i.test(apiKey)) {
			return res.status(500).json({ error: 'الخادم غير مُعد. الرجاء إضافة RAPIDAPI_KEY صالح في ملف .env.' });
		}

		const providers = [
			{
				name: 'TerminalWarlord',
				request: {
					method: 'GET',
					url: 'https://tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com/vid/index',
					params: { url: videoUrl },
					headers: {
						'X-RapidAPI-Key': apiKey,
						'X-RapidAPI-Host': 'tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com'
					}
				},
				extract: (data) => {
					const links = [];
					if (data?.video?.no_watermark) links.push({ url: data.video.no_watermark, quality: 'بدون علامة' });
					if (data?.video?.watermark) links.push({ url: data.video.watermark, quality: 'مع علامة' });
					if (data?.hdplay) links.push({ url: data.hdplay, quality: 'HD' });
					if (data?.play) links.push({ url: data.play, quality: 'SD' });
					if (data?.download_url) links.push({ url: data.download_url, quality: 'افتراضي' });
					return links;
				}
			},
			{
				name: 'SocialAllInOne',
				request: {
					method: 'GET',
					url: 'https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink',
					params: { url: videoUrl },
					headers: {
						'X-RapidAPI-Key': apiKey,
						'X-RapidAPI-Host': 'social-download-all-in-one.p.rapidapi.com'
					}
				},
				extract: (data) => {
					if (Array.isArray(data?.links)) {
						return data.links.map((l) => ({ url: l?.link || l?.url, quality: l?.quality || l?.resolution || '' })).filter(x => x.url);
					}
					return [];
				}
			},
			// Public fallback (non-RapidAPI): tikwm.com
			{
				name: 'TikWM',
				request: {
					method: 'GET',
					url: 'https://www.tikwm.com/api/',
					params: { url: videoUrl }
				},
				extract: (data) => {
					const d = data?.data || data;
					const links = [];
					if (d?.play) links.push({ url: d.play, quality: 'بدون علامة (play)' });
					if (d?.wmplay) links.push({ url: d.wmplay, quality: 'مع علامة (wmplay)' });
					if (d?.music) links.push({ url: d.music, quality: 'صوت' });
					if (Array.isArray(d?.urls)) {
						for (const u of d.urls) {
							if (u?.url) links.push({ url: u.url, quality: u?.quality || u?.desc || '' });
						}
					}
					return links;
				}
			}
		];

		let lastError = null;
		for (const provider of providers) {
			try {
				const resp = await axios.request(provider.request);
				const links = provider.extract(resp.data);
				if (Array.isArray(links) && links.length > 0) {
					return res.json({ success: true, data: { links } });
				}
			} catch (err) {
				lastError = err;
				const status = err.response?.status;
				if (![401, 403, 429, 400, 404, 500].includes(status)) {
					break;
				}
			}
		}

		const status = lastError?.response?.status || 502;
		let message = 'تعذر جلب رابط التحميل. برجاء المحاولة لاحقاً.';
		if (status === 403 || status === 401) message = 'المفتاح غير صالح أو الاشتراك غير مفعّل على RapidAPI.';
		if (status === 429) message = 'تم تجاوز الحد المسموح به. برجاء المحاولة لاحقاً.';

		return res.status(status).json({
			success: false,
			error: message,
			details: process.env.NODE_ENV === 'development' ? (lastError?.response?.data || lastError?.message) : undefined
		});
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


