// DOM Elements
// modal and toolButton injection removed; pages are standalone now

// تحسينات للاستجابة
let isMobile = window.innerWidth <= 768;
let isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

// تحديث حالة الجهاز عند تغيير حجم النافذة
window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
    isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
});

// modal logic removed

// Event Listeners (navigation links now handle themselves)

// تنظيف الذاكرة عند إغلاق الصفحة
window.addEventListener('beforeunload', function() {
    if (window.compressedImageBlob) {
        URL.revokeObjectURL(window.compressedImageBlob);
        window.compressedImageBlob = null;
        window.compressedImageFormat = null;
    }
    
    if (window.generatedPdf) {
        URL.revokeObjectURL(window.generatedPdf);
        window.generatedPdf = null;
        window.pdfFileName = null;
    }
    
    if (window.currentImageUrl) {
        window.currentImageUrl = null;
        window.currentImageFileName = null;
        window.currentImageWidth = null;
        window.currentImageHeight = null;
    }
});


function downloadGeneratedImage() {
    if (!window.currentImageUrl) {
        showNotification('لا توجد صورة للتحميل', 'warning');
        return;
    }
    
    try {
        showNotification('جاري تحميل الصورة...', 'info');
        
        // تحديد امتداد الملف بناءً على المصدر
        let fileExtension = 'jpg';
        if (window.currentImageUrl.includes('placeholder.com')) {
            fileExtension = 'png';
        } else if (window.currentImageUrl.includes('dummyimage.com')) {
            fileExtension = 'png';
        }
        
        // إنشاء رابط تحميل
    const link = document.createElement('a');
        link.href = window.currentImageUrl;
        link.download = `${window.currentImageFileName}.${fileExtension}`;
        
        // إضافة timestamp لتجنب تكرار أسماء الملفات
        link.download = `${window.currentImageFileName}-${Date.now()}.${fileExtension}`;
        
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
        
        showNotification('تم بدء تحميل الصورة!', 'success');
        
    } catch (error) {
        showNotification('حدث خطأ أثناء التحميل: ' + error.message, 'error');
        console.error('Download error:', error);
    }
}

/*async function downloadAllGeneratedImages() {
    try {
        const grid = document.getElementById('imageGrid');
        if (!grid || !grid.children.length) { showNotification('لا توجد صور للتحميل', 'warning'); return; }
        showNotification('جاري تجهيز الملف...', 'info');
        const zip = new JSZip();
        const folder = zip.folder('random-images');
        const images = grid.querySelectorAll('img');
        let index = 1;
        for (const img of images) {
            const dataUrl = await getImageDataURL(img.src);
            const base64 = dataUrl.split(',')[1];
            const ext = dataUrl.startsWith('data:image/png') ? 'png' : 'jpg';
            folder.file(`image-${index}.${ext}`, base64, { base64: true });
            index++;
        }
        const blob = await zip.generateAsync({ type: 'blob' });
        saveAs(blob, `random-images-${Date.now()}.zip`);
        showNotification('تم تجهيز التحميل!', 'success');
    } catch (e) {
        showNotification('فشل إنشاء الملف المضغوط', 'error');
    }
}

function getImageDataURL(url) {
    return new Promise((resolve, reject) => {
        if (url.startsWith('data:')) return resolve(url);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = this.naturalWidth; canvas.height = this.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(this, 0, 0);
            try { resolve(canvas.toDataURL('image/jpeg', 0.92)); } catch (e) { reject(e); }
        };
        img.onerror = reject;
        img.src = url;
    });
}*/

function copyImageLink() {
    if (!window.currentImageUrl) {
        showNotification('لا توجد صورة لنسخ رابطها', 'warning');
        return;
    }
    
    try {
        // محاولة استخدام Clipboard API الحديث
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(window.currentImageUrl).then(() => {
                showNotification('تم نسخ رابط الصورة إلى الحافظة!', 'success');
            }).catch((err) => {
                console.warn('Clipboard API failed, using fallback:', err);
                useFallbackCopy();
            });
        } else {
            // استخدام الطريقة التقليدية للمتصفحات القديمة
            useFallbackCopy();
        }
    } catch (error) {
        console.error('Copy error:', error);
        useFallbackCopy();
    }
}

function useFallbackCopy() {
    try {
        const textArea = document.createElement('textarea');
        textArea.value = window.currentImageUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
            showNotification('تم نسخ رابط الصورة إلى الحافظة!', 'success');
        } else {
            showNotification('فشل في نسخ الرابط. يرجى النسخ يدوياً.', 'warning');
        }
    } catch (error) {
        console.error('Fallback copy error:', error);
        showNotification('فشل في نسخ الرابط. يرجى النسخ يدوياً.', 'error');
    }
}

