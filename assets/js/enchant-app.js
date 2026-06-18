(function () {
  const RARITY_ORDER = ['Simple', 'Unique', 'Elite', 'Legendary', 'Fabled', 'Ultimate'];
  const RARITY_COLOR = {
    Simple: '#c6c6c6',
    Unique: '#55ff55',
    Elite: '#55ffff',
    Legendary: '#ffaa00',
    Fabled: '#ff66ff',
    Ultimate: '#ff5555'
  };
  const TAG_ORDER = ['Sword','Axe','Bow','Crossbow','Trident','Weapon','Armor','Helmet','Chestplate','Leggings','Boots','Elytra','Pickaxe','Hoe','Shovel','Tool','Fishing Rod'];

  const data = (typeof ENCHANT_DATA !== 'undefined' ? ENCHANT_DATA : []).slice().sort((a, b) => a.no - b.no);

  const state = {
    search: '',
    rarities: new Set(),
    tags: new Set()
  };

  const els = {
    search: document.getElementById('searchInput'),
    rarityChips: document.getElementById('rarityChips'),
    tagChips: document.getElementById('tagChips'),
    grid: document.getElementById('cardGrid'),
    resultCount: document.getElementById('resultCount'),
    empty: document.getElementById('emptyState'),
    totalCount: document.getElementById('totalCount'),
    resetBtn: document.getElementById('resetFilters')
  };

  els.totalCount.textContent = data.length;

  function buildRarityChips() {
    RARITY_ORDER.forEach((r) => {
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.textContent = r;
      chip.dataset.rarity = r;
      chip.addEventListener('click', () => {
        if (state.rarities.has(r)) state.rarities.delete(r);
        else state.rarities.add(r);
        syncChipStyles();
        render();
      });
      els.rarityChips.appendChild(chip);
    });
  }

  function buildTagChips() {
    const present = new Set(data.flatMap((d) => d.tags));
    const ordered = TAG_ORDER.filter((t) => present.has(t)).concat(
      [...present].filter((t) => !TAG_ORDER.includes(t)).sort()
    );
    ordered.forEach((t) => {
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.textContent = t;
      chip.dataset.tag = t;
      chip.addEventListener('click', () => {
        if (state.tags.has(t)) state.tags.delete(t);
        else state.tags.add(t);
        syncChipStyles();
        render();
      });
      els.tagChips.appendChild(chip);
    });
  }

  function syncChipStyles() {
    els.rarityChips.querySelectorAll('.chip').forEach((chip) => {
      const r = chip.dataset.rarity;
      const active = state.rarities.has(r);
      chip.classList.toggle('active', active);
      chip.style.background = active ? RARITY_COLOR[r] : '';
      chip.style.borderColor = active ? RARITY_COLOR[r] : '';
      chip.style.color = active ? '#0c0c0d' : '';
    });
    els.tagChips.querySelectorAll('.chip').forEach((chip) => {
      chip.classList.toggle('active', state.tags.has(chip.dataset.tag));
    });
  }

  function matches(item) {
    if (state.rarities.size && !state.rarities.has(item.rarity)) return false;
    if (state.tags.size && !item.tags.some((t) => state.tags.has(t))) return false;
    if (state.search) {
      const q = state.search.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.desc.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  }

  function cardHTML(item) {
    const color = RARITY_COLOR[item.rarity] || '#888';
    const tags = item.tags.map((t) => `<span class="item-pill">${t}</span>`).join('');
    return `
      <article class="card" style="--card-color:${color}">
        <span class="card-no">#${String(item.no).padStart(3, '0')}</span>
        <div class="card-head">
          <div class="card-name">${escapeHTML(item.name)}</div>
          <span class="rarity-badge">${item.rarity}</span>
        </div>
        <p class="card-desc">${escapeHTML(item.desc)}</p>
        <div class="card-tags">${tags}</div>
        <div class="card-foot">
          <span class="level-tag"><span class="orb">●</span>LV MAX ${item.maxLevel}</span>
          <span>${escapeHTML(item.appliesRaw)}</span>
        </div>
      </article>`;
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function render() {
    const filtered = data.filter(matches);
    els.grid.innerHTML = filtered.map(cardHTML).join('');
    els.resultCount.textContent = `menampilkan ${filtered.length} dari ${data.length} enchantment`;
    els.empty.hidden = filtered.length !== 0;
  }

  els.search.addEventListener('input', (e) => {
    state.search = e.target.value.trim();
    render();
  });

  els.resetBtn.addEventListener('click', () => {
    state.search = '';
    state.rarities.clear();
    state.tags.clear();
    els.search.value = '';
    syncChipStyles();
    render();
  });

  buildRarityChips();
  buildTagChips();
  syncChipStyles();
  render();
})();
