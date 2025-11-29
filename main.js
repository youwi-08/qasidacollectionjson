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
      // Toggle menu visibility
      shareMenu.style.display = (shareMenu.style.display === 'block') ? 'none' : 'block';
    });

    // Close the menu when clicking outside
    document.addEventListener('click', () => {
      shareMenu.style.display = 'none';
    });

    shareMenu.addEventListener('click', e => e.stopPropagation());
  }
})();

// ------------------ Load Poems List and Search/Filter ------------------
(function() {
  const poemListElement = document.getElementById('poemList');
  if (!poemListElement) return;

  let poems = [];
  let filteredPoems = [];

  const searchInput = document.getElementById('searchInput');
  const tagFilterContainer = document.getElementById('tagFilterContainer');

  function createTagFilters() {
    if (!tagFilterContainer) return;

    const allTags = new Set();
    poems.forEach(poem => {
      if (poem.tags) poem.tags.forEach(tag => allTags.add(tag));
    });

    tagFilterContainer.innerHTML = '';

    const allButton = document.createElement('button');
    allButton.textContent = 'All';
    allButton.dataset.tag = '';
    allButton.className = 'filter-button active';
    tagFilterContainer.appendChild(allButton);

    allTags.forEach(tag => {
      const button = document.createElement('button');
      button.textContent = tag;
      button.dataset.tag = tag.toLowerCase();
      button.className = 'filter-button';
      tagFilterContainer.appendChild(button);
    });

    tagFilterContainer.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        tagFilterContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedTag = btn.dataset.tag;
        filterPoems(selectedTag);
      });
    });
  }

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

function filterPoems(selectedTag = '') {
  // Always start from the full list
  let filtered = Array.isArray(poems) ? [...poems] : [];
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';

  // Apply search first (if present)
  if (searchTerm.length > 0) {
    filtered = filtered.filter(poem =>
      (poem.title && poem.title.toLowerCase().includes(searchTerm)) ||
      (poem.author && poem.author.toLowerCase().includes(searchTerm)) ||
      (poem.tags && poem.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
  }

  // Apply tag filter if a specific tag was provided
  if (selectedTag && selectedTag !== '') {
    const tagLower = selectedTag.toLowerCase();
    filtered = filtered.filter(poem =>
      poem.tags && poem.tags.some(tag => tag.toLowerCase() === tagLower)
    );
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
      createTagFilters();
    })
    .catch(err => {
      poemListElement.innerHTML = '<li>Could not load poems list.</li>';
      console.error(err);
    });

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const activeTag = tagFilterContainer?.querySelector('button.active')?.dataset.tag || '';
    filterPoems(activeTag);
  });
}

})();