function resetImageGenerator() {
    try {
        // إعادة تعيين حقول الإدخال
        const widthInput = document.getElementById('imageWidth');
        const heightInput = document.getElementById('imageHeight');
        const sourceSelect = document.getElementById('imageSource');
        const categorySelect = document.getElementById('imageCategory');
        
        if (widthInput) widthInput.value = '400';
        if (heightInput) heightInput.value = '300';
        if (sourceSelect) sourceSelect.value = 'picsum';
        if (categorySelect) categorySelect.value = 'random';
        
        // إعادة تعيين حدود الحقول
        if (widthInput) widthInput.style.borderColor = '#e1e5e9';
        if (heightInput) heightInput.style.borderColor = '#e1e5e9';
        
        // إخفاء منطقة النتائج
        const resultDiv = document.getElementById('imageResult');
        if (resultDiv) {
            resultDiv.style.display = 'none';
        }
        
        // تنظيف الذاكرة
        if (window.currentImageUrl) {
            window.currentImageUrl = null;
            window.currentImageFileName = null;
            window.currentImageWidth = null;
            window.currentImageHeight = null;
        }
        
        showNotification('تم إعادة تعيين جميع الإعدادات', 'success');
        
    } catch (error) {
        console.error('Reset error:', error);
        showNotification('حدث خطأ أثناء إعادة التعيين', 'error');
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/*function initializeRandomImageGenerator() {
    try {
        // إضافة مستمعي الأحداث للتحقق من صحة الأبعاد
        const widthInput = document.getElementById('imageWidth');
        const heightInput = document.getElementById('imageHeight');
        
        if (widthInput && heightInput) {
            // التحقق من صحة الأبعاد عند الكتابة
            widthInput.addEventListener('input', validateDimensions);
            heightInput.addEventListener('input', validateDimensions);
            
            // تعيين القيم الافتراضية
            widthInput.value = '400';
            heightInput.value = '300';
            
            // تطبيق التحقق الأولي
            validateDimensions();
        }
        
        // إخفاء منطقة النتائج عند التحميل
        const resultArea = document.getElementById('imageResult');
        if (resultArea) {
            resultArea.style.display = 'none';
        }
        
        // إضافة مستمعي الأحداث للاختيارات
        const sourceSelect = document.getElementById('imageSource');
        const categorySelect = document.getElementById('imageCategory');
        
        if (sourceSelect) {
            sourceSelect.addEventListener('change', function() {
                // إعادة تعيين الفئة عند تغيير المصدر
                if (categorySelect) {
                    categorySelect.value = 'random';
                }
                showNotification('تم تغيير مصدر الصورة', 'info');
            });
        }
        
        if (categorySelect) {
            categorySelect.addEventListener('change', function() {
                showNotification('تم تغيير فئة الصورة', 'info');
            });
        }
        
        // إضافة مستمعي الأحداث للأزرار
        const generateBtn = document.querySelector('.generate-btn');
        const resetBtn = document.querySelector('.reset-btn');
        
        if (generateBtn) {
            generateBtn.addEventListener('click', function() {
                // إضافة تأثير النقر
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                // إضافة تأثير النقر
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        }
        
        showNotification('تم تهيئة أداة مولد الصور العشوائية', 'success');
        
    } catch (error) {
        console.error('Initialization error:', error);
        showNotification('حدث خطأ أثناء تهيئة الأداة', 'error');
    }
}*/

/*function validateDimensions() {
    try {
        const widthInput = document.getElementById('imageWidth');
        const heightInput = document.getElementById('imageHeight');
        
        if (!widthInput || !heightInput) return;
        
        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);
        
        // التحقق من العرض
        if (isNaN(width) || width < 100 || width > 1200) {
            widthInput.style.borderColor = '#e74c3c';
            widthInput.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        } else {
            widthInput.style.borderColor = '#e1e5e9';
            widthInput.style.boxShadow = 'none';
        }
        
        // التحقق من الارتفاع
        if (isNaN(height) || height < 100 || height > 1200) {
            heightInput.style.borderColor = '#e74c3c';
            heightInput.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        } else {
            heightInput.style.borderColor = '#e1e5e9';
            heightInput.style.boxShadow = 'none';
        }
        
        // إظهار رسالة تحذير إذا كانت الأبعاد غير صحيحة
        const generateBtn = document.querySelector('.generate-btn');
        if (generateBtn) {
            if ((isNaN(width) || width < 100 || width > 1200) || 
                (isNaN(height) || height < 100 || height > 1200)) {
                generateBtn.disabled = true;
                generateBtn.style.opacity = '0.6';
                generateBtn.style.cursor = 'not-allowed';
            } else {
                generateBtn.disabled = false;
                generateBtn.style.opacity = '1';
                generateBtn.style.cursor = 'pointer';
            }
        }
        
    } catch (error) {
        console.error('Validation error:', error);
    }
}*/

// Random Number Generator

function generateRandomNumbers() {
    const min = parseInt(document.getElementById('minNumber').value);
    const max = parseInt(document.getElementById('maxNumber').value);
    const count = parseInt(document.getElementById('numberCount').value);
    
    if (min >= max) {
        alert('الحد الأدنى يجب أن يكون أقل من الحد الأقصى');
        return;
    }
    
    let numbers = [];
    for (let i = 0; i < count; i++) {
        numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    
    const resultDiv = document.getElementById('numberResult');
    const numbersText = document.getElementById('numbersText');
    const sumText = document.getElementById('sumText');
    if (numbersText) numbersText.textContent = numbers.join(', ');
    if (sumText) sumText.textContent = numbers.reduce((a, b) => a + b, 0);
    if (resultDiv) resultDiv.style.display = 'block';
}

// Password Generator

function generatePassword() {
    const length = parseInt(document.getElementById('passwordLength').value);
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    
    let chars = '';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    
    if (!chars.length) {
        try { showNotification && showNotification('اختر نوعاً واحداً على الأقل | Select at least one character set', 'warning'); } catch(e) {}
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const resultDiv = document.getElementById('passwordResult');
    const passwordText = document.getElementById('passwordText');
    if (passwordText) passwordText.value = password;
    if (resultDiv) resultDiv.style.display = 'block';
}

function copyPasswordValue() {
    const passwordText = document.getElementById('passwordText');
    if (!passwordText || !passwordText.value) {
        try { showNotification && showNotification('لا توجد كلمة مرور للنسخ | Nothing to copy', 'warning'); } catch(e) {}
        return;
    }
    navigator.clipboard.writeText(passwordText.value).then(() => {
        try { showNotification && showNotification('تم النسخ | Copied', 'success'); } catch(e) {}
    }).catch(() => {
        passwordText.select(); document.execCommand('copy');
        try { showNotification && showNotification('تم النسخ | Copied', 'success'); } catch(e) {}
    });
}

function resetPasswordGenerator() {
    const length = document.getElementById('passwordLength');
    const lengthValue = document.getElementById('lengthValue');
    if (length) length.value = 16;
    if (lengthValue) lengthValue.textContent = '16';
    const checks = ['includeUppercase','includeLowercase','includeNumbers'];
    checks.forEach(id => { const el = document.getElementById(id); if (el) el.checked = true; });
    const passwordText = document.getElementById('passwordText');
    if (passwordText) passwordText.value = '';
    const resultDiv = document.getElementById('passwordResult');
    if (resultDiv) resultDiv.style.display = 'none';
    try { showNotification && showNotification('تمت إعادة التعيين | Reset', 'info'); } catch(e) {}
}

// Text Counter

// Color Picker

// QR Generator

// Base64 Converter

// URL Shortener

// Image Compressor

// PDF Converter

// Initialize tool events
function initializeToolEvents(toolType) {
    switch(toolType) {
        case 'password-generator':
            {
                const slider = document.getElementById('passwordLength');
                const lengthValue = document.getElementById('lengthValue');
                if (slider && lengthValue) slider.addEventListener('input', () => { lengthValue.textContent = slider.value; });
                const copy1 = document.getElementById('copyPasswordBtn');
                const copy2 = document.getElementById('copyPasswordBtn2');
                const resetBtn = document.getElementById('resetPasswordBtn');
                if (copy1) copy1.addEventListener('click', copyPasswordValue);
                if (copy2) copy2.addEventListener('click', copyPasswordValue);
                if (resetBtn) resetBtn.addEventListener('click', resetPasswordGenerator);
            }
            break;
        case 'text-counter':
            {
                const ta = document.getElementById('textInput');
                if (ta) ta.addEventListener('input', updateTextCount);
                const copyBtn = document.getElementById('copyTextCounterBtn');
                const dlBtn = document.getElementById('downloadTextCounterBtn');
                const resetBtn = document.getElementById('resetTextCounterBtn');
                if (copyBtn) copyBtn.addEventListener('click', copyTextCounter);
                if (dlBtn) dlBtn.addEventListener('click', downloadTextCounter);
                if (resetBtn) resetBtn.addEventListener('click', resetTextCounter);
            }
            break;
        case 'color-picker':
            document.getElementById('colorPicker').addEventListener('input', updateColorInfo);
            const hexInput = document.getElementById('hexInput');
            const rgbInput = document.getElementById('rgbInput');
            const copyHex = document.getElementById('copyHex');
            const copyRgb = document.getElementById('copyRgb');
            const eyedropperBtn = document.getElementById('eyedropperBtn');
            if (hexInput) hexInput.addEventListener('change', updateFromHex);
            if (rgbInput) rgbInput.addEventListener('change', updateFromRgb);
            if (copyHex) copyHex.addEventListener('click', () => copyToClipboard(hexInput.value));
            if (copyRgb) copyRgb.addEventListener('click', () => copyToClipboard(rgbInput.value));
            if (eyedropperBtn) eyedropperBtn.addEventListener('click', handleEyedropper);
            // تحميل الألوان الحديثة من التخزين
            loadRecentSwatches();
            updateColorInfo();
            break;
        case 'image-compressor':
            initializeImageCompressor();
            break;
        case 'pdf-converter':
            initializePdfConverter();
            break;
        // random-image removed
        case 'image-to-text':
            initializeOCRTool();
            break;
        case 'logo-generator':
            initializeLogoGenerator();
            break;
        case 'age-calculator':
            initializeAgeCalculator();
            break;
        case 'base64-converter':
            {
                const input = document.getElementById('base64Input');
                const copyBtn = document.getElementById('copyBase64Btn');
                const resetBtn = document.getElementById('resetBase64Btn');
                const copyResultBtn = document.getElementById('copyResultBtn');
                const downloadBtn = document.getElementById('downloadResultBtn');
                
                if (input) input.addEventListener('input', updateBase64Stats);
                if (copyBtn) copyBtn.addEventListener('click', copyBase64Result);
                if (resetBtn) resetBtn.addEventListener('click', resetBase64Converter);
                if (copyResultBtn) copyResultBtn.addEventListener('click', copyBase64Result);
                if (downloadBtn) downloadBtn.addEventListener('click', downloadBase64Result);
            }
            break;
        case 'url-shortener':
            {
                const input = document.getElementById('longUrl');
                const copyBtn = document.getElementById('copyShortUrlBtn');
                const resetBtn = document.getElementById('resetUrlBtn');
                const copyResultBtn = document.getElementById('copyResultUrlBtn');
                const downloadBtn = document.getElementById('downloadUrlBtn');
                
                if (input) input.addEventListener('input', updateUrlStats);
                if (copyBtn) copyBtn.addEventListener('click', copyShortUrl);
                if (resetBtn) resetBtn.addEventListener('click', resetUrlShortener);
                if (copyResultBtn) copyResultBtn.addEventListener('click', copyShortUrl);
                if (downloadBtn) downloadBtn.addEventListener('click', downloadUrlResult);
            }
            break;
    }
}

// Text counter functions
function updateTextCount() {
    const text = document.getElementById('textInput').value;
    const resultDiv = document.getElementById('textCountResult');
    
    const charCount = text.length;
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const lineCount = text === '' ? 0 : text.split('\n').length;
    
    const charCountSpan = document.getElementById('charCount');
    const wordCountSpan = document.getElementById('wordCount');
    const lineCountSpan = document.getElementById('lineCount');
    if (charCountSpan) charCountSpan.textContent = charCount;
    if (wordCountSpan) wordCountSpan.textContent = wordCount;
    if (lineCountSpan) lineCountSpan.textContent = lineCount;
}

// Text counter actions
function copyTextCounter() {
    const el = document.getElementById('textInput');
    if (!el || !el.value.length) {
        try { showNotification && showNotification('لا يوجد نص لنسخه | Nothing to copy', 'warning'); } catch(e) {}
        return;
    }
    navigator.clipboard.writeText(el.value).then(() => {
        try { showNotification && showNotification('تم النسخ | Copied', 'success'); } catch(e) {}
    }).catch(() => {
        el.select(); document.execCommand('copy');
        try { showNotification && showNotification('تم النسخ | Copied', 'success'); } catch(e) {}
    });
}

function downloadTextCounter() {
    const el = document.getElementById('textInput');
    const text = el ? el.value : '';
    if (!text.length) {
        try { showNotification && showNotification('لا يوجد نص للتنزيل | Nothing to download', 'warning'); } catch(e) {}
        return;
    }
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'text-' + Date.now() + '.txt';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    try { showNotification && showNotification('تم التنزيل | Downloaded', 'success'); } catch(e) {}
}

function resetTextCounter() {
    const el = document.getElementById('textInput');
    if (el) el.value = '';
    const ids = ['charCount','wordCount','lineCount'];
    ids.forEach(id => { const n = document.getElementById(id); if (n) n.textContent = '0'; });
    try { showNotification && showNotification('تمت إعادة التعيين | Reset', 'info'); } catch(e) {}
}

// Color picker functions
function updateColorInfo() {
    const color = document.getElementById('colorPicker').value;
    const preview = document.getElementById('colorPreview');
    const hexInput = document.getElementById('hexInput');
    const rgbInput = document.getElementById('rgbInput');
    
    preview.style.backgroundColor = color;
    if (hexInput) hexInput.value = color.toLowerCase();
    const r = parseInt(color.substr(1,2), 16);
    const g = parseInt(color.substr(3,2), 16);
    const b = parseInt(color.substr(5,2), 16);
    if (rgbInput) rgbInput.value = `rgb(${r}, ${g}, ${b})`;
    updateContrast(color);
    addToRecentSwatches(color);
}

// ===== Color Picker helpers =====
function isValidHex(hex) {
    return /^#?[0-9a-fA-F]{6}$/.test(hex);
}

function isValidRgb(str) {
    return /^\s*rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*$/.test(str);
}

function hexToRgb(hex) {
    const clean = hex.replace('#','');
    const r = parseInt(clean.substr(0,2), 16);
    const g = parseInt(clean.substr(2,2), 16);
    const b = parseInt(clean.substr(4,2), 16);
    return { r, g, b };
}

function rgbToHex(r,g,b) {
    const toHex = (n) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getLuminance(r,g,b) {
    const srgb = [r,g,b].map(v => {
        v = v/255;
        return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
    });
    return 0.2126*srgb[0] + 0.7152*srgb[1] + 0.0722*srgb[2];
}

function getContrastRatio(hex1, hex2) {
    const a = hexToRgb(hex1);
    const b = hexToRgb(hex2);
    const L1 = getLuminance(a.r,a.g,a.b);
    const L2 = getLuminance(b.r,b.g,b.b);
    const ratio = (Math.max(L1,L2)+0.05) / (Math.min(L1,L2)+0.05);
    return Math.round(ratio*100)/100;
}

function wcagLabel(ratio) {
    if (ratio >= 7) return 'AAA نص صغير';
    if (ratio >= 4.5) return 'AA نص صغير / AAA نص كبير';
    if (ratio >= 3) return 'AA نص كبير';
    return 'غير مطابق';
}

function updateContrast(hex) {
    const contrastWhite = getContrastRatio(hex, '#ffffff');
    const contrastBlack = getContrastRatio(hex, '#000000');
    const cw = document.getElementById('contrastWhite');
    const cb = document.getElementById('contrastBlack');
    const wcw = document.getElementById('wcagWhite');
    const wcb = document.getElementById('wcagBlack');
    const sampleWhite = document.getElementById('sampleOnWhite');
    const sampleBlack = document.getElementById('sampleOnBlack');
    if (cw) cw.textContent = contrastWhite.toString();
    if (cb) cb.textContent = contrastBlack.toString();
    if (wcw) wcw.textContent = `(${wcagLabel(contrastWhite)})`;
    if (wcb) wcb.textContent = `(${wcagLabel(contrastBlack)})`;
    if (sampleWhite) {
        sampleWhite.style.backgroundColor = '#ffffff';
        sampleWhite.style.color = getContrastRatio(hex, '#ffffff') >= getContrastRatio('#000000', '#ffffff') ? hex : '#000000';
    }
    if (sampleBlack) {
        sampleBlack.style.backgroundColor = '#000000';
        sampleBlack.style.color = getContrastRatio(hex, '#000000') >= getContrastRatio('#ffffff', '#000000') ? hex : '#ffffff';
    }
}

function updateFromHex() {
    const hexInput = document.getElementById('hexInput');
    if (!hexInput) return;
    let val = hexInput.value.trim();
    if (!val.startsWith('#')) val = '#' + val;
    if (!isValidHex(val)) {
        showNotification('صيغة HEX غير صحيحة', 'warning');
        return;
    }
    const picker = document.getElementById('colorPicker');
    picker.value = val;
    updateColorInfo();
}

function updateFromRgb() {
    const rgbInput = document.getElementById('rgbInput');
    if (!rgbInput) return;
    const val = rgbInput.value.trim();
    const m = val.match(/^\s*rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*$/);
    if (!m) {
        showNotification('صيغة RGB غير صحيحة', 'warning');
        return;
    }
    const r = Math.min(255, parseInt(m[1]));
    const g = Math.min(255, parseInt(m[2]));
    const b = Math.min(255, parseInt(m[3]));
    const hex = rgbToHex(r,g,b);
    const picker = document.getElementById('colorPicker');
    picker.value = hex;
    updateColorInfo();
}

function addToRecentSwatches(hex) {
    const box = document.getElementById('recentSwatches');
    if (!box) return;
    // Avoid duplicates
    if ([...box.children].some(b => b.getAttribute('data-hex') === hex)) return;
    const btn = document.createElement('button');
    btn.className = 'swatch';
    btn.style.backgroundColor = hex;
    btn.setAttribute('data-hex', hex);
    btn.title = hex;
    btn.addEventListener('click', () => {
        const picker = document.getElementById('colorPicker');
        picker.value = hex;
        updateColorInfo();
    });
    box.prepend(btn);
    // limit count
    if (box.children.length > 12) box.removeChild(box.lastChild);
    // persist
    saveRecentSwatches([...box.children].map(el => el.getAttribute('data-hex')));
}

async function handleEyedropper() {
    try {
        if ('EyeDropper' in window) {
            const ed = new window.EyeDropper();
            const res = await ed.open();
            const hex = res.sRGBHex;
            const picker = document.getElementById('colorPicker');
            picker.value = hex;
            updateColorInfo();
        } else {
            showNotification('متصفحك لا يدعم قطّارة اللون', 'info');
        }
    } catch (e) {
        showNotification('تم إلغاء اختيار اللون', 'warning');
    }
}

// ===== Persistence for recent colors =====
function loadRecentSwatches() {
    try {
        const data = localStorage.getItem('recentColors');
        if (!data) return;
        const list = JSON.parse(data);
        const box = document.getElementById('recentSwatches');
        if (!box || !Array.isArray(list)) return;
        box.innerHTML = '';
        list.forEach(hex => {
            if (typeof hex === 'string' && isValidHex(hex)) {
                const normalized = hex.startsWith('#') ? hex : '#' + hex;
                const btn = document.createElement('button');
                btn.className = 'swatch';
                btn.style.backgroundColor = normalized;
                btn.setAttribute('data-hex', normalized);
                btn.title = normalized;
                btn.addEventListener('click', () => {
                    const picker = document.getElementById('colorPicker');
                    picker.value = normalized;
                    updateColorInfo();
                });
                box.appendChild(btn);
            }
        });
    } catch {}
}

function saveRecentSwatches(list) {
    try {
        localStorage.setItem('recentColors', JSON.stringify(list));
    } catch {}
}

// QR Generator functions
function generateQR() {
    const text = document.getElementById('qrText').value;
    const sizeEl = document.getElementById('qrSize');
    const marginEl = document.getElementById('qrMargin');
    const colorEl = document.getElementById('qrColor');
    const bgEl = document.getElementById('qrBg');
    
    if (!text) {
        alert('Please enter text or URL');
        return;
    }
    
    const size = sizeEl ? Math.max(120, Math.min(1000, parseInt(sizeEl.value)||300)) : 300;
    const margin = marginEl ? Math.max(0, Math.min(20, parseInt(marginEl.value)||2)) : 2;
    const color = colorEl ? colorEl.value.replace('#','') : '000000';
    const bg = bgEl ? bgEl.value.replace('#','') : 'ffffff';
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=${margin}&color=${color}&bgcolor=${bg}&data=${encodeURIComponent(text)}`;
    const resultDiv = document.getElementById('qrResult');
    const qrImage = document.getElementById('qrImage');
    const qrLink = document.getElementById('qrLink');
    if (qrImage) qrImage.src = qrUrl;
    if (qrLink) { qrLink.href = qrUrl; qrLink.textContent = qrUrl; }
    if (resultDiv) resultDiv.style.display = 'block';

    // Wire actions if present
    const copyBtn = document.getElementById('copyQrLinkBtn');
    const dlBtn = document.getElementById('downloadQrBtn');
    const resetBtn = document.getElementById('resetQrBtn');
    if (copyBtn) copyBtn.onclick = () => { navigator.clipboard.writeText(qrUrl); try { showNotification && showNotification('Link copied','success'); } catch(e) {} };
    if (dlBtn) dlBtn.onclick = () => {
        fetch(qrUrl).then(r => r.blob()).then(blob => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'FazzaPlay-QR.png';
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        });
    };
    if (resetBtn) resetBtn.onclick = () => {
        document.getElementById('qrText').value = '';
        document.getElementById('qrSize').value = '300';
        document.getElementById('qrMargin').value = '2';
        document.getElementById('qrColor').value = '#000000';
        document.getElementById('qrBg').value = '#ffffff';
        document.getElementById('qrResult').style.display = 'none';
        try { showNotification && showNotification('Reset complete','info'); } catch(e) {}
    };
}

// Base64 functions
function encodeBase64() {
    const input = document.getElementById('base64Input').value;
    if (!input.trim()) {
        try { showNotification && showNotification('Please enter text to encode', 'warning'); } catch(e) {}
        return;
    }
    
    try {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        const resultDiv = document.getElementById('base64Result');
        const outputText = document.getElementById('base64Output');
        if (outputText) outputText.value = encoded;
        if (resultDiv) resultDiv.style.display = 'block';
        try { showNotification && showNotification('Text encoded successfully', 'success'); } catch(e) {}
    } catch (error) {
        try { showNotification && showNotification('Encoding error: ' + error.message, 'error'); } catch(e) {}
    }
}

function decodeBase64() {
    const input = document.getElementById('base64Input').value.trim();
    if (!input) {
        try { showNotification && showNotification('Please enter Base64 string to decode', 'warning'); } catch(e) {}
        return;
    }
    
    try {
        const decoded = decodeURIComponent(escape(atob(input)));
        const resultDiv = document.getElementById('base64Result');
        const outputText = document.getElementById('base64Output');
        if (outputText) outputText.value = decoded;
        if (resultDiv) resultDiv.style.display = 'block';
        try { showNotification && showNotification('Base64 decoded successfully', 'success'); } catch(e) {}
    } catch (error) {
        try { showNotification && showNotification('Decoding error: Invalid Base64 string', 'error'); } catch(e) {}
    }
}

function copyBase64Result() {
    const outputText = document.getElementById('base64Output');
    if (!outputText || !outputText.value.trim()) {
        try { showNotification && showNotification('No result to copy', 'warning'); } catch(e) {}
        return;
    }
    
    navigator.clipboard.writeText(outputText.value).then(() => {
        try { showNotification && showNotification('Result copied to clipboard', 'success'); } catch(e) {}
    }).catch(() => {
        outputText.select();
        document.execCommand('copy');
        try { showNotification && showNotification('Result copied to clipboard', 'success'); } catch(e) {}
    });
}

function downloadBase64Result() {
    const outputText = document.getElementById('base64Output');
    if (!outputText || !outputText.value.trim()) {
        try { showNotification && showNotification('No result to download', 'warning'); } catch(e) {}
        return;
    }
    
    const blob = new Blob([outputText.value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FazzaPlay.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    try { showNotification && showNotification('Result downloaded', 'success'); } catch(e) {}
}

function resetBase64Converter() {
    const inputText = document.getElementById('base64Input');
    const outputText = document.getElementById('base64Output');
    const resultDiv = document.getElementById('base64Result');
    const charCount = document.getElementById('charCount');
    const byteCount = document.getElementById('byteCount');
    
    if (inputText) inputText.value = '';
    if (outputText) outputText.value = '';
    if (resultDiv) resultDiv.style.display = 'none';
    if (charCount) charCount.textContent = '0';
    if (byteCount) byteCount.textContent = '0';
    
    try { showNotification && showNotification('All fields cleared', 'info'); } catch(e) {}
}

function updateBase64Stats() {
    const input = document.getElementById('base64Input');
    const charCount = document.getElementById('charCount');
    const byteCount = document.getElementById('byteCount');
    
    if (input && charCount && byteCount) {
        const text = input.value;
        charCount.textContent = text.length;
        byteCount.textContent = new Blob([text]).size;
    }
}

// URL Shortener functions
function shortenUrl() {
    const longUrl = document.getElementById('longUrl').value.trim();
    
    if (!longUrl) {
        try { showNotification && showNotification('Please enter a URL to shorten', 'warning'); } catch(e) {}
        return;
    }
    
    // Validate URL format
    try {
        new URL(longUrl);
    } catch (e) {
        try { showNotification && showNotification('Please enter a valid URL (include http:// or https://)', 'error'); } catch(e) {}
        return;
    }
    
    // Generate short code using timestamp + random
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 4);
    const shortCode = timestamp + random;
    const shortUrl = `https://fazzaplay.com/s/${shortCode}`;
    
    const resultDiv = document.getElementById('urlResult');
    const originalLink = document.getElementById('originalLink');
    const shortLink = document.getElementById('shortLink');
    
    if (originalLink) { 
        originalLink.href = longUrl; 
        originalLink.textContent = longUrl.length > 60 ? longUrl.substring(0, 60) + '...' : longUrl;
    }
    if (shortLink) { 
        shortLink.href = shortUrl; 
        shortLink.textContent = shortUrl;
    }
    if (resultDiv) resultDiv.style.display = 'block';
    
    // Store for copy/download functions
    window.currentShortUrl = shortUrl;
    window.currentLongUrl = longUrl;
    
    try { showNotification && showNotification('URL shortened successfully!', 'success'); } catch(e) {}
}

function copyShortUrl() {
    if (!window.currentShortUrl) {
        try { showNotification && showNotification('No short URL to copy', 'warning'); } catch(e) {}
        return;
    }
    
    navigator.clipboard.writeText(window.currentShortUrl).then(() => {
        try { showNotification && showNotification('Short URL copied to clipboard', 'success'); } catch(e) {}
    }).catch(() => {
        const shortLink = document.getElementById('shortLink');
        if (shortLink) {
            shortLink.select();
            document.execCommand('copy');
            try { showNotification && showNotification('Short URL copied to clipboard', 'success'); } catch(e) {}
        }
    });
}

function downloadUrlResult() {
    if (!window.currentShortUrl || !window.currentLongUrl) {
        try { showNotification && showNotification('No URL data to download', 'warning'); } catch(e) {}
        return;
    }
    
    const content = `Original URL: ${window.currentLongUrl}\nShort URL: ${window.currentShortUrl}\nCreated: ${new Date().toISOString()}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FazzaPlay-urls.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    try { showNotification && showNotification('URL data downloaded', 'success'); } catch(e) {}
}

function resetUrlShortener() {
    const longUrlInput = document.getElementById('longUrl');
    const resultDiv = document.getElementById('urlResult');
    const charCount = document.getElementById('urlCharCount');
    const lengthCount = document.getElementById('urlLength');
    
    if (longUrlInput) longUrlInput.value = '';
    if (resultDiv) resultDiv.style.display = 'none';
    if (charCount) charCount.textContent = '0';
    if (lengthCount) lengthCount.textContent = '0';
    
    window.currentShortUrl = null;
    window.currentLongUrl = null;
    
    try { showNotification && showNotification('All fields cleared', 'info'); } catch(e) {}
}

function updateUrlStats() {
    const input = document.getElementById('longUrl');
    const charCount = document.getElementById('urlCharCount');
    const lengthCount = document.getElementById('urlLength');
    
    if (input && charCount && lengthCount) {
        const text = input.value;
        charCount.textContent = text.length;
        lengthCount.textContent = text.length;
    }
}

// Image Compressor functions
function compressImage() {
    const fileInput = document.getElementById('imageFile');
    
    if (!fileInput.files[0]) {
        showNotification('الرجاء اختيار صورة أولاً', 'warning');
        return;
    }
    
    const file = fileInput.files[0];
    const quality = parseInt(document.getElementById('quality').value) / 100;
    const maxWidth = parseInt(document.getElementById('maxWidth').value) || 800;
    const maxHeight = parseInt(document.getElementById('maxHeight').value) || 600;
    const format = document.getElementById('format').value;
    
    // إظهار رسالة التحميل
    showNotification('جاري ضغط الصورة...', 'info');
    
    // إنشاء Canvas لضغط الصورة
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
        // حساب الأبعاد الجديدة مع الحفاظ على النسبة
        let { width, height } = calculateDimensions(img.width, img.height, maxWidth, maxHeight);
        
        // تعيين أبعاد Canvas
        canvas.width = width;
        canvas.height = height;
        
        // رسم الصورة على Canvas مع الأبعاد الجديدة
        ctx.drawImage(img, 0, 0, width, height);
        
        // ضغط الصورة
        canvas.toBlob((blob) => {
            if (blob) {
        const originalSize = file.size;
                const compressedSize = blob.size;
        const compressionRatio = Math.round(((originalSize - compressedSize) / originalSize) * 100);
                
                // حفظ الصورة المضغوطة للتحميل
                window.compressedImageBlob = blob;
                window.compressedImageFormat = format;
        
        // عرض النتائج
                displayCompressionResults(file, originalSize, compressedSize, compressionRatio, width, height);
        
        showNotification(`تم ضغط الصورة بنجاح! نسبة الضغط: ${compressionRatio}%`, 'success');
            } else {
                showNotification('حدث خطأ أثناء ضغط الصورة', 'error');
            }
        }, `image/${format}`, quality);
    };
    
    img.src = URL.createObjectURL(file);
}

// دالة لحساب الأبعاد الجديدة مع الحفاظ على النسبة
function calculateDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
    let width = originalWidth;
    let height = originalHeight;
    
    // إذا كانت الصورة أكبر من الحد الأقصى
    if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
    }
    
    return { width, height };
}

function displayCompressionResults(file, originalSize, compressedSize, compressionRatio, newWidth, newHeight) {
    const resultDiv = document.getElementById('compressResult');
    const fileInfo = document.getElementById('fileInfo');
    
    // إخفاء معلومات الملف وإظهار النتائج
    fileInfo.style.display = 'none';
    resultDiv.style.display = 'block';
    
    // تحديث الصورة الأصلية
    const originalImage = document.getElementById('originalImage');
    const originalSizeSpan = document.getElementById('originalSize');
    const originalDimensionsSpan = document.getElementById('originalDimensions');
    
    originalImage.src = URL.createObjectURL(file);
    originalSizeSpan.textContent = formatFileSize(originalSize);
    
    // الحصول على الأبعاد الأصلية
    const img = new Image();
    img.onload = function() {
        originalDimensionsSpan.textContent = `${this.width} × ${this.height} بكسل`;
    };
    img.src = URL.createObjectURL(file);
    
    // تحديث الصورة المضغوطة
    const compressedImage = document.getElementById('compressedImage');
    const compressedSizeSpan = document.getElementById('compressedSize');
    const compressedDimensionsSpan = document.getElementById('compressedDimensions');
    const compressionRatioSpan = document.getElementById('compressionRatio');
    
    // عرض الصورة المضغوطة من Blob
    if (window.compressedImageBlob) {
        compressedImage.src = URL.createObjectURL(window.compressedImageBlob);
    }
    
    compressedSizeSpan.textContent = formatFileSize(compressedSize);
    compressedDimensionsSpan.textContent = `${newWidth} × ${newHeight} بكسل`;
    compressionRatioSpan.textContent = `${compressionRatio}%`;
    
    // إضافة تأثيرات بصرية
    resultDiv.style.animation = 'slideInUp 0.6s ease-out';
}

function resetCompressor() {
    const fileInput = document.getElementById('imageFile');
    const fileInfo = document.getElementById('fileInfo');
    const resultDiv = document.getElementById('compressResult');
    const qualitySlider = document.getElementById('quality');
    const maxWidthInput = document.getElementById('maxWidth');
    const maxHeightInput = document.getElementById('maxHeight');
    
    // إعادة تعيين جميع الحقول
    fileInput.value = '';
    qualitySlider.value = 80;
    maxWidthInput.value = '';
    maxHeightInput.value = '';
    document.getElementById('qualityValue').textContent = '80%';
    
    // إخفاء النتائج وإعادة إظهار معلومات الملف
    fileInfo.style.display = 'none';
    resultDiv.style.display = 'none';
    
    // تنظيف الذاكرة
    if (window.compressedImageBlob) {
        URL.revokeObjectURL(window.compressedImageBlob);
        window.compressedImageBlob = null;
        window.compressedImageFormat = null;
    }
    
    try { showNotification && showNotification('All settings reset', 'info'); } catch(e) {}
}

function downloadCompressedImage() {
    if (!window.compressedImageBlob) {
        showNotification('لا توجد صورة مضغوطة للتحميل', 'warning');
        return;
    }
    
    showNotification('جاري تحضير الملف للتحميل...', 'info');
    
    // إنشاء رابط التحميل مع الصورة المضغوطة الفعلية
        const link = document.createElement('a');
    link.href = URL.createObjectURL(window.compressedImageBlob);
    
    // تحديد اسم الملف مع الصيغة الصحيحة
    const format = window.compressedImageFormat || 'jpeg';
    const extension = format === 'jpeg' ? 'jpg' : format;
    link.download = `compressed-image.${extension}`;
    
    // إضافة الرابط للصفحة وتنفيذ التحميل
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
    // تنظيف الذاكرة
    URL.revokeObjectURL(link.href);
        
        showNotification('تم تحميل الصورة المضغوطة بنجاح!', 'success');
}

// دالة مساعدة لتنسيق حجم الملف
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// دالة إظهار الإشعارات
function showNotification(message, type = 'info') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // تحديد الأيقونة المناسبة
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    else if (type === 'warning') icon = 'exclamation-triangle';
    else if (type === 'error') icon = 'times-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    // إضافة الإشعار للصفحة
    document.body.appendChild(notification);
    
    // إظهار الإشعار
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // إخفاء الإشعار بعد 3 ثواني
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// إضافة مستمع الأحداث لملف الإدخال
function initializeImageCompressor() {
    const fileInput = document.getElementById('imageFile');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
        
        // تحسينات إضافية للموبايل
        if (isMobile) {
            // تحسين حجم الصورة للموبايل
            const maxWidthInput = document.getElementById('maxWidth');
            const maxHeightInput = document.getElementById('maxHeight');
            
            if (maxWidthInput && maxHeightInput) {
                maxWidthInput.value = '800';
                maxHeightInput.value = '600';
                
                // إضافة تلميحات للموبايل
                maxWidthInput.placeholder = '800 (مثالي للموبايل)';
                maxHeightInput.placeholder = '600 (مثالي للموبايل)';
            }
            
            // تحسين جودة الضغط للموبايل
            const qualitySlider = document.getElementById('quality');
            if (qualitySlider) {
                qualitySlider.value = '70';
                const qualityValue = document.getElementById('qualityValue');
                if (qualityValue) {
                    qualityValue.textContent = '70%';
                }
            }
            
            // إضافة رسالة للموبايل
            const mobileMessage = document.createElement('div');
            mobileMessage.innerHTML = '<small style="color: #667eea; text-align: center; display: block; margin: 10px 0;">💡 تم تحسين الإعدادات للموبايل</small>';
            mobileMessage.className = 'mobile-message';
            
            const compressionSettings = document.querySelector('.compression-settings');
            if (compressionSettings) {
                compressionSettings.insertBefore(mobileMessage, compressionSettings.firstChild);
            }
        }
        
        // إضافة مستمع لتغيير الجودة
        const qualitySlider = document.getElementById('quality');
        if (qualitySlider) {
            qualitySlider.addEventListener('input', function() {
                const qualityValue = document.getElementById('qualityValue');
                if (qualityValue) {
                    qualityValue.textContent = this.value + '%';
                }
            });
        }
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        displayFileInfo(file);
    }
}

function displayFileInfo(file) {
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const fileDimensions = document.getElementById('fileDimensions');
    const imagePreview = document.getElementById('imagePreview');
    
    // عرض معلومات الملف
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    // إنشاء معاينة للصورة
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            fileDimensions.textContent = `${this.width} × ${this.height} px`;
            imagePreview.src = e.target.result;
            fileInfo.style.display = 'block';
            
            // تحديث الحقول تلقائياً مع الحفاظ على النسبة
            const maxWidthInput = document.getElementById('maxWidth');
            const maxHeightInput = document.getElementById('maxHeight');
            
            if (maxWidthInput && maxHeightInput) {
                // حساب الأبعاد المثالية مع الحفاظ على النسبة
                const aspectRatio = this.width / this.height;
                let suggestedWidth = this.width;
                let suggestedHeight = this.height;
                
                // إذا كانت الصورة كبيرة جداً، تقليلها
                if (this.width > 1200 || this.height > 800) {
                    if (this.width > this.height) {
                        suggestedWidth = 1200;
                        suggestedHeight = Math.round(1200 / aspectRatio);
                    } else {
                        suggestedHeight = 800;
                        suggestedWidth = Math.round(800 * aspectRatio);
                    }
                }
                
                maxWidthInput.value = suggestedWidth;
                maxHeightInput.value = suggestedHeight;
            }
            
            // إضافة تأثير ظهور تدريجي
            fileInfo.style.animation = 'fadeInUp 0.6s ease-out';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// PDF Converter functions
function convertToPdf() {
    const conversionType = document.getElementById('conversionType').value;
    let content = '';
    let fileName = 'document';
    
    try {
        if (conversionType === 'text-to-pdf') {
            content = document.getElementById('textInput').value.trim();
            if (!content) {
                showNotification('الرجاء إدخال نص للتحويل', 'warning');
                return;
            }
            fileName = 'text-document';
        } else if (conversionType === 'html-to-pdf') {
            content = document.getElementById('textInput').value.trim();
            if (!content) {
                showNotification('الرجاء إدخال كود HTML للتحويل', 'warning');
                return;
            }
            fileName = 'html-document';
        } else if (conversionType === 'file-to-pdf') {
            const file = document.getElementById('pdfFile').files[0];
    if (!file) {
                showNotification('الرجاء اختيار ملف للتحويل', 'warning');
        return;
    }
    
            const reader = new FileReader();
            reader.onload = function(e) {
                content = e.target.result;
                fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove file extension
                processPdfConversion(content, fileName);
            };
            reader.readAsText(file);
            return;
        }
        
        processPdfConversion(content, fileName);
        
    } catch (error) {
        showNotification('حدث خطأ أثناء التحويل: ' + error.message, 'error');
    }
}

function processPdfConversion(content, fileName) {
    showNotification('جاري إنشاء ملف PDF...', 'info');
    
    try {
        // إنشاء PDF باستخدام jsPDF
        const { jsPDF } = window.jspdf;
        
        const pageSize = document.getElementById('pageSize').value;
        const orientation = document.getElementById('orientation').value;
        const fontSize = parseInt(document.getElementById('fontSize').value);
        
        const doc = new jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: pageSize
        });
        
        // إعداد الخط
        // ملاحظة: الخط الافتراضي قد لا يدعم تشكيل العربية بشكل كامل
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(fontSize);
        
        // إزالة العنوان لتفادي ظهور محارف غير مفهومة في أعلى الصفحة
        // يمكن إضافة عنوان لاحقاً بخط يدعم العربية إذا لزم
        
        // تقسيم النص إلى أسطر
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10;
        const maxWidth = pageWidth - margin * 2;
        const isRtl = (document.documentElement.getAttribute('dir') || '').toLowerCase() === 'rtl';
        const lines = doc.splitTextToSize(content, maxWidth);
        
        let yPosition = 20; // ابدأ مباشرة بعد الهامش العلوي
        // ارتفاع السطر بالملليمتر: الحجم بالنقطة × 0.3528 (تحويل mm) × 1.4 (تباعد)
        const lineHeight = (fontSize * 0.3528) * 1.4;
        
        for (let i = 0; i < lines.length; i++) {
            if (yPosition + lineHeight > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }
            const xPos = isRtl ? (pageWidth - margin) : margin;
            const opts = isRtl ? { align: 'right' } : undefined;
            doc.text(lines[i], xPos, yPosition, opts);
            yPosition += lineHeight;
        }
        
        // حفظ PDF في الذاكرة
        window.generatedPdf = doc.output('blob');
        // حفظ باسم الموقع فقط بغض النظر عن نوع الإدخال
        window.pdfFileName = 'FazzaPlay';
        
        // عرض النتيجة
    const resultDiv = document.getElementById('pdfResult');
        resultDiv.style.display = 'block';
        resultDiv.style.animation = 'slideInUp 0.6s ease-out';
        
        showNotification('تم إنشاء ملف PDF بنجاح!', 'success');
        
    } catch (error) {
        showNotification('حدث خطأ أثناء إنشاء PDF: ' + error.message, 'error');
        console.error('PDF creation error:', error);
    }
}

function downloadPdf() {
    if (!window.generatedPdf) {
        showNotification('لا يوجد ملف PDF للتحميل', 'warning');
        return;
    }
    
    try {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(window.generatedPdf);
        link.download = `${window.pdfFileName || 'document'}.pdf`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(link.href);
        
        showNotification('تم تحميل ملف PDF بنجاح!', 'success');
    } catch (error) {
        showNotification('حدث خطأ أثناء التحميل: ' + error.message, 'error');
    }
}

function resetPdfConverter() {
    document.getElementById('textInput').value = '';
    document.getElementById('pdfFile').value = '';
    document.getElementById('conversionType').value = 'text-to-pdf';
    document.getElementById('pageSize').value = 'a4';
    document.getElementById('orientation').value = 'portrait';
    document.getElementById('fontSize').value = '14';
    
    document.getElementById('pdfResult').style.display = 'none';
    
    // تنظيف الذاكرة
    if (window.generatedPdf) {
        URL.revokeObjectURL(window.generatedPdf);
        window.generatedPdf = null;
        window.pdfFileName = null;
    }
    
    try { showNotification && showNotification('All settings reset', 'info'); } catch(e) {}
}

function initializePdfConverter() {
    const conversionType = document.getElementById('conversionType');
    const textInputGroup = document.getElementById('textInputGroup');
    const fileInputGroup = document.getElementById('fileInputGroup');
    
    if (conversionType && textInputGroup && fileInputGroup) {
        // إظهار/إخفاء الحقول حسب نوع التحويل
        function updateInputFields() {
            const selectedType = conversionType.value;
            if (selectedType === 'file-to-pdf') {
                textInputGroup.style.display = 'none';
                fileInputGroup.style.display = 'block';
            } else {
                textInputGroup.style.display = 'block';
                fileInputGroup.style.display = 'none';
            }
        }
        
        // تطبيق التغييرات عند التحميل
        updateInputFields();
        
        // تطبيق التغييرات عند تغيير نوع التحويل
        conversionType.addEventListener('change', updateInputFields);
    }
}

// Utility functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('تم نسخ النص إلى الحافظة');
    });
}

// Initialize sliders and add smooth scrolling
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sliders
    const qualitySlider = document.getElementById('quality');
    if (qualitySlider) {
        qualitySlider.addEventListener('input', function() {
            document.getElementById('qualityValue').textContent = this.value + '%';
        });
    }
    
    const lengthSlider = document.getElementById('passwordLength');
    if (lengthSlider) {
        lengthSlider.addEventListener('input', function() {
            document.getElementById('lengthValue').textContent = this.value;
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation to tool cards
    document.querySelectorAll('.tool-card').forEach((card, index) => {
        // إضافة تأخير للرسوم المتحركة
        card.style.setProperty('--card-index', index);
        
        // تأثيرات عند التمرير
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.03) rotateY(5deg)';
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
            this.style.zIndex = '1';
        });
        
        // تأثير النقر
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95) rotateY(10deg)';
            setTimeout(() => {
                this.style.transform = 'scale(1) rotateY(0deg)';
            }, 200);
        });
        
        // إضافة تأثير التوهج
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `translateY(-15px) scale(1.03) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
    
    // Add copy functionality to all copy buttons
    document.addEventListener('click', function(e) {
        if (e.target.textContent.includes('نسخ')) {
            const textToCopy = e.target.getAttribute('onclick').match(/'([^']+)'/)[1];
            copyToClipboard(textToCopy);
        }
    });
    
    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // تحسينات إضافية للاستجابة
    // إخفاء القائمة عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
    
    // تحسين التمرير للموبايل
    if (isMobile) {
        // إضافة تأخير للتمرير السلس على الموبايل
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    setTimeout(() => {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 100);
                }
            });
        });
    }
    
    // تحسينات الموبايل (بدون مودال)
    
    // تحسين الأداء على الأجهزة الضعيفة
    if ('connection' in navigator && navigator.connection.effectiveType === 'slow-2g') {
        // إيقاف الرسوم المتحركة على الاتصالات البطيئة
        document.body.style.setProperty('--animation-duration', '0.1s');
        document.body.style.setProperty('--transition-duration', '0.1s');
    }
    
    // تحسين التمرير على الأجهزة اللوحية
    if (isTablet) {
        document.body.style.setProperty('--scroll-behavior', 'auto');
    }
});












