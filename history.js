// init icons
lucide.createIcons();

function toast(msg, type = 'info') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = `toast show ${type}`;
  setTimeout(() => el.classList.remove('show'), 3500);
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('unlocker_am_history')) || [];
  } catch {
    return [];
  }
}

function renderHistory() {
  const listEl = document.getElementById('historyList');
  if (!listEl) return;
  
  const history = getHistory();
  if (history.length === 0) {
    listEl.innerHTML = '<p class="history-empty">Belum ada history.</p>';
    return;
  }
  
  // render item dengan detail lengkap
  listEl.innerHTML = history.map(item => `
    <div class="history-item">
      
      <div class="history-top">
        <span class="history-email">${item.email}</span>
        <span class="history-date">${item.date}</span>
      </div>

      <div class="history-grid">
        <div class="grid-row">
          <span class="grid-label">UID</span>
          <span class="grid-val">${item.uid || '-'}</span>
        </div>
        <div class="grid-row">
          <span class="grid-label">EXPIRES</span>
          <span class="grid-val text-green">${item.expiry || '-'}</span>
        </div>
        <div class="grid-row">
          <span class="grid-label">ORDER ID</span>
          <span class="grid-val">${item.orderId || '-'}</span>
        </div>
      </div>

      <div class="history-token-box">
        <span class="grid-label">ID TOKEN</span>
        <div class="token-string" title="${item.token || ''}">${item.token || '-'}</div>
        <button class="btn-copy-token" onclick="copyHistToken('${item.token}')">
          Salin Token
        </button>
      </div>

    </div>
  `).join('');
}

function copyHistToken(token) {
  if (!token) return;
  navigator.clipboard.writeText(token);
  toast('Token berhasil disalin', 'success');
}

function clearHistory() {
  if (!confirm('Hapus semua riwayat unlock di perangkat ini?')) return;
  localStorage.removeItem('unlocker_am_history');
  renderHistory();
  toast('History dibersihkan', 'success');
}

// jalanin pas halaman di-load
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  renderHistory();
});