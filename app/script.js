/* ════════════════════════════════════════
   FAZZA PLAY — PROFESSIONAL SCRIPT 2025
   ════════════════════════════════════════ */

const allApps = [
    { name: 'Blender', description: 'برنامج مجاني لإنشاء رسومات ثلاثية الأبعاد.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Blender_logo_no_text.svg/2048px-Blender_logo_no_text.svg.png', link: 'apps/blender.html', downloadUrl: 'https://www.blender.org/download/', type: 'windows' },
    { name: 'Inkscape', description: 'محرر رسومات متجهة احترافي ومجاني.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Inkscape_Logo.svg/1200px-Inkscape_Logo.svg.png', link: 'apps/inkscape.html', downloadUrl: 'https://inkscape.org/release/inkscape-1.2/', type: 'windows' },
    { name: 'FileZilla', description: 'برنامج FTP مجاني لنقل الملفات.', imageUrl: 'https://th.bing.com/th/id/OIP.kc5fINibkQwbK5-7Zj6qfgHaHa?w=161&h=180&c=7&r=0&o=5&pid=1.7', link: 'apps/filezilla.html', downloadUrl: 'https://filezilla-project.org/download.php', type: 'windows' },
    { name: 'WinRAR', description: 'برنامج قوي لضغط وفك ضغط الملفات.', imageUrl: 'https://th.bing.com/th/id/OIP.tHgqVpzjw0Nl_sWuTPGfgAHaE8?w=264&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/winrar.html', downloadUrl: 'https://www.win-rar.com/download.html', type: 'windows' },
    { name: '7-Zip', description: 'أداة مجانية ومفتوحة المصدر لضغط الملفات.', imageUrl: 'https://www.7-zip.org/7ziplogo.png', link: 'apps/7-zip.html', downloadUrl: 'https://www.7-zip.org/download.html', type: 'windows' },
    { name: 'Microsoft Teams', description: 'منصة للعمل الجماعي والاجتماعات عبر الإنترنت.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg/1200px-Microsoft_Office_Teams_%282018%E2%80%93present%29.svg.png', link: 'apps/teams.html', downloadUrl: 'https://www.microsoft.com/en-us/microsoft-teams/download-app', type: 'windows' },
    { name: 'Skype', description: 'مكالمات فيديو وصوتية ورسائل فورية.', imageUrl: 'https://th.bing.com/th/id/OIP.mPxtqGNHtZfV9YDMqbGAOAHaEK?w=380&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/skype.html', downloadUrl: 'https://www.skype.com/en/get-skype/', type: 'windows' },
    { name: 'Notepad++', description: 'محرر نصوص متقدم يدعم العديد من لغات البرمجة.', imageUrl: 'https://th.bing.com/th/id/OIP.69aJR-pQnEy-kCdzo8_oIAHaFj?w=233&h=180&c=7&r=0&o=5&pid=1.7', link: 'apps/notepad-plus-plus.html', downloadUrl: 'https://notepad-plus-plus.org/downloads/', type: 'windows' },
    { name: 'TikTok', description: 'منصة رائدة لمقاطع الفيديو القصيرة.', imageUrl: 'https://logodownload.org/wp-content/uploads/2019/08/tiktok-logo-1.png', link: 'apps/tiktok.html', downloadUrl: 'https://www.tiktok.com/download', type: 'android' },
    { name: 'Instagram', description: 'شارك صورك وقصصك مع الأصدقاء.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png', link: 'apps/instagram.html', downloadUrl: 'https://www.instagram.com/download/app/', type: 'android' },
    { name: 'WhatsApp', description: 'تطبيق مراسلة فورية آمن وموثوق.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2042px-WhatsApp.svg.png', link: 'apps/whatsapp.html', downloadUrl: 'https://www.whatsapp.com/download', type: 'android' },
    { name: 'Facebook', description: 'تواصل مع العالم من حولك.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png', link: 'apps/facebook.html', downloadUrl: 'https://www.facebook.com/download/ipad/', type: 'android' },
    { name: 'Telegram', description: 'تطبيق مراسلة يركز على السرعة والأمان.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png', link: 'apps/telegram.html', downloadUrl: 'https://telegram.org/apps', type: 'android' },
    { name: 'Snapchat', description: 'تطبيق لمشاركة اللحظات مع الأصدقاء.', imageUrl: 'https://www.freepnglogos.com/uploads/snapchat-logo-png-0.png', link: 'apps/snapchat.html', downloadUrl: 'https://www.snapchat.com/download', type: 'android' },
    { name: 'X (Twitter)', description: 'منصة للتواصل الاجتماعي والأخبار.', imageUrl: 'https://th.bing.com/th/id/OIP.N_86k_r2F0gyF_pm_a9OqgHaEr?w=284&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/x-twitter.html', downloadUrl: 'https://twitter.com/download', type: 'android' },
    { name: 'Pinterest', description: 'اكتشف الأفكار والإلهام.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png', link: 'apps/pinterest.html', downloadUrl: 'https://www.pinterest.com/download/', type: 'android' },
    { name: 'LinkedIn', description: 'شبكة المحترفين المهنية.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/800px-LinkedIn_logo_initials.png', link: 'apps/linkedin.html', downloadUrl: 'https://www.linkedin.com/mobile', type: 'android' },
    { name: 'Viber', description: 'مكالمات ورسائل مجانية وآمنة.', imageUrl: 'https://cdn-icons-png.flaticon.com/512/3670/3670059.png', link: 'apps/viber.html', downloadUrl: 'https://www.viber.com/en/download/', type: 'android' },
    { name: 'Photoshop', description: 'برنامج تحرير الصور الاحترافي.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Photoshop_CC_icon.svg/1200px-Adobe_Photoshop_CC_icon.svg.png', link: 'apps/photoshop.html', downloadUrl: 'https://www.adobe.com/products/photoshop.html', type: 'windows' },
    { name: 'VS Code', description: 'محرر أكواد قوي ومجاني.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/2048px-Visual_Studio_Code_1.35_icon.svg.png', link: 'apps/vscode.html', downloadUrl: 'https://code.visualstudio.com/download', type: 'windows' },
    { name: 'Slack', description: 'منصة تواصل وتعاون للفرق.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png', link: 'apps/slack.html', downloadUrl: 'https://slack.com/downloads/', type: 'windows' },
    { name: 'Discord', description: 'تواصل صوتي ونصي للاعبين والمجتمعات.', imageUrl: 'https://logodownload.org/wp-content/uploads/2017/11/discord-logo-4-1.png', link: 'apps/discord.html', downloadUrl: 'https://discord.com/download', type: 'windows' },
    { name: 'Spotify', description: 'استمع إلى ملايين الأغاني والبودكاست.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png', link: 'apps/spotify.html', downloadUrl: 'https://www.spotify.com/us/download/other/', type: 'windows' },
    { name: 'VLC Media Player', description: 'مشغل وسائط متعددة مجاني ومفتوح المصدر.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/VLC_Icon.svg/2048px-VLC_Icon.svg.png', link: 'apps/vlc.html', downloadUrl: 'https://www.videolan.org/vlc/', type: 'windows' },
    { name: 'GIMP', description: 'برنامج تحرير صور مجاني ومفتوح المصدر.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/The_GIMP_icon_-_gnome.svg/2048px-The_GIMP_icon_-_gnome.svg.png', link: 'apps/gimp.html', downloadUrl: 'https://www.gimp.org/downloads/', type: 'windows' },
    { name: 'OBS Studio', description: 'برنامج تسجيل وبث فيديو مجاني.', imageUrl: 'https://th.bing.com/th/id/OIP.KjdbWQlMNYYFtV1dAkfcLgHaEK?w=298&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/obs-studio.html', downloadUrl: 'https://obsproject.com/download', type: 'windows' },
    { name: 'BlueStacks 5', description: 'أفضل محاكي أندرويد خفيف وسريع لتشغيل ألعاب وتطبيقات الموبايل على الكمبيوتر.', imageUrl: 'images/BlueStacks.jpg', link: 'apps/bluestacks-5.html', downloadUrl: 'https://www.bluestacks.com/download.html', type: 'windows' },
    { name: 'LDPlayer 9', description: 'محاكي أندرويد قوي وسريع مع أداء عالي.', imageUrl: 'images/LDPlayer 9.webp', link: 'apps/ldplayer-9.html', downloadUrl: 'https://www.ldplayer.net/', type: 'windows' },
    { name: 'Audacity', description: 'محرر صوتي مجاني ومفتوح المصدر.', imageUrl: 'https://th.bing.com/th/id/R.a3423f9de86c572a3be25e6ec65adc7a?rik=yySetrhJp1IM3Q&pid=ImgRaw&r=0', link: 'apps/audacity.html', downloadUrl: 'https://www.audacityteam.org/download/', type: 'windows' },
    { name: 'Zoom', description: 'منصة اجتماعات فيديو عبر الإنترنت.', imageUrl: 'https://th.bing.com/th?q=Zoom+Icon.png&w=120&h=120&c=1&rs=1&qlt=70&o=7&cb=1&pid=InlineBlock&mkt=ar-EG&cc=EG&setlang=ar&adlt=strict&t=1&mw=247', link: 'apps/zoom.html', downloadUrl: 'https://zoom.us/download', type: 'windows' },
    { name: 'Screaming Frog', description: 'أداة قوية لفحص المواقع تقنياً.', imageUrl: 'https://th.bing.com/th/id/OIP.wfX_139bPsCpw3dqIwoV-AHaFj?w=224&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/screaming-frog.html', downloadUrl: 'https://www.screamingfrog.co.uk/seo-spider/', type: 'web' },
    { name: 'Yoast SEO', description: 'إضافة شائعة لتحسين محركات البحث في ووردبريس.', imageUrl: 'https://th.bing.com/th/id/OIP.ojLJfF-4TKoKO0AQu7YlOAHaHa?w=170&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/yoast-seo.html', downloadUrl: 'https://wordpress.org/plugins/wordpress-seo/', type: 'web' },
    { name: 'SEOptimer', description: 'أداة لتحليل وتقييم أداء الموقع.', imageUrl: 'https://th.bing.com/th/id/OIP.W6S3uehd3HcjOlDRh7CPUAHaHa?w=179&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/seoptimer.html', downloadUrl: 'https://www.seoptimer.com/', type: 'web' },
    { name: 'Ubersuggest', description: 'أداة للبحث عن الكلمات المفتاحية وتحليل المنافسين.', imageUrl: 'https://th.bing.com/th/id/OIP.nT3kpsPlJ_O8lB7pDMYxBQHaEK?w=305&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/ubersuggest.html', downloadUrl: 'https://neilpatel.com/ubersuggest/', type: 'web' },
    { name: 'CapCut', description: 'تطبيق مجاني لتحرير الفيديو مع ميزات قوية.', imageUrl: 'https://th.bing.com/th/id/OIP._wz7-MDuaUZ48i_QiUY1XQHaEK?w=297&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/capcut.html', downloadUrl: 'https://www.capcut.com/', type: 'android' },
    { name: 'SHAREit', description: 'تطبيق لمشاركة الملفات بسرعة فائقة بدون إنترنت.', imageUrl: 'https://th.bing.com/th/id/OIP.UVkeVceITetDore0epH3cwAAAA?w=213&h=161&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/shareit.html', downloadUrl: 'https://www.ushareit.com/', type: 'android' },
    { name: 'Truecaller', description: 'معرفة هوية المتصل وحظر المكالمات غير المرغوب فيها.', imageUrl: 'https://th.bing.com/th/id/OIP.7smA5B6Wvv_e5pJFYGfgFQHaHa?w=181&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/truecaller.html', downloadUrl: 'https://www.truecaller.com/', type: 'android' },
    { name: 'Anghami', description: 'استمع إلى ملايين الأغاني العربية والأجنبية.', imageUrl: 'https://th.bing.com/th/id/OIP.UnOUcJXXXnzaI3k_cwCazAHaHG?w=162&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/anghami.html', downloadUrl: 'https://www.anghami.com/', type: 'android' },
    { name: 'Picsart', description: 'محرر صور وفيديو قوي مع أدوات إبداعية.', imageUrl: 'https://th.bing.com/th/id/OIP.YidFm3gMg1ZOm6RIijzYIgHaHa?w=172&h=181&c=7&r=0&o=5&pid=1.7', link: 'apps/picsart.html', downloadUrl: 'https://picsart.com/', type: 'android' },
    { name: 'Google Translate', description: 'ترجمة النصوص والصور والكلام بأكثر من 100 لغة.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/1200px-Google_Translate_logo.svg.png', link: 'apps/google-translate.html', downloadUrl: 'https://translate.google.com/', type: 'android' },
    { name: 'MX Player', description: 'مشغل فيديو قوي يدعم جميع الصيغ والترجمات.', imageUrl: 'https://th.bing.com/th/id/OIF.tF42JMIWW1xYyrOoXILs7g?w=169&h=180&c=7&r=0&o=5&pid=1.7', link: 'apps/mx-player.html', downloadUrl: 'https://www.mxplayer.in/', type: 'android' },
    { name: 'My Orange', description: 'إدارة خط أورنج الخاص بك، والتحكم في استهلاكك، ودفع الفواتير.', imageUrl: 'https://th.bing.com/th/id/OIP.HiBERYlELMgyuRBH0PUk-QHaD4?w=225&h=181&c=7&r=0&o=5&pid=1.7', link: 'apps/my-orange.html', downloadUrl: 'https://www.orange.eg/ar/my-orange-app', type: 'android' },
    { name: 'InstaPay', description: 'تطبيق مرخص للمدفوعات اللحظية بين البنوك والمحافظ الإلكترونية.', imageUrl: 'https://th.bing.com/th/id/OIP.9_1Wb5nJj6Z9HO0W8tbtewHaHa?w=173&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/instapay.html', downloadUrl: 'https://www.instapay.eg/', type: 'android' },
    { name: 'Muslim Pro', description: 'التطبيق الإسلامي الأكثر شهرة مع أوقات الصلاة والأذان والقرآن.', imageUrl: 'https://th.bing.com/th/id/OIP.WXgZkI_AmgVXlJMS8g5OjgHaHa?w=175&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/muslim-pro.html', downloadUrl: 'https://www.muslimpro.com/', type: 'android' },
    { name: 'Athan (أذان)', description: 'تطبيق الأذان وأوقات الصلاة الأكثر دقة.', imageUrl: 'https://th.bing.com/th/id/OIP.KW1HaC7Uwd6GtF98-pyHkwHaHa?w=183&h=182&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/athan.html', downloadUrl: 'https://www.islamicfinder.org/athan-app/', type: 'android' },
    { name: 'Quran Majeed', description: 'تطبيق رائع لقراءة واستماع القرآن الكريم مع ترجمات متعددة.', imageUrl: 'https://th.bing.com/th/id/OIP.35pmPJZ5yZOXDr8bDb7hvwHaHa?w=177&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/quran-majeed.html', downloadUrl: 'https://www.quranmajeed.com/', type: 'android' },
    { name: 'Google Analytics', description: 'أداة تحليل البيانات المجانية من جوجل لمراقبة أداء موقعك.', imageUrl: 'https://th.bing.com/th/id/OIP.QyiMvGeSO9RTUKj0yE-XfQHaD4?w=310&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/google-analytics.html', downloadUrl: 'https://analytics.google.com/', type: 'web' },
    { name: 'Ahrefs', description: 'أداة SEO متقدمة لتحليل الكلمات المفتاحية وفحص الروابط الخلفية.', imageUrl: 'https://th.bing.com/th/id/OIP.JUKnXN6yaJpnVf_5nXfkWAHaEL?w=317&h=180&c=7&r=0&o=5&pid=1.7', link: 'apps/ahrefs.html', downloadUrl: 'https://ahrefs.com/', type: 'web' },
    { name: 'SEMrush', description: 'منصة شاملة لتحليل الكلمات المفتاحية ومراقبة المنافسين.', imageUrl: 'https://th.bing.com/th/id/OIP.TEirhV_9BAzbUaaUSAHSOAHaEK?w=300&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/semrush.html', downloadUrl: 'https://www.semrush.com/', type: 'web' },
    { name: 'Canva', description: 'صمّم صور وفيديو ومنشورات احترافية بسهولة من هاتفك.', imageUrl: 'https://th.bing.com/th/id/OIP.uDmWNXSV7yunRKh8xkuqlwHaHa?w=173&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/canva.html', downloadUrl: 'https://www.canva.com/download/', type: 'android' },
    { name: 'KineMaster', description: 'محرر فيديو قوي على الموبايل مع طبقات وتأثيرات احترافية.', imageUrl: 'https://th.bing.com/th/id/OIP.vY7Kaj1_OaJYo4Sv_FxFhAHaHa?w=176&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/kinemaster.html', downloadUrl: 'https://www.kinemaster.com/download', type: 'android' },
    { name: 'WPS Office', description: 'حزمة أوفيس كاملة لتحرير ملفات Word وExcel وPDF.', imageUrl: 'https://th.bing.com/th/id/OIP.qSfi-7FICUaYUICEPSuFHgAAAA?w=180&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/wps-office.html', downloadUrl: 'https://www.wps.com/download/', type: 'android' },
    { name: 'Duolingo', description: 'تعلّم اللغات بطريقة ممتعة وتفاعلية مع دروس قصيرة يومية.', imageUrl: 'https://th.bing.com/th/id/OIP.MNLnnzec-GkXx3rTdn_oawHaHa?w=168&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/duolingo.html', downloadUrl: 'https://www.duolingo.com/download', type: 'android' },
    { name: 'Notion', description: 'أداة شاملة لتدوين الملاحظات وإدارة المشاريع والتعاون مع الفرق.', imageUrl: 'https://th.bing.com/th/id/OIP.1hwklnC9WRsFP0W5pe-R3QHaHa?w=174&h=180&c=7&r=0&o=7&pid=1.7&rm=3', link: 'apps/notion.html', downloadUrl: 'https://www.notion.so/download', type: 'android' },
    { name: 'ChatGPT', description: 'مساعد ذكي يعتمد على الذكاء الاصطناعي للمحادثة والكتابة والإبداع.', imageUrl: 'https://th.bing.com/th?q=Chatgpt+Icon.png&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=ar-EG&cc=EG&setlang=ar&adlt=strict&t=1&mw=247', link: 'apps/chatgpt.html', downloadUrl: 'https://chat.openai.com/', type: 'android' },
    { name: 'Netflix', description: 'شاهد الأفلام والمسلسلات بجودة عالية مع خيارات تحميل.', imageUrl: 'https://th.bing.com/th?q=Netflix+logo+icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=ar-EG&cc=EG&setlang=ar&t=1&mw=247', link: 'apps/netflix.html', downloadUrl: 'https://www.netflix.com/download', type: 'android' },
    { name: 'YouTube', description: 'أكبر منصة لمشاهدة الفيديوهات ومتابعة القنوات والبث المباشر.', imageUrl: 'https://th.bing.com/th?q=YouTube+logo+icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=ar-EG&cc=EG&setlang=ar&t=1&mw=247', link: 'apps/youtube.html', downloadUrl: 'https://www.youtube.com/', type: 'android' },
    { name: 'Trello', description: 'إدارة المهام والمشاريع بطريقة Kanban بواجهة بصرية سهلة.', imageUrl: 'https://th.bing.com/th?q=Trello+logo+icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=ar-EG&cc=EG&setlang=ar&adlt=strict&t=1&mw=247', link: 'apps/trello.html', downloadUrl: 'https://trello.com/', type: 'web' },
    { name: 'Figma', description: 'تصميم واجهات المستخدم والتعاون في الوقت الفعلي.', imageUrl: 'https://th.bing.com/th?q=Figma+logo+icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=ar-EG&cc=EG&setlang=ar&adlt=strict&t=1&mw=247', link: 'apps/figma.html', downloadUrl: 'https://figma.com/', type: 'web' },
    { name: 'Google Drive', description: 'تخزين سحابي من جوجل مع مشاركة وتعاون في الوقت الفعلي.', imageUrl: 'https://th.bing.com/th?q=Google+Drive+logo+icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=ar-EG&cc=EG&setlang=ar&t=1&mw=247', link: 'apps/google-drive.html', downloadUrl: 'https://drive.google.com/', type: 'web' },
    { name: 'Adobe Acrobat', description: 'إنشاء وتحرير وتوقيع وتحويل ملفات PDF بسهولة.', imageUrl: 'https://th.bing.com/th?q=Adobe+Acrobat+logo+icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=ar-EG&cc=EG&setlang=ar&adlt=strict&t=1&mw=247', link: 'apps/adobe-acrobat.html', downloadUrl: 'https://acrobat.adobe.com/', type: 'windows' },
    { name: 'Microsoft Office', description: 'حزمة التطبيقات المكتبية: Word وExcel وPowerPoint وOutlook.', imageUrl: 'https://th.bing.com/th?q=Microsoft+Office+logo+icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=ar-EG&cc=EG&setlang=ar&adlt=strict&t=1&mw=247', link: 'apps/microsoft-office.html', downloadUrl: 'https://office.com/', type: 'windows' },
    { name: 'Xbox 360 Controller Emulator', description: 'محاكي يد Xbox 360 لتشغيل الألعاب على أي يد تحكم.', imageUrl: 'برنامج الدراعات/الدراع.png', link: 'apps/x360ce.html', downloadUrl: 'برنامج الدراعات/x360ce_x64 BY fazzaplay.rar', type: 'windows' },
    { name: 'Google Chrome', description: 'متصفح سريع وآمن مع دعم كبير للإضافات وتزامن عبر الأجهزة.', imageUrl: 'https://th.bing.com/th?q=Google+Chrome+logo+icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=ar-EG&cc=EG&setlang=ar&t=1&mw=247', link: 'apps/google-chrome.html', downloadUrl: 'https://www.google.com/chrome/', type: 'windows' },
    { name: 'Mozilla Firefox', description: 'متصفح يركز على الخصوصية وحظر المتتبعات.', imageUrl: 'https://th.bing.com/th?q=Firefox+logo+icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=ar-EG&cc=EG&setlang=ar&t=1&mw=247', link: 'apps/firefox.html', downloadUrl: 'https://www.mozilla.org/firefox/new/', type: 'windows' },
    { name: 'Steam', description: 'أكبر منصّة لألعاب الكمبيوتر مع مكتبة ضخمة وعروض مستمرة.', imageUrl: 'https://th.bing.com/th?q=Steam+logo+icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=ar-EG&cc=EG&setlang=ar&t=1&mw=247', link: 'apps/steam.html', downloadUrl: 'https://store.steampowered.com/about/', type: 'windows' },
    { name: 'Epic Games Launcher', description: 'متجر ألعاب مع عناوين حصرية وعروض مجانية أسبوعية.', imageUrl: 'https://th.bing.com/th?q=Epic+Games+logo+icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=ar-EG&cc=EG&setlang=ar&t=1&mw=247', link: 'apps/epic-games.html', downloadUrl: 'https://store.epicgames.com/download', type: 'windows' },
    { name: 'Google Maps', description: 'خرائط وملاحة ذكية مع حركة المرور وأماكن قريبة.', imageUrl: 'https://th.bing.com/th?q=Google+Maps+logo+icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=ar-EG&cc=EG&setlang=ar&t=1&mw=247', link: 'apps/google-maps.html', downloadUrl: 'https://maps.google.com/', type: 'android' },
    { name: 'Amazon Shopping', description: 'تسوّق ملايين المنتجات مع شحن سريع وتتبع للطلبات.', imageUrl: 'https://th.bing.com/th?q=Amazon+logo+icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=ar-EG&cc=EG&setlang=ar&t=1&mw=247', link: 'apps/amazon.html', downloadUrl: 'https://www.amazon.com/mobile-apps/b?ie=UTF8&node=2350149011', type: 'android' },
    { name: 'Uber', description: 'اطلب سيارة بسرعة وتتبع رحلتك وادفع بأمان.', imageUrl: 'https://th.bing.com/th?q=Uber+logo+icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=ar-EG&cc=EG&setlang=ar&t=1&mw=247', link: 'apps/uber.html', downloadUrl: 'https://www.uber.com/eg/ar/ride/uber-app/', type: 'android' },
    { name: 'Shazam', description: 'تعرّف على الأغاني فوراً وحفظها مع روابط الاستماع.', imageUrl: 'https://th.bing.com/th?q=Shazam+logo+icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=ar-EG&cc=EG&setlang=ar&t=1&mw=247', link: 'apps/shazam.html', downloadUrl: 'https://www.shazam.com/apps', type: 'android' },
    { name: 'YouTube Music', description: 'استمع إلى ملايين الأغاني مع توصيات ذكية.', imageUrl: 'https://th.bing.com/th?q=YouTube+Music+logo+icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=ar-EG&cc=EG&setlang=ar&t=1&mw=247', link: 'apps/youtube-music.html', downloadUrl: 'https://music.youtube.com/', type: 'android' }
];