// OCR Tool Functions
function performOCR() {
    const fileInput = document.getElementById('imageFile');
    const ocrBtn = document.getElementById('ocrBtn');
    const processingStatus = document.getElementById('processingStatus');
    const ocrResult = document.getElementById('ocrResult');
    const extractedText = document.getElementById('extractedText');
    const progressFill = document.getElementById('progressFill');
    const progressPercentage = document.getElementById('progressPercentage');
    const processingText = document.getElementById('processingText');
    
    if (!fileInput.files || fileInput.files.length === 0) {
        showNotification('الرجاء اختيار صورة أولاً', 'warning');
        return;
    }
    
    const file = fileInput.files[0];
    const language = document.getElementById('ocrLanguage').value;
    const psm = document.getElementById('pageSegmentationMode').value;
    
    // Show processing status
    if (processingStatus) processingStatus.style.display = 'block';
    if (ocrResult) ocrResult.style.display = 'none';
    if (ocrBtn) ocrBtn.disabled = true;
    
    // Reset progress
    if (progressFill) progressFill.style.width = '0%';
    if (progressPercentage) progressPercentage.textContent = '0%';
    if (processingText) processingText.textContent = 'جاري تهيئة محرك OCR...';
    
    // Create image element
    const img = new Image();
    img.onload = function() {
        // Start OCR processing
        if (processingText) processingText.textContent = 'جاري استخراج النص من الصورة...';
        
        Tesseract.recognize(img, language, {
            logger: m => {
                if (m.status === 'recognizing text') {
                    const progress = Math.round(m.progress * 100);
                    if (progressFill) progressFill.style.width = progress + '%';
                    if (progressPercentage) progressPercentage.textContent = progress + '%';
                }
            }
        }).then(({ data: { text } }) => {
            // Hide processing status
            if (processingStatus) processingStatus.style.display = 'none';
            if (ocrBtn) ocrBtn.disabled = false;
            
            // Show result
            if (ocrResult) {
                ocrResult.style.display = 'block';
                ocrResult.style.animation = 'slideInUp 0.6s ease-out';
            }
            
            if (extractedText) {
                extractedText.value = text.trim();
            }
            
            showNotification('تم استخراج النص بنجاح!', 'success');
        }).catch(error => {
            console.error('OCR Error:', error);
            if (processingStatus) processingStatus.style.display = 'none';
            if (ocrBtn) ocrBtn.disabled = false;
            showNotification('حدث خطأ أثناء استخراج النص: ' + error.message, 'error');
        });
    };
    
    img.onerror = function() {
        if (processingStatus) processingStatus.style.display = 'none';
        if (ocrBtn) ocrBtn.disabled = false;
        showNotification('خطأ في تحميل الصورة', 'error');
    };
    
    img.src = URL.createObjectURL(file);
}

