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

  if (toggleButton) {
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
  }
})();

// ------------------ Hamburger Menu ------------------
(function() {
  const hamburgerButton = document.getElementById('hamburgerButton');
  const navPane = document.getElementById('navPane');

  if (hamburgerButton && navPane) {
    hamburgerButton.addEventListener('click', e => {
      e.stopPropagation();
      navPane.classList.toggle('show');
    });

    document.addEventListener('click', () => navPane.classList.remove('show'));
    navPane.addEventListener('click', e => e.stopPropagation());
  }
})();

// ------------------ Translation / Transliteration Toggle ------------------
const translationToggle = document.getElementById("translationToggle");
if (translationToggle) {
  translationToggle.addEventListener("click", () => {
    document.querySelectorAll(".container .translation").forEach(el => {
      el.style.display = (el.style.display === "none" || el.style.display === "") ? "block" : "none";
    });
  });
}
const transliterationToggle = document.getElementById("transliterationToggle");
if (transliterationToggle) {
  transliterationToggle.addEventListener("click", () => {
    document.querySelectorAll(".container .transliteration").forEach(el => {
      el.style.display = (el.style.display === "none" || el.style.display === "") ? "block" : "none";
    });
  });
}

// ------------------ Share Menu ------------------
(function() {
  const shareButton = document.getElementById('shareButton');
  const shareMenu = document.getElementById('shareMenu');

  if (shareButton && shareMenu) {
    shareButton.addEventListener('click', e => {
      e.stopPropagation();
      shareMenu.style.display = (shareMenu.style.display === 'flex') ? 'none' : 'flex';
    });

    document.addEventListener('click', () => shareMenu.style.display = 'none');
  }
})();

// ------------------ Load Poems List and Search/Filter ------------------
(function() {
  const poemListElement = document.getElementById('poemList');
  if (!poemListElement) return;

  let poems = [];
  let filteredPoems = [];

  const searchInput = document.getElementById('searchInput');
  const tagFilter = document.getElementById('tagFilter');

  function renderPoemList(list) {
    poemListElement.innerHTML = '';
    if (list.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No poems found.';
      poemListElement.appendChild(li);
      return;
    }
    list.forEach(poem => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = poem.file ? new URL(poem.file, window.location.origin).href : '#';
      a.textContent = poem.title || 'Untitled';
      li.appendChild(a);
      poemListElement.appendChild(li);
    });
  }

  function filterPoems() {
    let filtered = poems;

    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    if (searchTerm) {
      filtered = filtered.filter(poem => {
        return (poem.title && poem.title.toLowerCase().includes(searchTerm)) ||
               (poem.author && poem.author.toLowerCase().includes(searchTerm)) ||
               (poem.tags && poem.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
      });
    }

    if (tagFilter && tagFilter.value) {
      const selectedTag = tagFilter.value.toLowerCase();
      filtered = filtered.filter(poem => poem.tags && poem.tags.some(tag => tag.toLowerCase() === selectedTag));
    }

    filteredPoems = filtered;
    renderPoemList(filteredPoems);
  }

  fetch('../poems-list.json')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load poems list');
      return response.json();
    })
    .then(data => {
      poems = Array.isArray(data) ? data : [];
      renderPoemList(poems);
    })
    .catch(err => {
      poemListElement.innerHTML = '<li>Could not load poems list.</li>';
      console.error(err);
    });

  if (searchInput) {
    searchInput.addEventListener('input', filterPoems);
  }
  if (tagFilter) {
    tagFilter.addEventListener('change', filterPoems);
  }
})();