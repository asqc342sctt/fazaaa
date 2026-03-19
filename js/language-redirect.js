(function() {
  // Get browser language.
  const userLang = navigator.language || navigator.userLanguage;

  // Check if it's an Arabic language.
  const isArabic = userLang.toLowerCase().startsWith('ar');

  // If the browser language is not Arabic, redirect to the English version.
  if (!isArabic) {
      window.location.href = '/en' + window.location.pathname;
  }
})();