function copyExtractedText() {
    const extractedText = document.getElementById('extractedText');
    if (!extractedText || !extractedText.value.trim()) {
        showNotification('لا يوجد نص للنسخ', 'warning');
        return;
    }
    
    navigator.clipboard.writeText(extractedText.value).then(() => {
        showNotification('تم نسخ النص إلى الحافظة!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        extractedText.select();
        document.execCommand('copy');
        showNotification('تم نسخ النص إلى الحافظة!', 'success');
    });
}

function downloadExtractedText() {
    const extractedText = document.getElementById('extractedText');
    if (!extractedText || !extractedText.value.trim()) {
        showNotification('لا يوجد نص للتحميل', 'warning');
        return;
    }
    
    const blob = new Blob([extractedText.value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'extracted-text-' + new Date().getTime() + '.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('تم تحميل النص بنجاح!', 'success');
}

function resetOCRTool() {
    // Reset file input
    const fileInput = document.getElementById('imageFile');
    if (fileInput) fileInput.value = '';
    
    // Hide image preview
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) imagePreview.style.display = 'none';
    
    // Hide result area
    const ocrResult = document.getElementById('ocrResult');
    if (ocrResult) ocrResult.style.display = 'none';
    
    // Hide processing status
    const processingStatus = document.getElementById('processingStatus');
    if (processingStatus) processingStatus.style.display = 'none';
    
    // Reset form values
    const ocrLanguage = document.getElementById('ocrLanguage');
    const pageSegmentationMode = document.getElementById('pageSegmentationMode');
    if (ocrLanguage) ocrLanguage.value = 'eng';
    if (pageSegmentationMode) pageSegmentationMode.value = '3';
    
    // Clear extracted text
    const extractedText = document.getElementById('extractedText');
    if (extractedText) extractedText.value = '';
    
    // Enable OCR button
    const ocrBtn = document.getElementById('ocrBtn');
    if (ocrBtn) ocrBtn.disabled = true;
    
    try { showNotification && showNotification('All settings reset', 'info'); } catch(e) {}
}

// Initialize OCR tool events
function initializeOCRTool() {
    const fileInput = document.getElementById('imageFile');
    const uploadArea = document.getElementById('uploadArea');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const fileName = document.getElementById('fileName');
    const fileDimensions = document.getElementById('fileDimensions');
    const ocrBtn = document.getElementById('ocrBtn');
    
    if (fileInput && uploadArea) {
        // File input change event
        fileInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                
                // Show image preview
                if (imagePreview) imagePreview.style.display = 'block';
                if (previewImg) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        previewImg.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
                
                // Show file info
                if (fileName) fileName.textContent = file.name;
                if (fileDimensions) {
                    const img = new Image();
                    img.onload = function() {
                        fileDimensions.textContent = this.width + ' × ' + this.height + ' بكسل';
                    };
                    img.src = URL.createObjectURL(file);
                }
                
                // Enable OCR button
                if (ocrBtn) ocrBtn.disabled = false;
                
                showNotification('تم رفع الصورة بنجاح!', 'success');
            }
        });
        
        // Drag and drop events
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#667eea';
            uploadArea.style.backgroundColor = '#f8f9ff';
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.backgroundColor = '#f9f9f9';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.backgroundColor = '#f9f9f9';
            
            const files = e.dataTransfer.files;
            if (files && files[0] && files[0].type.startsWith('image/')) {
                fileInput.files = files;
                fileInput.dispatchEvent(new Event('change'));
            } else {
                showNotification('الرجاء اختيار ملف صورة صالح', 'warning');
            }
        });
        
        // Click to upload
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
    }
}

