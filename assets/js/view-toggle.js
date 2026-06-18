(function () {
  const btnEnchant = document.getElementById('viewBtnEnchant');
  const btnItems = document.getElementById('viewBtnItems');
  const viewEnchant = document.getElementById('view-enchant');
  const viewItems = document.getElementById('view-items');
  if (!btnEnchant || !btnItems) return;

  function show(view) {
    const isEnchant = view === 'enchant';
    viewEnchant.hidden = !isEnchant;
    viewItems.hidden = isEnchant;
    btnEnchant.classList.toggle('active', isEnchant);
    btnItems.classList.toggle('active', !isEnchant);
    btnEnchant.setAttribute('aria-selected', String(isEnchant));
    btnItems.setAttribute('aria-selected', String(!isEnchant));
  }

  btnEnchant.addEventListener('click', () => show('enchant'));
  btnItems.addEventListener('click', () => show('items'));
})();
