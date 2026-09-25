import { projects, skills } from './content.js';

const menuToggle = document.querySelector('.menu-toggle');
const siteMenu = document.querySelector('#site-menu');
const themeToggle = document.querySelector('.theme-toggle');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];
const projectList = document.querySelector('#project-list');
const skillsList = document.querySelector('#skills-list');

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