// Logo Generator Functions
function initializeLogoGenerator() {
    try {
        // Get canvas and context
        const canvas = document.getElementById('logoCanvas');
        const ctx = canvas.getContext('2d');
        
        if (!canvas || !ctx) {
            console.error('Canvas not found');
            return;
        }
        
        // Initialize canvas size
        updateCanvasSize();
        
        // Add event listeners for all controls
        addLogoEventListeners();
        
        // Generate initial logo
        generateLogo();
        
        try { showNotification && showNotification('تم تهيئة مولد الشعارات', 'success'); } catch(e) {}
        
    } catch (error) {
        console.error('Logo generator initialization error:', error);
        try { showNotification && showNotification('حدث خطأ أثناء تهيئة الأداة', 'error'); } catch(e) {}
    }
}

function addLogoEventListeners() {
    // Text inputs
    const mainText = document.getElementById('mainText');
    const subText = document.getElementById('subText');
    if (mainText) mainText.addEventListener('input', generateLogo);
    if (subText) subText.addEventListener('input', generateLogo);
    
    // Text size sliders
    const mainTextSize = document.getElementById('mainTextSize');
    const subTextSize = document.getElementById('subTextSize');
    if (mainTextSize) {
        mainTextSize.addEventListener('input', function() {
            document.getElementById('mainTextSizeValue').textContent = this.value + 'px';
            generateLogo();
        });
    }
    if (subTextSize) {
        subTextSize.addEventListener('input', function() {
            document.getElementById('subTextSizeValue').textContent = this.value + 'px';
            generateLogo();
        });
    }
    
    // Color inputs
    const mainTextColor = document.getElementById('mainTextColor');
    const subTextColor = document.getElementById('subTextColor');
    if (mainTextColor) mainTextColor.addEventListener('input', generateLogo);
    if (subTextColor) subTextColor.addEventListener('input', generateLogo);
    
    // Background type
    const backgroundType = document.getElementById('backgroundType');
    if (backgroundType) {
        backgroundType.addEventListener('change', function() {
            updateBackgroundSettings();
            generateLogo();
        });
    }
    
    // Background colors
    const backgroundColor = document.getElementById('backgroundColor');
    const gradientColor1 = document.getElementById('gradientColor1');
    const gradientColor2 = document.getElementById('gradientColor2');
    const gradientDirection = document.getElementById('gradientDirection');
    if (backgroundColor) backgroundColor.addEventListener('input', generateLogo);
    if (gradientColor1) gradientColor1.addEventListener('input', generateLogo);
    if (gradientColor2) gradientColor2.addEventListener('input', generateLogo);
    if (gradientDirection) gradientDirection.addEventListener('input', generateLogo);
    
    // Pattern type
    const patternType = document.getElementById('patternType');
    if (patternType) patternType.addEventListener('input', generateLogo);
    
    // Shape settings
    const shapeType = document.getElementById('shapeType');
    const shapeColor = document.getElementById('shapeColor');
    const shapeSize = document.getElementById('shapeSize');
    if (shapeType) {
        shapeType.addEventListener('change', function() {
            updateShapeSettings();
            generateLogo();
        });
    }
    if (shapeColor) shapeColor.addEventListener('input', generateLogo);
    if (shapeSize) {
        shapeSize.addEventListener('input', function() {
            document.getElementById('shapeSizeValue').textContent = this.value + 'px';
            generateLogo();
        });
    }
    
    // Canvas size
    const canvasWidth = document.getElementById('canvasWidth');
    const canvasHeight = document.getElementById('canvasHeight');
    if (canvasWidth) {
        canvasWidth.addEventListener('input', function() {
            document.getElementById('canvasWidthValue').textContent = this.value + 'px';
            updateCanvasSize();
            generateLogo();
        });
    }
    if (canvasHeight) {
        canvasHeight.addEventListener('input', function() {
            document.getElementById('canvasHeightValue').textContent = this.value + 'px';
            updateCanvasSize();
            generateLogo();
        });
    }
}

function updateBackgroundSettings() {
    const backgroundType = document.getElementById('backgroundType').value;
    const solidColorGroup = document.getElementById('solidColorGroup');
    const gradientGroup = document.getElementById('gradientGroup');
    const patternGroup = document.getElementById('patternGroup');
    
    // Hide all groups
    if (solidColorGroup) solidColorGroup.style.display = 'none';
    if (gradientGroup) gradientGroup.style.display = 'none';
    if (patternGroup) patternGroup.style.display = 'none';
    
    // Show relevant group
    switch(backgroundType) {
        case 'solid':
            if (solidColorGroup) solidColorGroup.style.display = 'block';
            break;
        case 'gradient':
            if (gradientGroup) gradientGroup.style.display = 'block';
            break;
        case 'pattern':
            if (patternGroup) patternGroup.style.display = 'block';
            break;
    }
}

function updateShapeSettings() {
    const shapeType = document.getElementById('shapeType').value;
    const shapeColorGroup = document.getElementById('shapeColorGroup');
    const shapeSizeGroup = document.getElementById('shapeSizeGroup');
    
    if (shapeType === 'none') {
        if (shapeColorGroup) shapeColorGroup.style.display = 'none';
        if (shapeSizeGroup) shapeSizeGroup.style.display = 'none';
    } else {
        if (shapeColorGroup) shapeColorGroup.style.display = 'block';
        if (shapeSizeGroup) shapeSizeGroup.style.display = 'block';
    }
}

function updateCanvasSize() {
    const canvas = document.getElementById('logoCanvas');
    const width = parseInt(document.getElementById('canvasWidth').value);
    const height = parseInt(document.getElementById('canvasHeight').value);
    
    if (canvas) {
        canvas.width = width;
        canvas.height = height;
    }
}

function generateLogo() {
    try {
        const canvas = document.getElementById('logoCanvas');
        const ctx = canvas.getContext('2d');
        
        if (!canvas || !ctx) return;
        
        // Enable high DPI rendering for crisp logos
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        // Set actual size in memory (scaled to account for extra pixel density)
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        // Scale the drawing context so everything will work at the higher ratio
        ctx.scale(dpr, dpr);
        
        // Set canvas size to display size
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        
        // Clear canvas with high quality
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Enable anti-aliasing and high quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.textRenderingOptimization = 'optimizeQuality';
        
        // Create logo composition
        const logoComposition = createLogoComposition(rect.width, rect.height);
        
        // Render background with advanced techniques
        renderAdvancedBackground(ctx, rect.width, rect.height, logoComposition.background);
        
        // Render shape with professional effects
        if (logoComposition.shape.type !== 'none') {
            renderAdvancedShape(ctx, rect.width, rect.height, logoComposition.shape);
        }
        
        // Render text with advanced typography
        renderAdvancedText(ctx, rect.width, rect.height, logoComposition.text);
        
        // Apply final effects and filters
        applyFinalEffects(ctx, rect.width, rect.height, logoComposition);
        
        // Show result area and buttons
        const resultArea = document.getElementById('resultArea');
        const downloadBtn = document.getElementById('downloadBtn');
        const copyBtn = document.getElementById('copyBtn');
        
        if (resultArea) resultArea.style.display = 'block';
        if (downloadBtn) downloadBtn.style.display = 'inline-block';
        if (copyBtn) copyBtn.style.display = 'inline-block';
        
        // Store canvas for download/copy
        window.logoCanvas = canvas;
        
    } catch (error) {
        console.error('Logo generation error:', error);
        try { showNotification && showNotification('حدث خطأ أثناء إنشاء الشعار', 'error'); } catch(e) {}
    }
}

// Advanced Logo Composition System
function createLogoComposition(width, height) {
    const backgroundType = document.getElementById('backgroundType').value;
    const shapeType = document.getElementById('shapeType').value;
    const mainText = document.getElementById('mainText').value;
    const subText = document.getElementById('subText').value;
    
    return {
        background: createBackgroundConfig(backgroundType, width, height),
        shape: createShapeConfig(shapeType, width, height),
        text: createTextConfig(mainText, subText, width, height),
        effects: createEffectsConfig(),
        dimensions: { width, height }
    };
}

function createBackgroundConfig(type, width, height) {
    const config = { type, width, height };
    
    switch(type) {
        case 'solid':
            config.color = document.getElementById('backgroundColor').value;
            break;
        case 'gradient':
            config.color1 = document.getElementById('gradientColor1').value;
            config.color2 = document.getElementById('gradientColor2').value;
            config.direction = document.getElementById('gradientDirection').value;
            config.stops = createAdvancedGradientStops(config.color1, config.color2);
            break;
        case 'pattern':
            config.patternType = document.getElementById('patternType').value;
            config.patternConfig = createPatternConfig(config.patternType, width, height);
            break;
    }
    
    return config;
}

function createShapeConfig(type, width, height) {
    if (type === 'none') return { type: 'none' };
    
    const size = parseInt(document.getElementById('shapeSize').value);
    const color = document.getElementById('shapeColor').value;
    
    return {
        type,
        size: size * 1.2, // Make shapes slightly larger
        color,
        centerX: width / 2,
        centerY: height / 2 - 10, // Move shapes up slightly
        effects: createAdvancedShapeEffects(type, color),
        style: getShapeStyle(type)
    };
}

function createTextConfig(mainText, subText, width, height) {
    const mainSize = parseInt(document.getElementById('mainTextSize').value);
    const subSize = parseInt(document.getElementById('subTextSize').value);
    const mainColor = document.getElementById('mainTextColor').value;
    const subColor = document.getElementById('subTextColor').value;
    
    return {
        main: {
            text: mainText,
            size: mainSize * 1.1, // Slightly larger main text
            color: mainColor,
            font: 'Poppins, Arial, sans-serif', // Better font
            weight: '700', // Bolder weight
            effects: createAdvancedTextEffects(mainColor, mainSize),
            style: getTextStyle('main')
        },
        sub: {
            text: subText,
            size: subSize,
            color: subColor,
            font: 'Poppins, Arial, sans-serif', // Better font
            weight: '400',
            effects: createAdvancedTextEffects(subColor, subSize),
            style: getTextStyle('sub')
        },
        layout: calculateAdvancedTextLayout(mainText, subText, mainSize, subSize, width, height)
    };
}

function createEffectsConfig() {
    return {
        shadow: {
            enabled: true,
            blur: 2,
            offsetX: 1,
            offsetY: 1,
            color: 'rgba(0, 0, 0, 0.1)'
        },
        glow: {
            enabled: false,
            blur: 5,
            color: 'rgba(102, 126, 234, 0.3)'
        },
        border: {
            enabled: false,
            width: 1,
            color: 'rgba(255, 255, 255, 0.8)'
        }
    };
}

// Advanced Background Rendering
function renderAdvancedBackground(ctx, width, height, background) {
    ctx.save();
    
    switch(background.type) {
        case 'solid':
            renderSolidBackground(ctx, width, height, background);
            break;
        case 'gradient':
            renderAdvancedGradient(ctx, width, height, background);
            break;
        case 'pattern':
            renderAdvancedPattern(ctx, width, height, background);
            break;
    }
    
    ctx.restore();
}

