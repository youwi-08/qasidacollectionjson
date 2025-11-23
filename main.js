// ------------------ Font Size ------------------
(function() {
  const minFontSize = 1, maxFontSize = 2.5;
  let currentFontSize = 1.2;
  const paragraphs = document.querySelectorAll('.container p');

  function setFontSize(size) {
    size = Math.max(minFontSize, Math.min(maxFontSize, size));
    currentFontSize = size;
    paragraphs.forEach(p => p.style.fontSize = size + 'rem');
    applyAlternateLineColour();
  }

  window.changeFontSize = delta => setFontSize(currentFontSize + 0.1 * delta);
  setFontSize(currentFontSize);
})();

// ------------------ Alternate Line Colour ------------------
function applyAlternateLineColour() {
  const paragraphs = document.querySelectorAll('.container p');
  const lightColor = "#256328", darkColor = "#53A2A9";
  const isDark = document.body.classList.contains('dark-mode');
  paragraphs.forEach(p => {
    if (p.classList.contains('alt')) p.style.color = isDark ? darkColor : lightColor;
    else p.style.color = '';
  });
}
applyAlternateLineColour();

// ------------------ Dark Mode ------------------
(function() {
  const toggleButton = document.getElementById('darkModeToggle');
  const darkModeClass = 'dark-mode';

  function applySystemPreference() {
    if(window.matchMedia('(prefers-color-scheme: dark)').matches) document.body.classList.add(darkModeClass);
    else document.body.classList.remove(darkModeClass);
    applyAlternateLineColour();
  }

  applySystemPreference();

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if(!toggleButton.dataset.manualToggle) {
      document.body.classList.toggle(darkModeClass, e.matches);
      applyAlternateLineColour();
    }
  });

  toggleButton.addEventListener('click', () => {
    document.body.classList.toggle(darkModeClass);
    toggleButton.dataset.manualToggle = 'true';
    applyAlternateLineColour();
  });
})();

// ------------------ Hamburger Menu ------------------
(function() {
  const hamburgerButton = document.getElementById('hamburgerButton');
  const navPane = document.getElementById('navPane');

  hamburgerButton.addEventListener('click', e => {
    e.stopPropagation();
    navPane.classList.toggle('show');
  });

  document.addEventListener('click', () => navPane.classList.remove('show'));
  navPane.addEventListener('click', e => e.stopPropagation());
})();

// ------------------ Translation / Transliteration Toggle ------------------
document.getElementById("translationToggle").addEventListener("click", () => {
  document.querySelectorAll(".container .translation").forEach(el => {
    el.style.display = (el.style.display === "none" || el.style.display === "") ? "block" : "none";
  });
});
document.getElementById("transliterationToggle").addEventListener("click", () => {
  document.querySelectorAll(".container .transliteration").forEach(el => {
    el.style.display = (el.style.display === "none" || el.style.display === "") ? "block" : "none";
  });
});

// ------------------ Share Menu ------------------
(function() {
  const shareButton = document.getElementById('shareButton');
  const shareMenu = document.getElementById('shareMenu');

  shareButton.addEventListener('click', e => {
    e.stopPropagation();
    shareMenu.style.display = (shareMenu.style.display === 'flex') ? 'none' : 'flex';
  });

  document.addEventListener('click', () => shareMenu.style.display = 'none');
})();