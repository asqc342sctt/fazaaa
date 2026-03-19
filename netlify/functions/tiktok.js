// Netlify Function: TikTok proxy (no external keys required)
// Endpoint: /.netlify/functions/tiktok
// Method: POST { url: string }

const defaultHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS'
};

exports.handler = async function (event) {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers: defaultHeaders, body: '' };
    }
    if (event.httpMethod !== 'POST') {
      return json(405, { success: false, error: 'Method Not Allowed' });
    }

    const body = safeParse(event.body || '{}');
    const videoUrl = typeof body.url === 'string' ? body.url.trim() : '';
    if (!videoUrl) {
      return json(400, { success: false, error: 'من فضلك أدخل رابط تيك توك صحيح.' });
    }

    // Public provider: tikwm.com
    const providerUrl = 'https://www.tikwm.com/api/?url=' + encodeURIComponent(videoUrl);
    const resp = await fetch(providerUrl, {
      method: 'GET',
      headers: {
        // Some providers behave better with a UA header
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
      }
    });

    const data = await resp.json().catch(() => ({}));
    const d = data && (data.data || data);

    const links = [];
    if (d && typeof d === 'object') {
      if (d.play) links.push({ url: d.play, quality: 'بدون علامة' });
      if (d.wmplay) links.push({ url: d.wmplay, quality: 'مع علامة' });
      if (d.music) links.push({ url: d.music, quality: 'صوت' });
      if (Array.isArray(d.urls)) {
        for (const u of d.urls) {
          if (u && u.url) links.push({ url: u.url, quality: u.quality || u.desc || '' });
        }
      }
    }

    if (!links.length) {
      return json(502, { success: false, error: 'تعذر جلب رابط التحميل، حاول لاحقاً.' });
    }

    return json(200, { success: true, links });
  } catch (e) {
    return json(500, { success: false, error: 'حدث خطأ غير متوقع.' });
  }
};

function safeParse(str) {
  try { return JSON.parse(str); } catch { return {}; }
}

function json(status, payload) {
  return { statusCode: status, headers: defaultHeaders, body: JSON.stringify(payload) };
}