function renderSolidBackground(ctx, width, height, background) {
    ctx.fillStyle = background.color;
    ctx.fillRect(0, 0, width, height);
}

function renderAdvancedGradient(ctx, width, height, background) {
    const gradient = createAdvancedGradient(ctx, width, height, background);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

function createAdvancedGradient(ctx, width, height, background) {
    let gradient;
    
    switch(background.direction) {
        case 'to right':
            gradient = ctx.createLinearGradient(0, 0, width, 0);
            break;
        case 'to bottom':
            gradient = ctx.createLinearGradient(0, 0, 0, height);
            break;
        case 'diagonal':
            gradient = ctx.createLinearGradient(0, 0, width, height);
            break;
        case 'radial':
            gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
            break;
        default:
            gradient = ctx.createLinearGradient(0, 0, width, height);
    }
    
    // Add multiple color stops for smoother gradients
    background.stops.forEach(stop => {
        gradient.addColorStop(stop.position, stop.color);
    });
    
    return gradient;
}

function createAdvancedGradientStops(color1, color2) {
    return [
        { position: 0, color: color1 },
        { position: 0.3, color: lightenColor(color1, 0.1) },
        { position: 0.7, color: darkenColor(color2, 0.1) },
        { position: 1, color: color2 }
    ];
}

function renderAdvancedPattern(ctx, width, height, background) {
    // Create pattern canvas for better quality
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    patternCanvas.width = 100;
    patternCanvas.height = 100;
    
    // Render pattern on canvas
    renderPatternOnCanvas(patternCtx, 100, 100, background.patternConfig);
    
    // Create pattern from canvas
    const pattern = ctx.createPattern(patternCanvas, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, width, height);
}

function createPatternConfig(type, width, height) {
    const baseConfig = {
        type,
        size: Math.min(width, height) / 20,
        color1: '#f8f9fa',
        color2: '#e9ecef',
        opacity: 0.6
    };
    
    switch(type) {
        case 'dots':
            return { ...baseConfig, dotSize: 3, spacing: 20 };
        case 'lines':
            return { ...baseConfig, lineWidth: 1, spacing: 15 };
        case 'grid':
            return { ...baseConfig, lineWidth: 1, spacing: 20 };
        case 'waves':
            return { ...baseConfig, amplitude: 5, frequency: 0.1, lineWidth: 2 };
        default:
            return baseConfig;
    }
}

function renderPatternOnCanvas(ctx, width, height, config) {
    ctx.fillStyle = config.color1;
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = config.color2;
    ctx.lineWidth = config.lineWidth || 1;
    ctx.globalAlpha = config.opacity;
    
    switch(config.type) {
        case 'dots':
            renderDotsPattern(ctx, width, height, config);
            break;
        case 'lines':
            renderLinesPattern(ctx, width, height, config);
            break;
        case 'grid':
            renderGridPattern(ctx, width, height, config);
            break;
        case 'waves':
            renderWavesPattern(ctx, width, height, config);
            break;
    }
    
    ctx.globalAlpha = 1;
}

function renderDotsPattern(ctx, width, height, config) {
    ctx.fillStyle = config.color2;
    for (let x = config.spacing; x < width; x += config.spacing) {
        for (let y = config.spacing; y < height; y += config.spacing) {
            ctx.beginPath();
            ctx.arc(x, y, config.dotSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function renderLinesPattern(ctx, width, height, config) {
    for (let x = 0; x < width; x += config.spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
}

function renderGridPattern(ctx, width, height, config) {
    // Vertical lines
    for (let x = 0; x < width; x += config.spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    // Horizontal lines
    for (let y = 0; y < height; y += config.spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

function renderWavesPattern(ctx, width, height, config) {
    for (let y = config.spacing; y < height; y += config.spacing * 2) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < width; x += 2) {
            const waveY = y + Math.sin(x * config.frequency) * config.amplitude;
            ctx.lineTo(x, waveY);
        }
        ctx.stroke();
    }
}

// Advanced Shape Rendering
function renderAdvancedShape(ctx, width, height, shape) {
    ctx.save();
    
    // Apply shape effects
    applyShapeEffects(ctx, shape);
    
    // Render shape based on type
    switch(shape.type) {
        case 'circle':
            renderAdvancedCircle(ctx, shape);
            break;
        case 'rectangle':
            renderAdvancedRectangle(ctx, shape);
            break;
        case 'triangle':
            renderAdvancedTriangle(ctx, shape);
            break;
        case 'star':
            renderAdvancedStar(ctx, shape);
            break;
    }
    
    ctx.restore();
}

function applyShapeEffects(ctx, shape) {
    // Apply glow effect first
    if (shape.effects.glow && shape.effects.glow.enabled) {
        ctx.shadowColor = shape.effects.glow.color;
        ctx.shadowBlur = shape.effects.glow.blur;
        ctx.globalAlpha = shape.effects.glow.intensity;
        drawShapeForGlow(ctx, shape);
        ctx.globalAlpha = 1;
    }
    
    // Apply shadow
    if (shape.effects.shadow) {
        ctx.shadowColor = shape.effects.shadow.color;
        ctx.shadowBlur = shape.effects.shadow.blur;
        ctx.shadowOffsetX = shape.effects.shadow.offsetX;
        ctx.shadowOffsetY = shape.effects.shadow.offsetY;
    }
    
    // Apply gradient if enabled
    if (shape.effects.gradient && shape.effects.gradient.enabled) {
        const gradient = ctx.createRadialGradient(
            shape.centerX, shape.centerY, 0,
            shape.centerX, shape.centerY, shape.size / 2
        );
        gradient.addColorStop(0, shape.effects.gradient.startColor);
        gradient.addColorStop(1, shape.effects.gradient.endColor);
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = shape.color;
    }
    
    // Apply border
    if (shape.effects.border && shape.effects.border.enabled) {
        ctx.strokeStyle = shape.effects.border.color;
        ctx.lineWidth = shape.effects.border.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }
}

function drawShapeForGlow(ctx, shape) {
    ctx.fillStyle = shape.color;
    ctx.beginPath();
    
    switch (shape.type) {
        case 'circle':
            ctx.arc(shape.centerX, shape.centerY, shape.size / 2, 0, Math.PI * 2);
            break;
        case 'rectangle':
            const rectSize = shape.size * 0.8;
            ctx.roundRect(shape.centerX - rectSize / 2, shape.centerY - rectSize / 2, rectSize, rectSize, 12);
            break;
        case 'triangle':
            const triSize = shape.size * 0.8;
            ctx.moveTo(shape.centerX, shape.centerY - triSize / 2);
            ctx.lineTo(shape.centerX - triSize / 2, shape.centerY + triSize / 2);
            ctx.lineTo(shape.centerX + triSize / 2, shape.centerY + triSize / 2);
            ctx.closePath();
            break;
        case 'star':
            drawStar(ctx, shape.centerX, shape.centerY, shape.size / 2);
            break;
    }
    
    ctx.fill();
}

function renderAdvancedCircle(ctx, shape) {
    ctx.beginPath();
    ctx.arc(shape.centerX, shape.centerY, shape.size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Add border if needed
    if (shape.effects.border && shape.effects.border.enabled) {
        ctx.stroke();
    }
}

function renderAdvancedRectangle(ctx, shape) {
    const rectSize = shape.size * 0.8;
    const x = shape.centerX - rectSize / 2;
    const y = shape.centerY - rectSize / 2;
    
    ctx.beginPath();
    ctx.roundRect(x, y, rectSize, rectSize, 12);
    ctx.fill();
    
    // Add border if needed
    if (shape.effects.border && shape.effects.border.enabled) {
        ctx.stroke();
    }
}

function renderAdvancedTriangle(ctx, shape) {
    const triSize = shape.size * 0.8;
    
    ctx.beginPath();
    ctx.moveTo(shape.centerX, shape.centerY - triSize / 2);
    ctx.lineTo(shape.centerX - triSize / 2, shape.centerY + triSize / 2);
    ctx.lineTo(shape.centerX + triSize / 2, shape.centerY + triSize / 2);
    ctx.closePath();
    ctx.fill();
    
    if (shape.effects.border && shape.effects.border.enabled) {
        ctx.stroke();
    }
}

function renderAdvancedStar(ctx, shape) {
    const radius = shape.size / 2;
    const spikes = 5;
    const outerRadius = radius;
    const innerRadius = radius * 0.4;
    
    ctx.beginPath();
    
    for (let i = 0; i < spikes * 2; i++) {
        const angle = (i * Math.PI) / spikes;
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const x = shape.centerX + Math.cos(angle) * r;
        const y = shape.centerY + Math.sin(angle) * r;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.closePath();
    ctx.fill();
    
    if (shape.effects.border && shape.effects.border.enabled) {
        ctx.stroke();
    }
}

function drawStar(ctx, centerX, centerY, radius) {
    const spikes = 5;
    const outerRadius = radius;
    const innerRadius = radius * 0.4;
    
    ctx.beginPath();
    
    for (let i = 0; i < spikes * 2; i++) {
        const angle = (i * Math.PI) / spikes;
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.closePath();
    ctx.fill();
}

// Advanced Text Rendering
function renderAdvancedText(ctx, width, height, text) {
    ctx.save();
    
    // Set text properties
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Render main text
    if (text.main.text) {
        renderAdvancedTextElement(ctx, text.main, text.layout.main);
    }
    
    // Render sub text
    if (text.sub.text) {
        renderAdvancedTextElement(ctx, text.sub, text.layout.sub);
    }
    
    ctx.restore();
}

function renderAdvancedTextElement(ctx, textConfig, layout) {
    ctx.save();
    
    // Apply text effects
    applyTextEffects(ctx, textConfig);
    
    // Set font
    ctx.font = `${textConfig.weight} ${textConfig.size}px ${textConfig.font}`;
    ctx.fillStyle = textConfig.color;
    
    // Render text
    ctx.fillText(textConfig.text, layout.x, layout.y);
    
    // Render text stroke if needed
    if (textConfig.effects.stroke) {
        ctx.strokeStyle = textConfig.effects.stroke.color;
        ctx.lineWidth = textConfig.effects.stroke.width;
        ctx.strokeText(textConfig.text, layout.x, layout.y);
    }
    
    ctx.restore();
}

function applyTextEffects(ctx, textConfig) {
    // Apply glow effect first
    if (textConfig.effects.glow && textConfig.effects.glow.enabled) {
        ctx.shadowColor = textConfig.effects.glow.color;
        ctx.shadowBlur = textConfig.effects.glow.blur;
        ctx.globalAlpha = textConfig.effects.glow.intensity;
        drawTextForGlow(ctx, textConfig);
        ctx.globalAlpha = 1;
    }
    
    // Apply shadow
    if (textConfig.effects.shadow) {
        ctx.shadowColor = textConfig.effects.shadow.color;
        ctx.shadowBlur = textConfig.effects.shadow.blur;
        ctx.shadowOffsetX = textConfig.effects.shadow.offsetX;
        ctx.shadowOffsetY = textConfig.effects.shadow.offsetY;
    }
    
    // Apply gradient if enabled
    if (textConfig.effects.gradient && textConfig.effects.gradient.enabled) {
        const gradient = ctx.createLinearGradient(0, 0, 0, textConfig.size);
        gradient.addColorStop(0, textConfig.effects.gradient.startColor);
        gradient.addColorStop(1, textConfig.effects.gradient.endColor);
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = textConfig.color;
    }
    
    // Set text alignment
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
}

function drawTextForGlow(ctx, textConfig) {
    ctx.font = `${textConfig.weight} ${textConfig.size}px ${textConfig.font}`;
    ctx.fillStyle = textConfig.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(textConfig.text, 0, 0);
}

function calculateTextLayout(mainText, subText, mainSize, subSize, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    
    let mainY = centerY;
    let subY = centerY;
    
    if (mainText && subText) {
        const spacing = Math.max(mainSize, subSize) * 0.3;
        mainY = centerY - spacing / 2;
        subY = centerY + spacing / 2;
    }
    
    return {
        main: { x: centerX, y: mainY },
        sub: { x: centerX, y: subY }
    };
}

// Advanced Shape Effects
function createAdvancedShapeEffects(type, color) {
    const baseEffects = {
        shadow: {
            color: 'rgba(0, 0, 0, 0.15)',
            blur: 4,
            offsetX: 2,
            offsetY: 2
        },
        glow: {
            enabled: true,
            color: lightenColor(color, 0.2),
            blur: 8,
            intensity: 0.3
        },
        border: {
            enabled: true,
            color: lightenColor(color, 0.4),
            width: 2,
            style: 'solid'
        },
        gradient: {
            enabled: true,
            startColor: lightenColor(color, 0.2),
            endColor: darkenColor(color, 0.1)
        }
    };
    
    // Customize effects based on shape type
    switch(type) {
        case 'circle':
            baseEffects.shadow.blur = 6;
            baseEffects.glow.intensity = 0.4;
            break;
        case 'star':
            baseEffects.shadow.blur = 8;
            baseEffects.glow.intensity = 0.5;
            break;
        case 'triangle':
            baseEffects.shadow.offsetY = 3;
            baseEffects.glow.intensity = 0.3;
            break;
        case 'rectangle':
            baseEffects.border.width = 3;
            baseEffects.gradient.enabled = true;
            break;
    }
    
    return baseEffects;
}

function getShapeStyle(type) {
    const styles = {
        circle: {
            borderRadius: '50%',
            transform: 'rotate(0deg)',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
        },
        rectangle: {
            borderRadius: '12px',
            transform: 'rotate(0deg)',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
        },
        triangle: {
            borderRadius: '0',
            transform: 'rotate(0deg)',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
        },
        star: {
            borderRadius: '0',
            transform: 'rotate(0deg)',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'
        }
    };
    
    return styles[type] || styles.circle;
}

function getTextStyle(type) {
    const styles = {
        main: {
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        },
        sub: {
            letterSpacing: '1px',
            textTransform: 'uppercase',
            opacity: 0.8,
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
        }
    };
    
    return styles[type] || styles.main;
}

function createAdvancedTextEffects(color, size) {
    return {
        shadow: {
            color: 'rgba(0, 0, 0, 0.2)',
            blur: 3,
            offsetX: 1,
            offsetY: 2
        },
        glow: {
            enabled: true,
            color: lightenColor(color, 0.3),
            blur: 6,
            intensity: 0.4
        },
        stroke: {
            enabled: size > 30, // Only for large text
            color: 'rgba(255, 255, 255, 0.8)',
            width: 1
        },
        gradient: {
            enabled: true,
            startColor: lightenColor(color, 0.1),
            endColor: darkenColor(color, 0.1)
        }
    };
}

function calculateAdvancedTextLayout(mainText, subText, mainSize, subSize, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    
    let mainY = centerY;
    let subY = centerY;
    
    if (mainText && subText) {
        const spacing = Math.max(mainSize, subSize) * 0.4; // Better spacing
        mainY = centerY - spacing / 2 + 5; // Move main text up slightly
        subY = centerY + spacing / 2 + 5; // Move sub text down slightly
    } else if (mainText) {
        mainY = centerY + 5; // Center main text with slight offset
    } else if (subText) {
        subY = centerY + 5; // Center sub text with slight offset
    }
    
    return {
        main: { x: centerX, y: mainY },
        sub: { x: centerX, y: subY }
    };
}

// Utility Functions
function createShapeEffects(type, color) {
    return {
        shadow: {
            color: 'rgba(0, 0, 0, 0.2)',
            blur: 3,
            offsetX: 1,
            offsetY: 1
        },
        border: {
            enabled: false,
            color: lightenColor(color, 0.3),
            width: 1
        }
    };
}

function createTextEffects(color, size) {
    return {
        shadow: {
            color: 'rgba(0, 0, 0, 0.3)',
            blur: 2,
            offsetX: 1,
            offsetY: 1
        },
        stroke: {
            enabled: false,
            color: 'rgba(255, 255, 255, 0.8)',
            width: 1
        }
    };
}

function applyFinalEffects(ctx, width, height, composition) {
    // Apply global effects if needed
    if (composition.effects.glow.enabled) {
        ctx.shadowColor = composition.effects.glow.color;
        ctx.shadowBlur = composition.effects.glow.blur;
    }
}

// Color manipulation utilities
function lightenColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount * 255);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount * 255);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount * 255);
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

function darkenColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount * 255);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount * 255);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount * 255);
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

// Legacy function for backward compatibility
function drawBackground(ctx, width, height) {
    const backgroundType = document.getElementById('backgroundType').value;
    
    switch(backgroundType) {
        case 'solid':
            const backgroundColor = document.getElementById('backgroundColor').value;
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, width, height);
            break;
            
        case 'gradient':
            const color1 = document.getElementById('gradientColor1').value;
            const color2 = document.getElementById('gradientColor2').value;
            const direction = document.getElementById('gradientDirection').value;
            
            let gradient;
            if (direction === 'to right') {
                gradient = ctx.createLinearGradient(0, 0, width, 0);
            } else if (direction === 'to bottom') {
                gradient = ctx.createLinearGradient(0, 0, 0, height);
            } else { // diagonal
                gradient = ctx.createLinearGradient(0, 0, width, height);
            }
            
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            break;
            
        case 'pattern':
            drawPattern(ctx, width, height);
            break;
    }
}

function drawPattern(ctx, width, height) {
    const patternType = document.getElementById('patternType').value;
    
    // Set background color
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 1;
    
    switch(patternType) {
        case 'dots':
            ctx.fillStyle = '#dee2e6';
            for (let x = 20; x < width; x += 40) {
                for (let y = 20; y < height; y += 40) {
                    ctx.beginPath();
                    ctx.arc(x, y, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            break;
            
        case 'lines':
            for (let x = 0; x < width; x += 20) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            break;
            
        case 'grid':
            for (let x = 0; x < width; x += 20) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += 20) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
            break;
            
        case 'waves':
            ctx.strokeStyle = '#dee2e6';
            ctx.lineWidth = 2;
            for (let y = 20; y < height; y += 30) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                for (let x = 0; x < width; x += 5) {
                    const waveY = y + Math.sin(x * 0.1) * 5;
                    ctx.lineTo(x, waveY);
                }
                ctx.stroke();
            }
            break;
    }
}

function drawShape(ctx, width, height) {
    const shapeType = document.getElementById('shapeType').value;
    const shapeColor = document.getElementById('shapeColor').value;
    const shapeSize = parseInt(document.getElementById('shapeSize').value);
    
    ctx.fillStyle = shapeColor;
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    switch(shapeType) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(centerX, centerY, shapeSize / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
            
        case 'rectangle':
            ctx.fillRect(centerX - shapeSize / 2, centerY - shapeSize / 2, shapeSize, shapeSize);
            break;
            
        case 'triangle':
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - shapeSize / 2);
            ctx.lineTo(centerX - shapeSize / 2, centerY + shapeSize / 2);
            ctx.lineTo(centerX + shapeSize / 2, centerY + shapeSize / 2);
            ctx.closePath();
            ctx.fill();
            break;
            
        case 'star':
            drawStar(ctx, centerX, centerY, shapeSize / 2);
            break;
    }
}

function drawStar(ctx, x, y, radius) {
    const spikes = 5;
    const outerRadius = radius;
    const innerRadius = radius * 0.4;
    
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
        const angle = (i * Math.PI) / spikes;
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        
        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.closePath();
    ctx.fill();
}

function drawText(ctx, width, height) {
    const mainText = document.getElementById('mainText').value;
    const subText = document.getElementById('subText').value;
    const mainTextSize = parseInt(document.getElementById('mainTextSize').value);
    const subTextSize = parseInt(document.getElementById('subTextSize').value);
    const mainTextColor = document.getElementById('mainTextColor').value;
    const subTextColor = document.getElementById('subTextColor').value;
    
    // Set text properties
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw main text
    if (mainText) {
        ctx.font = `bold ${mainTextSize}px Arial, sans-serif`;
        ctx.fillStyle = mainTextColor;
        ctx.fillText(mainText, width / 2, height / 2 - (subText ? subTextSize / 2 : 0));
    }
    
    // Draw sub text
    if (subText) {
        ctx.font = `${subTextSize}px Arial, sans-serif`;
        ctx.fillStyle = subTextColor;
        ctx.fillText(subText, width / 2, height / 2 + (mainText ? mainTextSize / 2 : 0));
    }
}

function downloadLogo() {
    if (!window.logoCanvas) {
        try { showNotification && showNotification('لا يوجد شعار للتحميل', 'warning'); } catch(e) {}
        return;
    }
    
    try {
        const link = document.createElement('a');
        link.download = 'logo-' + Date.now() + '.png';
        link.href = window.logoCanvas.toDataURL('image/png');
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        try { showNotification && showNotification('تم تحميل الشعار بنجاح!', 'success'); } catch(e) {}
        
    } catch (error) {
        console.error('Download error:', error);
        try { showNotification && showNotification('حدث خطأ أثناء التحميل', 'error'); } catch(e) {}
    }
}

function copyLogo() {
    if (!window.logoCanvas) {
        try { showNotification && showNotification('لا يوجد شعار للنسخ', 'warning'); } catch(e) {}
        return;
    }
    
    try {
        window.logoCanvas.toBlob((blob) => {
            navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': blob
                })
            ]).then(() => {
                try { showNotification && showNotification('تم نسخ الشعار إلى الحافظة!', 'success'); } catch(e) {}
            }).catch(() => {
                try { showNotification && showNotification('فشل في نسخ الشعار', 'warning'); } catch(e) {}
            });
        });
        
    } catch (error) {
        console.error('Copy error:', error);
        try { showNotification && showNotification('حدث خطأ أثناء النسخ', 'error'); } catch(e) {}
    }
}

