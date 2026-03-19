(() => {
	const form = document.getElementById('downloadForm');
	const input = document.getElementById('tiktokUrl');
	const result = document.getElementById('result');
	const year = document.getElementById('year');
	year.textContent = new Date().getFullYear();

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

		const html = [
			'<div class="success">تم العثور على الروابط التالية:</div>',
			'<div class="link-list">',
			...links.map((l, idx) => `<div class="link-item"><a target="_blank" rel="noopener" href="${l.url}">تنزيل ${l.quality || ''}</a><small>#${idx+1}</small></div>`),
			'</div>'
		].join('');
		result.classList.remove('hidden');
		result.innerHTML = html;
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


