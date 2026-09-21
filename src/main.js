import { favoriteArtists, movies, projects, skills, soundtrack } from './content.js';

const menuToggle = document.querySelector('.menu-toggle');
const siteMenu = document.querySelector('#site-menu');
const themeToggle = document.querySelector('.theme-toggle');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];
const revealItems = document.querySelectorAll('.reveal');
const magneticTitle = document.querySelector('.magnetic-title');
const contactSection = document.querySelector('.contact-section');

const projectList = document.querySelector('#project-list');
const skillsList = document.querySelector('#skills-list');
const soundtrackList = document.querySelector('#soundtrack-list');
const artistList = document.querySelector('#artist-list');
const movieList = document.querySelector('#movie-list');

const getMusicAccentClass = (artist) => ({
  'Dean Martin': 'music-dean',
  'Frank Sinatra': 'music-sinatra',
  "Her's": 'music-hers',
}[artist] ?? '');

const setTheme = (theme, persist = false) => {
  const isLight = theme === 'light';
  if (isLight) {
    document.documentElement.dataset.theme = 'light';
  } else {
    delete document.documentElement.dataset.theme;
  }

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
    themeToggle.querySelector('.theme-toggle-label').textContent = isLight ? 'Dark' : 'Light';
  }

  if (persist) localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
};

setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  setTheme(nextTheme, true);
});

if (projectList) {
  projectList.innerHTML = projects.map((project) => `
    <article class="project-row">
      <div class="project-index">${project.number}</div>
      <div class="project-main">
        <p class="project-type">${project.category}</p>
        <h3 class="glow-text">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <p class="project-detail">${project.details}</p>
      </div>
      <div class="project-meta">
        <div class="tag-list">${project.technologies.map((technology) => `<span>${technology}</span>`).join('')}</div>
        <a class="text-link" href="#contact">View case study <span aria-hidden="true">↗</span></a>
        <span class="placeholder">${project.metrics}</span>
      </div>
    </article>
  `).join('');
}

if (soundtrackList) {
  soundtrackList.innerHTML = soundtrack.map((track) => `
    <div class="soundtrack-row ${getMusicAccentClass(track.artist)}${track.youtubeUrl ? '' : ' soundtrack-row-unverified'}" data-verification-status="${track.verificationStatus}">
      <span class="track-number">${track.number}</span>
      ${track.youtubeUrl ? `<a class="track-title" href="${track.youtubeUrl}" target="_blank" rel="noopener noreferrer">${track.title}</a>` : `<span class="track-title">${track.title}</span>`}
      <span class="track-artist">${track.artist}</span>
    </div>
  `).join('');
}

if (artistList) {
  artistList.innerHTML = favoriteArtists.map((artist) => `
    <article class="artist-row ${getMusicAccentClass(artist.name)}">
      <span class="artist-number">${artist.number}</span>
      ${artist.url ? `<a class="artist-portrait-link" href="${artist.url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${artist.name} official link">${artist.imageUrl ? `<span class="artist-portrait"><img src="${artist.imageUrl}" alt="${artist.name}" loading="lazy"></span>` : '<span class="artist-portrait artist-portrait-type" aria-hidden="true">BPH</span>'}</a>` : (artist.imageUrl ? `<span class="artist-portrait"><img src="${artist.imageUrl}" alt="${artist.name}" loading="lazy"></span>` : '<span class="artist-portrait artist-portrait-type" aria-hidden="true">BPH</span>')}
      <div class="artist-copy">${artist.url ? `<a class="artist-name-link glow-text" href="${artist.url}" target="_blank" rel="noopener noreferrer">${artist.name}</a>` : `<h3 class="glow-text">${artist.name}</h3>`}<p>${artist.description}</p></div>
    </article>
  `).join('');
}

if (movieList) {
  movieList.innerHTML = movies.map((movie) => `
    <article class="movie-row">
      <span class="movie-number">${movie.number}</span>
      <div class="movie-poster${movie.imageUrl ? '' : ' movie-poster-type'}">
        ${movie.imageUrl ? `<img src="${movie.imageUrl}" alt="${movie.title} poster" loading="lazy">` : `<span>${movie.title}</span>`}
      </div>
      <h3 class="glow-text">${movie.title}</h3>
      <span class="movie-note">Personal ranking</span>
    </article>
  `).join('');
}

if (skillsList) {
  skillsList.innerHTML = skills.map((group, groupIndex) => `
    <div class="skill-group">
      <p class="skill-label">${String(groupIndex + 1).padStart(2, '0')} / ${group.category}</p>
      <ul class="skill-links">
        ${group.items.map(([name, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer" title="Read official documentation" aria-label="${name} — Read official documentation"><span>${name}</span><span class="skill-doc-link" aria-hidden="true">↗</span></a></li>`).join('')}
      </ul>
    </div>
  `).join('');
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  siteMenu.classList.toggle('is-open', !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    siteMenu.classList.remove('is-open');
  });
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

if (magneticTitle && contactSection) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const letters = [];
  let pointer = null;
  let animationFrame = null;

  magneticTitle.querySelectorAll('.magnetic-line').forEach((line) => {
    const characters = [...line.textContent];
    line.textContent = '';
    characters.forEach((character, index) => {
      const letter = document.createElement('span');
      letter.className = 'magnetic-letter';
      letter.setAttribute('aria-hidden', 'true');
      letter.textContent = character === ' ' ? '\u00a0' : character;
      letter.style.setProperty('--letter-index', index);
      letter.style.setProperty('--pulse-tilt', index % 2 === 0 ? '-1.5deg' : '1.5deg');
      line.append(letter);
      letters.push(letter);
    });
  });

  const resetLetters = () => {
    letters.forEach((letter) => {
      letter.style.setProperty('--letter-x', '0px');
      letter.style.setProperty('--letter-y', '0px');
      letter.style.setProperty('--letter-r', '0deg');
      letter.style.setProperty('--letter-scale', '1');
    });
  };

  const animateLetters = () => {
    animationFrame = null;
    if (reducedMotion.matches || !pointer) {
      resetLetters();
      return;
    }

    letters.forEach((letter) => {
      const bounds = letter.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const distanceX = pointer.x - centerX;
      const distanceY = pointer.y - centerY;
      const distance = Math.hypot(distanceX, distanceY);
      const influence = Math.max(0, 1 - distance / 170);
      const strength = influence * influence;
      letter.style.setProperty('--letter-x', `${(-distanceX * strength * 0.12).toFixed(2)}px`);
      letter.style.setProperty('--letter-y', `${(-distanceY * strength * 0.12).toFixed(2)}px`);
      letter.style.setProperty('--letter-r', `${(distanceX * strength * 0.035).toFixed(2)}deg`);
      letter.style.setProperty('--letter-scale', (1 + strength * 0.035).toFixed(3));
    });
  };

  const queueAnimation = () => {
    if (!animationFrame) animationFrame = requestAnimationFrame(animateLetters);
  };

  contactSection.addEventListener('pointermove', (event) => {
    pointer = { x: event.clientX, y: event.clientY };
    queueAnimation();
  }, { passive: true });

  contactSection.addEventListener('pointerleave', () => {
    pointer = null;
    queueAnimation();
  });

  magneticTitle.addEventListener('pointerdown', () => {
    if (reducedMotion.matches) return;
    magneticTitle.classList.remove('is-pulsing');
    void magneticTitle.offsetWidth;
    magneticTitle.classList.add('is-pulsing');
  });

  magneticTitle.addEventListener('animationend', () => magneticTitle.classList.remove('is-pulsing'));
  reducedMotion.addEventListener('change', queueAnimation);
}