// ─── DOM REFS ───
const appsGrid     = document.getElementById('appsGrid');
const searchInput  = document.getElementById('searchInput');
const filterBtns   = document.querySelectorAll('.filter-btn');
const backToTopBtn = document.getElementById('backToTopBtn');
const viewSelect   = document.getElementById('viewModeSelect');
const resultsCount = document.getElementById('resultsCount');
const totalCount   = document.getElementById('totalCount');

// ─── STATE ───
let currentFilter = 'all';
let currentSearch = '';

if (totalCount) totalCount.textContent = allApps.length + '+';

// ─── THEME ───
const themeToggle = document.getElementById('themeToggle');
const savedTheme  = localStorage.getItem('theme') || 'dark';

function applyTheme(t) {
    document.body.classList.toggle('light-mode', t === 'light');
    localStorage.setItem('theme', t);
}

applyTheme(savedTheme);

themeToggle?.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    applyTheme(isLight ? 'dark' : 'light');
});

// ─── VIEW MODE ───
function applyViewMode(mode) {
    if (!appsGrid) return;
    appsGrid.classList.remove('layout-compact', 'layout-list');
    if (mode === 'compact') appsGrid.classList.add('layout-compact');
    if (mode === 'list')    appsGrid.classList.add('layout-list');
    localStorage.setItem('viewMode', mode);
}