function resetLogoGenerator() {
    try {
        // Reset text inputs
        const mainText = document.getElementById('mainText');
        const subText = document.getElementById('subText');
        if (mainText) mainText.value = 'شعارك';
        if (subText) subText.value = 'وصف قصير';
        
        // Reset text sizes
        const mainTextSize = document.getElementById('mainTextSize');
        const subTextSize = document.getElementById('subTextSize');
        if (mainTextSize) {
            mainTextSize.value = '40';
            document.getElementById('mainTextSizeValue').textContent = '40px';
        }
        if (subTextSize) {
            subTextSize.value = '16';
            document.getElementById('subTextSizeValue').textContent = '16px';
        }
        
        // Reset colors
        const mainTextColor = document.getElementById('mainTextColor');
        const subTextColor = document.getElementById('subTextColor');
        const backgroundColor = document.getElementById('backgroundColor');
        if (mainTextColor) mainTextColor.value = '#2c3e50';
        if (subTextColor) subTextColor.value = '#7f8c8d';
        if (backgroundColor) backgroundColor.value = '#ffffff';
        
        // Reset background type
        const backgroundType = document.getElementById('backgroundType');
        if (backgroundType) backgroundType.value = 'solid';
        updateBackgroundSettings();
        
        // Reset shape
        const shapeType = document.getElementById('shapeType');
        if (shapeType) shapeType.value = 'none';
        updateShapeSettings();
        
        // Reset canvas size
        const canvasWidth = document.getElementById('canvasWidth');
        const canvasHeight = document.getElementById('canvasHeight');
        if (canvasWidth) {
            canvasWidth.value = '400';
            document.getElementById('canvasWidthValue').textContent = '400px';
        }
        if (canvasHeight) {
            canvasHeight.value = '200';
            document.getElementById('canvasHeightValue').textContent = '200px';
        }
        
        // Update canvas size
        updateCanvasSize();
        
        // Hide result area
        const resultArea = document.getElementById('resultArea');
        const downloadBtn = document.getElementById('downloadBtn');
        const copyBtn = document.getElementById('copyBtn');
        
        if (resultArea) resultArea.style.display = 'none';
        if (downloadBtn) downloadBtn.style.display = 'none';
        if (copyBtn) copyBtn.style.display = 'none';
        
        // Clear stored canvas
        window.logoCanvas = null;
        
        // Generate new logo
        generateLogo();
        
        try { showNotification && showNotification('تم إعادة تعيين جميع الإعدادات', 'info'); } catch(e) {}
        
    } catch (error) {
        console.error('Reset error:', error);
        try { showNotification && showNotification('حدث خطأ أثناء إعادة التعيين', 'error'); } catch(e) {}
    }
}

// Age Calculator Functions
function initializeAgeCalculator() {
    // Age calculator is self-contained in its HTML file
    // No additional initialization needed as all functionality is in the HTML
    console.log('Age Calculator initialized');
}

// Disable right-click context menu (for online tools pages)
// document.addEventListener('contextmenu', function (event) {
//     event.preventDefault();
// });
// ============================================================
// BACKGROUND GENERATOR FUNCTIONS
// ============================================================
function initializeBackgroundGenerator() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('imageFile');
    const bgType = document.getElementById('bgType');
    const blurIntensity = document.getElementById('blurIntensity');
    const patternSize = document.getElementById('patternSize');

    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault(); uploadArea.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) loadBgImage(file);
        });
        fileInput.addEventListener('change', (e) => { if (e.target.files[0]) loadBgImage(e.target.files[0]); });
    }

    if (bgType) {
        bgType.addEventListener('change', () => {
            const type = bgType.value;
            ['blurSettings','gradientSettings','patternSettings','solidSettings'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });
            const show = document.getElementById(type + 'Settings');
            if (show) show.style.display = 'block';
        });
    }

    if (blurIntensity) {
        blurIntensity.addEventListener('input', () => {
            const v = document.getElementById('blurValue');
            if (v) v.textContent = blurIntensity.value;
        });
    }

    if (patternSize) {
        patternSize.addEventListener('input', () => {
            const v = document.getElementById('patternSizeValue');
            if (v) v.textContent = patternSize.value;
        });
    }

    const outputSize = document.getElementById('outputSize');
    if (outputSize) {
        outputSize.addEventListener('change', () => {
            const custom = document.getElementById('customSize');
            if (custom) custom.style.display = outputSize.value === 'custom' ? 'block' : 'none';
        });
    }
}

function loadBgImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        window.bgSourceImage = e.target.result;
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        if (preview && previewImg) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
            const fn = document.getElementById('fileName'); if (fn) fn.textContent = file.name;
            const fs = document.getElementById('fileSize'); if (fs) fs.textContent = formatFileSize(file.size);
            const img = new Image();
            img.onload = () => {
                const fd = document.getElementById('fileDimensions'); if (fd) fd.textContent = img.width + ' × ' + img.height + 'px';
            };
            img.src = e.target.result;
        }
    };
    reader.readAsDataURL(file);
}

