(() => {
	const form = document.getElementById('downloadForm');
	const input = document.getElementById('tiktokUrl');
	const result = document.getElementById('result');
	const year = document.getElementById('year');
	year.textContent = new Date().getFullYear();

	const pasteBtn = document.getElementById('pasteBtn');
	if (pasteBtn) {
		pasteBtn.addEventListener('click', async () => {
			try {
				if (navigator.clipboard?.readText) {
					const txt = await navigator.clipboard.readText();
					if (txt) {
						input.value = txt.trim();
						input.focus();
					}
				} else {
					// Fallback: prompt user
					const txt = window.prompt('الصق الرابط هنا:');
					if (txt) {
						input.value = txt.trim();
						input.focus();
					}
				}
			} catch (_) {
				const txt = window.prompt('الصق الرابط هنا:');
				if (txt) {
					input.value = txt.trim();
					input.focus();
				}
			}
		});
	}

	function setLoading(isLoading) {
		const btn = document.getElementById('downloadBtn');
		btn.disabled = isLoading;
		btn.textContent = isLoading ? 'جاري المعالجة...' : 'تنزيل الآن';
	}

	function showError(message) {
		result.classList.remove('hidden');
		result.innerHTML = `<div class="error" style="color:#ffb4b4">${message}</div>`;
	}

	function renderLinks(data) {
		// Data shape depends on API provider; handle common shapes
		let links = [];
		if (Array.isArray(data)) {
			links = data;
		} else if (data?.download_url) {
			links = [{ url: data.download_url, quality: 'افتراضي' }];
		} else if (data?.links) {
			links = data.links;
		} else if (data?.video && data.video.no_watermark) {
			links = [{ url: data.video.no_watermark, quality: 'بدون علامة' }];
		}

		if (!links.length) {
			showError('لم يتم العثور على روابط تحميل صالحة.');
			return;
		}

		// Find the best quality options without duplicates
		const findByLabel = (label) => links.find(l => (l.quality || '').includes(label));
		const findByUrlPattern = (pattern) => links.find(l => l.url && l.url.includes(pattern));
		
		// Priority order: no watermark first, then with watermark, then audio
		const noWm = findByLabel('بدون علامة') || 
					findByLabel('(play)') || 
					findByUrlPattern('play') ||
					links.find(l => l.quality && !l.quality.includes('علامة') && !l.quality.includes('wmplay') && !l.quality.includes('صوت'));
		
		const wm = findByLabel('مع علامة') || 
				  findByLabel('(wmplay)') || 
				  findByUrlPattern('wmplay');
		
		const audio = findByLabel('صوت') || 
					 links.find(l => /\.mp3|audio/i.test(l.url || ''));

		// Create clean, non-duplicate buttons with download attribute
		const primaryButtons = [];
		if (noWm) {
			primaryButtons.push(`<a class="btn btn-primary" href="${noWm.url}" download="FazzaPlay.mp4" rel="noopener">🎬 تنزيل الفيديو بدون علامة</a>`);
		}
		if (wm && wm.url !== noWm?.url) {
			primaryButtons.push(`<a class="btn btn-outline" href="${wm.url}" download="FazzaPlay.mp4" rel="noopener">📺 تنزيل الفيديو مع علامة</a>`);
		}
		if (audio && audio.url !== noWm?.url && audio.url !== wm?.url) {
			primaryButtons.push(`<a class="btn btn-audio" href="${audio.url}" download="FazzaPlay.mp3" rel="noopener">🎵 تحميل الصوت فقط</a>`);
		}

		// If no primary buttons found, show the first available link
		if (primaryButtons.length === 0 && links.length > 0) {
			primaryButtons.push(`<a class="btn btn-primary" href="${links[0].url}" download="FazzaPlay.mp4" rel="noopener">📥 تنزيل الفيديو</a>`);
		}

		const html = [
			primaryButtons.length ? `<div class="actions">${primaryButtons.join('')}</div>` : ''
		].join('');
		
		result.classList.remove('hidden');
		result.innerHTML = html;
		try { result.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (_) {}
	}

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const url = input.value.trim();
		if (!url) {
			showError('برجاء إدخال رابط فيديو صحيح.');
			return;
		}
		setLoading(true);
		result.classList.add('hidden');
		result.innerHTML = '';
		try {
			const res = await fetch('/api/download', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url })
			});
			const data = await res.json();
			if (!res.ok || !data.success) {
				throw new Error(data?.error || 'خطأ غير متوقع');
			}
			renderLinks(data.data);
		} catch (err) {
			showError(err.message || 'تعذر إتمام العملية.');
		} finally {
			setLoading(false);
		}
	});
})();
