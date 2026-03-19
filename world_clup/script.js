        // ========== العد التنازلي ==========
        const countdownDate = new Date("June 11, 2026 00:00:00").getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("days").innerHTML = String(days).padStart(3, '0');
            document.getElementById("hours").innerHTML = String(hours).padStart(2, '0');
            document.getElementById("minutes").innerHTML = String(minutes).padStart(2, '0');
            document.getElementById("seconds").innerHTML = String(seconds).padStart(2, '0');

            if (distance < 0) {
                clearInterval(countdownInterval);
                document.getElementById("countdown").innerHTML = "<h2>🎉 البطولة بدأت! 🎉</h2>";
            }
        };

        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown();

        // ========== المودال ==========
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        const closeBtn = document.querySelector('.modal-close');

        function openModal(element) {
            const img = element.querySelector('img');
            const overlay = element.querySelector('.overlay h4');
            
            modal.style.display = 'block';
            modalImg.src = img.src;
            modalCaption.textContent = overlay ? overlay.textContent : img.alt;
            document.body.style.overflow = 'hidden';
        }

        closeBtn.onclick = function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        modal.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        };

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        // ========== القائمة المتجاوبة ==========
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // إغلاق القائمة عند الضغط على أي رابط
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.querySelector('i').classList.add('fa-bars');
                menuToggle.querySelector('i').classList.remove('fa-times');
            });
        });

        // ========== تأثير التمرير على شريط التنقل ==========
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // ========== زر العودة للأعلى ==========
        const scrollTopBtn = document.getElementById('scrollTop');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // ========== تفعيل الروابط النشطة ==========
        const sections = document.querySelectorAll('section[id]');
        const navLinksItems = document.querySelectorAll('.nav-links a');

        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinksItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        });

        // ========== تأثيرات الحركة عند التمرير ==========
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.info-card, .group-card, .stadium-card, .timeline-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });

        // ========== تحميل الصفحة بسلاسة ==========
        window.addEventListener('load', () => {
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            }, 100);
        });

        // ========== رسالة الترحيب ==========
        console.log('%c🏆 مرحباً بك في كأس العالم 2026! 🏆', 'color: #ffd700; font-size: 24px; font-weight: bold;');
        console.log('%cالموقع الرسمي الشامل لأضخم بطولة كرة قدم في التاريخ', 'color: #003d82; font-size: 16px;');