const savedView = localStorage.getItem('viewMode') || 'grid';
if (viewSelect) { viewSelect.value = savedView; }
applyViewMode(savedView);

viewSelect?.addEventListener('change', () => {
    applyViewMode(viewSelect.value);
});

// ─── HAMBURGER ───
const navbarToggle = document.getElementById('navbarToggle');
const navbarLinks  = document.getElementById('navbarLinks');

navbarToggle?.addEventListener('click', () => {
    navbarLinks?.classList.toggle('active');
});

// ─── RENDER ───
function getBadgeClass(type) {
    if (type === 'windows') return 'badge-windows';
    if (type === 'android') return 'badge-android';
    return 'badge-web';
}

function getTypeLabel(type) {
    if (type === 'windows') return '🖥️ Windows';
    if (type === 'android') return '📱 Android';
    return '🌐 Web';
}

function renderApps(apps) {
    if (!appsGrid) return;
    appsGrid.innerHTML = '';
    
    if (!apps.length) {
        appsGrid.innerHTML = `
            <div class="no-results">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <h3>No apps found</h3>
                <p>Try a different search term or category.</p>
            </div>`;
        if (resultsCount) resultsCount.textContent = '0 results';
        return;
    }

    if (resultsCount) resultsCount.textContent = apps.length + ' app' + (apps.length !== 1 ? 's' : '');

    const frag = document.createDocumentFragment();
    apps.forEach((app, i) => {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.style.animationDelay = Math.min(i * 0.04, 0.4) + 's';
        card.innerHTML = `
            <div class="card-top">
                <img data-src="${app.imageUrl}" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
                     alt="${app.name} icon" class="lazy" width="68" height="68" loading="lazy" decoding="async">
                <div class="card-info">
                    <h3>${app.name}</h3>
                    <p>${app.description}</p>
                    <span class="app-badge ${getBadgeClass(app.type)}">${getTypeLabel(app.type)}</span>
                </div>
            </div>
            <div class="app-card-actions">
                <a href="${app.link}" class="btn download-btn">⬇ Download</a>
            </div>`;
        frag.appendChild(card);
    });
    appsGrid.appendChild(frag);
    lazyLoad();
}