function generateBackground() {
    const bgType = document.getElementById('bgType');
    if (!bgType) return;
    const type = bgType.value;

    const outputSize = document.getElementById('outputSize');
    let width = 1920, height = 1080;
    if (outputSize) {
        const sizes = { 'hd': [1920,1080], 'fhd': [1920,1080], '4k': [3840,2160], 'mobile': [1080,1920], 'square': [1080,1080], 'banner': [1500,500] };
        if (sizes[outputSize.value]) { width = sizes[outputSize.value][0]; height = sizes[outputSize.value][1]; }
        if (outputSize.value === 'custom') {
            const cw = parseInt(document.getElementById('customWidth')?.value) || 1920;
            const ch = parseInt(document.getElementById('customHeight')?.value) || 1080;
            width = Math.min(4000, Math.max(100, cw)); height = Math.min(4000, Math.max(100, ch));
        }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (type === 'blur' && window.bgSourceImage) {
        const img = new Image();
        img.onload = () => {
            const blur = parseInt(document.getElementById('blurIntensity')?.value || 10);
            ctx.filter = `blur(${blur}px)`;
            ctx.drawImage(img, -blur*2, -blur*2, width + blur*4, height + blur*4);
            ctx.filter = 'none';
            finalizeBgResult(canvas);
        };
        img.src = window.bgSourceImage;
    } else if (type === 'gradient') {
        const c1 = document.getElementById('gradientColor1')?.value || '#667eea';
        const c2 = document.getElementById('gradientColor2')?.value || '#764ba2';
        const dir = document.getElementById('gradientDirection')?.value || 'to right';
        let grad;
        if (dir === 'to right') grad = ctx.createLinearGradient(0, 0, width, 0);
        else if (dir === 'to bottom') grad = ctx.createLinearGradient(0, 0, 0, height);
        else if (dir === 'diagonal') grad = ctx.createLinearGradient(0, 0, width, height);
        else grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
        grad.addColorStop(0, c1); grad.addColorStop(1, c2);
        ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height);
        finalizeBgResult(canvas);
    } else if (type === 'pattern') {
        const patType = document.getElementById('patternType')?.value || 'dots';
        const size = parseInt(document.getElementById('patternSize')?.value || 20);
        ctx.fillStyle = '#f8f9fa'; ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#667eea'; ctx.strokeStyle = '#667eea'; ctx.lineWidth = 2;
        if (patType === 'dots') {
            for (let x = size; x < width; x += size*2) for (let y = size; y < height; y += size*2) {
                ctx.beginPath(); ctx.arc(x, y, size/4, 0, Math.PI*2); ctx.fill();
            }
        } else if (patType === 'lines') {
            for (let x = 0; x < width; x += size) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
        } else if (patType === 'grid') {
            for (let x = 0; x < width; x += size) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
            for (let y = 0; y < height; y += size) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
        } else if (patType === 'diagonal') {
            for (let i = -height; i < width + height; i += size*2) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + height, height); ctx.stroke();
            }
        }
        finalizeBgResult(canvas);
    } else if (type === 'solid') {
        const color = document.getElementById('solidColor')?.value || '#f0f0f0';
        ctx.fillStyle = color; ctx.fillRect(0, 0, width, height);
        finalizeBgResult(canvas);
    } else {
        // Default gradient if no image
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#667eea'); grad.addColorStop(1, '#764ba2');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height);
        finalizeBgResult(canvas);
    }
}

function finalizeBgResult(canvas) {
    window.bgResultCanvas = canvas;
    const resultArea = document.getElementById('resultArea');
    const bgPreview = document.getElementById('backgroundPreview');
    if (resultArea) resultArea.style.display = 'block';
    if (bgPreview) {
        bgPreview.style.background = 'none';
        bgPreview.innerHTML = '';
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        img.style.cssText = 'width:100%;max-width:600px;height:auto;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.2);';
        bgPreview.appendChild(img);
    }
    try { showNotification && showNotification('تم إنشاء الخلفية بنجاح!', 'success'); } catch(e) {}
}

function downloadBackground() {
    if (!window.bgResultCanvas) { try { showNotification && showNotification('أنشئ خلفية أولاً', 'warning'); } catch(e) {} return; }
    const link = document.createElement('a');
    link.download = 'background-' + Date.now() + '.png';
    link.href = window.bgResultCanvas.toDataURL('image/png');
    link.click();
    try { showNotification && showNotification('تم تحميل الخلفية!', 'success'); } catch(e) {}
}

function copyBackground() {
    if (!window.bgResultCanvas) return;
    const type = document.getElementById('bgType')?.value;
    let css = '';
    if (type === 'gradient') {
        const c1 = document.getElementById('gradientColor1')?.value || '#667eea';
        const c2 = document.getElementById('gradientColor2')?.value || '#764ba2';
        const dir = document.getElementById('gradientDirection')?.value || 'to right';
        if (dir === 'radial') css = `background: radial-gradient(circle, ${c1}, ${c2});`;
        else css = `background: linear-gradient(${dir}, ${c1}, ${c2});`;
    } else if (type === 'solid') {
        css = `background-color: ${document.getElementById('solidColor')?.value || '#f0f0f0'};`;
    } else {
        css = `background: url('your-background.png') center/cover no-repeat;`;
    }
    navigator.clipboard.writeText(css).then(() => {
        try { showNotification && showNotification('تم نسخ كود CSS!', 'success'); } catch(e) {}
    });
}

function resetGenerator() {
    window.bgSourceImage = null;
    window.bgResultCanvas = null;
    const imagePreview = document.getElementById('imagePreview');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('imageFile');
    if (imagePreview) imagePreview.style.display = 'none';
    if (resultArea) resultArea.style.display = 'none';
    if (fileInput) fileInput.value = '';
    try { showNotification && showNotification('تم إعادة التعيين', 'info'); } catch(e) {}
}

// ============================================================
// BACKGROUND REMOVER FUNCTIONS
// ============================================================
function initializeBackgroundRemover() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('imageFile');
    const detailSlider = document.getElementById('detailEnhancement');
    const toleranceSlider = document.getElementById('colorTolerance');
    const edgeSoftness = document.getElementById('edgeSoftness');
    const edgeSensitivity = document.getElementById('edgeSensitivitySlider');
    const edgeBlur = document.getElementById('edgeBlur');
    const brushSize = document.getElementById('brushSizeSlider');
    const processingMethod = document.getElementById('processingMethod');

    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault(); uploadArea.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) loadRemoverImage(file);
        });
        fileInput.addEventListener('change', (e) => { if (e.target.files[0]) loadRemoverImage(e.target.files[0]); });
    }

    if (processingMethod) {
        processingMethod.addEventListener('change', () => {
            const method = processingMethod.value;
            ['aiSettings','colorSettings','edgeSettings','manualSettings'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });
            const show = document.getElementById(method + 'Settings');
            if (show) show.style.display = 'block';
        });
    }

    if (detailSlider) detailSlider.addEventListener('input', () => { const v = document.getElementById('detailValue'); if (v) v.textContent = detailSlider.value + '%'; });
    if (toleranceSlider) toleranceSlider.addEventListener('input', () => { const v = document.getElementById('toleranceValue'); if (v) v.textContent = toleranceSlider.value; });
    if (edgeSoftness) edgeSoftness.addEventListener('input', () => { const v = document.getElementById('softnessValue'); if (v) v.textContent = edgeSoftness.value + '%'; });
    if (edgeSensitivity) edgeSensitivity.addEventListener('input', () => { const v = document.getElementById('edgeSensitivity'); if (v) v.textContent = edgeSensitivity.value + '%'; });
    if (edgeBlur) edgeBlur.addEventListener('input', () => { const v = document.getElementById('blurValue'); if (v) v.textContent = edgeBlur.value + 'px'; });
    if (brushSize) brushSize.addEventListener('input', () => { const v = document.getElementById('brushSize'); if (v) v.textContent = brushSize.value; });
}

function loadRemoverImage(file) {
    if (file.size > 10 * 1024 * 1024) {
        try { showNotification && showNotification('حجم الملف كبير جداً (الحد الأقصى 10MB)', 'error'); } catch(e) {} return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        window.removerOriginalImage = e.target.result;
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        if (preview && previewImg) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
            const fn = document.getElementById('fileName'); if (fn) fn.textContent = file.name;
            const fs = document.getElementById('fileSize'); if (fs) fs.textContent = formatFileSize(file.size);
            const img = new Image();
            img.onload = () => {
                const fd = document.getElementById('fileDimensions'); if (fd) fd.textContent = img.width + ' × ' + img.height + 'px';
                window.removerImageWidth = img.width;
                window.removerImageHeight = img.height;
            };
            img.src = e.target.result;
        }
    };
    reader.readAsDataURL(file);
}

function removeBackground() {
    if (!window.removerOriginalImage) {
        try { showNotification && showNotification('الرجاء رفع صورة أولاً', 'warning'); } catch(e) {} return;
    }

    const statusDiv = document.getElementById('processingStatus');
    const progressFill = document.getElementById('progressFill');
    const processingText = document.getElementById('processingText');
    if (statusDiv) statusDiv.style.display = 'block';

    const method = document.getElementById('processingMethod')?.value || 'ai';
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90;
        if (progressFill) progressFill.style.width = progress + '%';
        if (processingText) {
            const msgs = ['جاري تحليل الصورة...', 'جاري كشف الحواف...', 'جاري معالجة المناطق...', 'جاري تطبيق الشفافية...'];
            processingText.textContent = msgs[Math.floor(progress/30)] || msgs[0];
        }
    }, 200);

    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        if (method === 'color') {
            const removeColor = document.getElementById('removeColor')?.value || '#ffffff';
            const tolerance = parseInt(document.getElementById('colorTolerance')?.value || 30) * 2.55;
            const r = parseInt(removeColor.slice(1,3),16);
            const g = parseInt(removeColor.slice(3,5),16);
            const b = parseInt(removeColor.slice(5,7),16);
            for (let i = 0; i < data.length; i += 4) {
                const dr = Math.abs(data[i] - r); const dg = Math.abs(data[i+1] - g); const db = Math.abs(data[i+2] - b);
                if (dr < tolerance && dg < tolerance && db < tolerance) data[i+3] = 0;
            }
        } else {
            // AI-like: remove near-white or near-solid background using flood fill from corners
            const tol = 40;
            const visited = new Uint8Array(canvas.width * canvas.height);
            const queue = [];
            // Seed from corners
            [[0,0],[canvas.width-1,0],[0,canvas.height-1],[canvas.width-1,canvas.height-1]].forEach(([x,y]) => {
                const idx = (y * canvas.width + x) * 4;
                queue.push({x, y, r: data[idx], g: data[idx+1], b: data[idx+2]});
            });
            const isSimilar = (r1,g1,b1,r2,g2,b2) => Math.abs(r1-r2)+Math.abs(g1-g2)+Math.abs(b1-b2) < tol*3;
            while (queue.length > 0) {
                const {x, y, r: br, g: bg, b: bb} = queue.shift();
                if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
                const vi = y * canvas.width + x;
                if (visited[vi]) continue;
                visited[vi] = 1;
                const idx = vi * 4;
                if (!isSimilar(data[idx], data[idx+1], data[idx+2], br, bg, bb)) continue;
                data[idx+3] = 0;
                [[x+1,y],[x-1,y],[x,y+1],[x,y-1]].forEach(([nx,ny]) => {
                    if (nx>=0 && nx<canvas.width && ny>=0 && ny<canvas.height && !visited[ny*canvas.width+nx])
                        queue.push({x:nx, y:ny, r: br, g: bg, b: bb});
                });
            }
        }

        ctx.putImageData(imageData, 0, 0);
        window.removerResult = canvas.toDataURL('image/png');

        clearInterval(interval);
        if (progressFill) progressFill.style.width = '100%';

        setTimeout(() => {
            if (statusDiv) statusDiv.style.display = 'none';
            const resultArea = document.getElementById('resultArea');
            const originalImg = document.getElementById('originalImage');
            const processedImg = document.getElementById('processedImage');
            if (resultArea) resultArea.style.display = 'block';
            if (originalImg) originalImg.src = window.removerOriginalImage;
            if (processedImg) { processedImg.src = window.removerResult; processedImg.style.background = 'repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 0 0 / 20px 20px'; }
            try { showNotification && showNotification('تم إزالة الخلفية بنجاح!', 'success'); } catch(e) {}
        }, 500);
    };
    img.src = window.removerOriginalImage;
}

function resetRemover() {
    window.removerOriginalImage = null;
    window.removerResult = null;
    const imagePreview = document.getElementById('imagePreview');
    const processingStatus = document.getElementById('processingStatus');
    const resultArea = document.getElementById('resultArea');
    const fileInput = document.getElementById('imageFile');
    if (imagePreview) imagePreview.style.display = 'none';
    if (processingStatus) processingStatus.style.display = 'none';
    if (resultArea) resultArea.style.display = 'none';
    if (fileInput) fileInput.value = '';
    try { showNotification && showNotification('تم إعادة التعيين', 'info'); } catch(e) {}
}

function downloadProcessedImage() {
    if (!window.removerResult) { try { showNotification && showNotification('لا توجد صورة للتحميل', 'warning'); } catch(e) {} return; }
    const format = document.getElementById('outputFormat')?.value || 'png';
    const link = document.createElement('a');
    link.download = 'removed-bg-' + Date.now() + '.' + format;
    link.href = window.removerResult;
    link.click();
    try { showNotification && showNotification('تم تحميل الصورة!', 'success'); } catch(e) {}
}

function copyProcessedImage() {
    if (!window.removerResult) return;
    fetch(window.removerResult).then(r => r.blob()).then(blob => {
        navigator.clipboard.write([new ClipboardItem({'image/png': blob})]).then(() => {
            try { showNotification && showNotification('تم نسخ الصورة!', 'success'); } catch(e) {}
        }).catch(() => {
            try { showNotification && showNotification('لا يدعم هذا المتصفح نسخ الصور', 'warning'); } catch(e) {}
        });
    });
}

function previewOnBackground() {
    const bgPreview = document.getElementById('backgroundPreview');
    if (!bgPreview || !window.removerResult) return;
    bgPreview.style.display = bgPreview.style.display === 'none' ? 'block' : 'none';
    const imgs = ['previewWhite','previewBlack','previewGradient'];
    imgs.forEach(id => { const el = document.getElementById(id); if (el) el.src = window.removerResult; });
}
