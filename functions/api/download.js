// Cloudflare Pages Function: /functions/download.js
export async function onRequest(context) {
  try {
    const { request, env } = context;

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    const body = await request.json().catch(() => ({}));
    const videoUrl = typeof body.url === 'string' ? body.url : '';
    if (!videoUrl) {
      return new Response(JSON.stringify({ success: false, error: 'برجاء إدخال رابط صحيح من تيك توك' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    const apiKey = env.RAPIDAPI_KEY || '';
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
        if ((p.name === 'TerminalWarlord' || p.name === 'SocialAllInOne') && !apiKey) continue;

        const resp = await p.request();
        const data = await resp.json().catch(() => ({}));
        const links = p.extract(data);
        if (Array.isArray(links) && links.length > 0) {
          return new Response(JSON.stringify({ success: true, data: { links } }), {
            status: 200,
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          });
        }
      } catch (e) {
        lastError = e;
      }
    }

    return new Response(JSON.stringify({ success: false, error: 'تعذر جلب رابط التحميل. برجاء المحاولة لاحقاً.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'حدث خطأ غير متوقع.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
}