// ─── FILTER & SEARCH ───
function filterAndSearch() {
    const term = currentSearch.toLowerCase().trim();
    const filtered = allApps.filter(app => {
        const matchType   = currentFilter === 'all' || app.type === currentFilter;
        const matchSearch = !term || app.name.toLowerCase().includes(term) || app.description.toLowerCase().includes(term);
        return matchType && matchSearch;
    });
    renderApps(filtered);
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter || 'all';
        filterAndSearch();
        if (navbarLinks?.classList.contains('active')) navbarLinks.classList.remove('active');
    });
});

let searchTimer;
searchInput?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        currentSearch = searchInput.value;
        filterAndSearch();
    }, 200);
});

// ─── LAZY LOAD ───
function lazyLoad() {
    const imgs = appsGrid?.querySelectorAll('img.lazy[data-src]');
    if (!imgs) return;
    
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '200px' });
        imgs.forEach(img => obs.observe(img));
    } else {
        imgs.forEach(img => { img.src = img.dataset.src; img.classList.remove('lazy'); });
    }
}

// ─── BACK TO TOP ───
window.addEventListener('scroll', () => {
    backToTopBtn?.classList.toggle('visible', window.scrollY > 300);
}, { passive: true });

backToTopBtn?.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── URL FILTER ───
function getUrlFilter() {
    const params = new URLSearchParams(window.location.search);
    return params.get('filter') || 'all';
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
    const urlFilter = getUrlFilter();
    if (urlFilter !== 'all') {
        currentFilter = urlFilter;
        filterBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.filter === urlFilter);
        });
    }
    filterAndSearch();
});
