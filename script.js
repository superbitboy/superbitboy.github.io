'use strict';

// Replace null entries with direct product URLs. Until then, links open the storefront.
// Keys match each card's data-id. Example: 'epic-music': { fab: 'https://…' }
const productLinks = {
  'epic-music': { fab: null, construct: null, itch: 'https://superbitboy.itch.io/epic-rpg-music-pack' },
  'platformer-music': { fab: null, construct: null, itch: 'https://superbitboy.itch.io/platformer-adventure-music-pack' },
  'cozy-music': { fab: null, construct: null, itch: 'https://superbitboy.itch.io/cozy-game-music-pack' },
  'scifi-music': { fab: null, construct: null, itch: 'https://superbitboy.itch.io/sci-fi-action-music-pack' },
  'epic-sfx': { fab: null, construct: null, itch: 'https://superbitboy.itch.io/epic-rpg-sfx-pack' },
  'platformer-sfx': { fab: null, construct: null, itch: 'https://superbitboy.itch.io/platformer-adventure-sfx-pack' },
  'ui-sfx': { fab: null, construct: null, itch: 'https://superbitboy.itch.io/casual-ui-sfx-pack' },
  'scifi-sfx': { fab: null, construct: null, itch: 'https://superbitboy.itch.io/sci-fi-ambience-sfx-pack' },
};

const storefrontLinks = {
  fab: 'https://www.fab.com/',
  itch: 'https://superbitboy.itch.io/',
  construct: 'https://www.construct.net/en/game-assets',
};

const cards = [...document.querySelectorAll('.pack-card')];
const packGroups = [...document.querySelectorAll('[data-pack-group]')];
const filters = [...document.querySelectorAll('[data-filter]')];
const resultCount = document.querySelector('.result-count');
const dialog = document.querySelector('#pack-dialog');
const dialogPlayer = document.querySelector('#dialog-player');
let previousFocus = null;

function filterPacks(type) {
  for (const group of packGroups) group.hidden = type !== 'all' && group.dataset.packGroup !== type;
  for (const card of cards) card.hidden = type !== 'all' && card.dataset.type !== type;
  for (const filter of filters) {
    const active = filter.dataset.filter === type;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  }
  const count = cards.filter(card => !card.hidden).length;
  resultCount.textContent = type === 'all' ? `Showing all ${count} packs` : `Showing ${count} ${type === 'music' ? 'music' : 'sound effect'} packs`;
}

for (const filter of filters) filter.addEventListener('click', () => filterPacks(filter.dataset.filter));

function applyLegacyHash() {
  const legacyType = { '#music-packs': 'music', '#sfx-packs': 'sfx' }[location.hash];
  if (legacyType) {
    filterPacks(legacyType);
    document.querySelector('#packs').scrollIntoView({ behavior: 'instant' });
  }
}
window.addEventListener('hashchange', applyLegacyHash);
applyLegacyHash();

function openPack(id) {
  const card = cards.find(item => item.dataset.id === id);
  if (!card) return;
  previousFocus = document.activeElement;
  const title = card.querySelector('.pack-title').innerText.replace(/\n/g, ' ');
  const sourceImage = card.querySelector('img');
  const preview = card.querySelector('.preview-link');
  const videoId = preview?.hostname === 'youtu.be'
    ? preview.pathname.match(/^\/([A-Za-z0-9_-]{11})\/?$/)?.[1]
    : null;
  document.querySelector('#dialog-title').textContent = title;
  document.querySelector('#dialog-category').textContent = card.dataset.type === 'music' ? 'Background music / BGM' : 'Sound effects / SFX';
  document.querySelector('#dialog-description').textContent = card.querySelector('.pack-description').textContent;
  const dialogImage = document.querySelector('#dialog-image');
  dialogImage.hidden = Boolean(videoId);
  dialogPlayer.hidden = !videoId;
  dialogPlayer.replaceChildren();
  if (videoId) {
    const frame = document.createElement('iframe');
    frame.title = `${title} YouTube preview`;
    frame.src = `https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1`;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allow = 'encrypted-media; picture-in-picture';
    frame.allowFullscreen = true;
    dialogPlayer.append(frame);
  } else {
    dialogImage.src = sourceImage.getAttribute('src');
    dialogImage.alt = sourceImage.alt;
  }
  document.querySelector('#dialog-tags').replaceChildren(...[...card.querySelectorAll('.pack-tags span')].map(tag => tag.cloneNode(true)));
  const dialogPreview = document.querySelector('#dialog-preview');
  dialogPreview.replaceChildren(...(preview ? [preview.cloneNode(true)] : []));
  dialogPreview.hidden = !preview;
  const storeContainer = document.querySelector('#dialog-store-links');
  storeContainer.replaceChildren();
  for (const [key, name] of [['fab', 'Fab'], ['itch', 'itch.io'], ['construct', 'Construct Asset Store']]) {
    const productUrl = productLinks[id]?.[key];
    const element = document.createElement('a');
    element.className = 'store-link';
    element.href = productUrl || storefrontLinks[key];
    element.target = '_blank';
    element.rel = 'noopener noreferrer';
    const storeName = document.createElement('span');
    storeName.textContent = name;
    const status = document.createElement('span');
    status.textContent = productUrl ? 'View listing ↗' : 'Visit store ↗';
    element.append(storeName, status);
    storeContainer.append(element);
  }
  dialog.scrollTop = 0;
  dialog.showModal();
  document.body.classList.add('dialog-open');
  dialog.querySelector('.dialog-close').focus({ preventScroll: true });
}

for (const button of document.querySelectorAll('[data-open]')) button.addEventListener('click', () => openPack(button.dataset.open));
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  dialogPlayer.replaceChildren();
  document.body.classList.remove('dialog-open');
  if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
});
document.querySelector('#year').textContent = String(new Date().getFullYear());
