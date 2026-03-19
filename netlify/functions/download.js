// Netlify Function: /api/download
// Mirrors backend logic from tik tok/server.js using native fetch (no deps)

exports.handler = async function(event) {
  try {
    if (event.httpMethod !== 'POST') {
      return json(405, { success: false, error: 'Method Not Allowed' });
    }

    const body = safeParse(event.body || '{}');
    const videoUrl = typeof body.url === 'string' ? body.url : '';
    if (!videoUrl) {
      return json(400, { success: false, error: 'برجاء إدخال رابط صحيح من تيك توك' });
    }

    const apiKey = process.env.RAPIDAPI_KEY || '';
    const providers = [
      {
        name: 'TerminalWarlord',
        request: () => fetch(
          'https://tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com/vid/index?url=' + encodeURIComponent(videoUrl),
          {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': apiKey,
              'X-RapidAPI-Host': 'tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com'
            }
          }
        ),
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
        request: () => fetch(
          'https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink?url=' + encodeURIComponent(videoUrl),
          {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': apiKey,
              'X-RapidAPI-Host': 'social-download-all-in-one.p.rapidapi.com'
            }
          }
        ),
        extract: (data) => Array.isArray(data?.links)
          ? data.links.map((l) => ({ url: l?.link || l?.url, quality: l?.quality || l?.resolution || '' })).filter(x => x.url)
          : []
      },
      {
        name: 'TikWM',
        request: () => fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(videoUrl), { method: 'GET' }),
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
    for (const p of providers) {
      try {
        if ((p.name === 'TerminalWarlord' || p.name === 'SocialAllInOne') && !apiKey) {
          continue;
        }
        const resp = await p.request();
        const data = await resp.json().catch(() => ({}));
        const links = p.extract(data);
        if (Array.isArray(links) && links.length > 0) {
          return json(200, { success: true, data: { links } });
        }
      } catch (e) {
        lastError = e;
      }
    }

    return json(502, { success: false, error: 'تعذر جلب رابط التحميل. برجاء المحاولة لاحقاً.' });
  } catch (error) {
    return json(500, { success: false, error: 'حدث خطأ غير متوقع.' });
  }
}

function safeParse(str) {
  try { return JSON.parse(str); } catch { return {}; }
}

function json(status, payload) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(payload)
  };
}


