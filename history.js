// Init icons
lucide.createIcons();

const STORAGE_KEY = 'unlocker_am_history';

function toast(msg, type = 'info') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast show ${type}`;
  setTimeout(() => el.classList.remove('show'), 3000);
}

function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveHistory(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Gagal menyimpan riwayat', e);
  }
}

function renderHistory() {
  const list = getHistory();
  const container = document.getElementById('historyList');
  const emptyState = document.getElementById('emptyState');
  const countEl = document.getElementById('historyCount');
  const clearBtn = document.getElementById('btnClearAll');

  countEl.textContent = `${list.length} Akun Tersimpan`;
  container.innerHTML = '';

  if (list.length === 0) {
    emptyState.style.display = 'block';
    clearBtn.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  clearBtn.style.display = 'inline-flex';

  list.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card history-card';

    const dateFormatted = item.timestamp 
      ? new Date(item.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      : '-';

    card.innerHTML = `
      <div class="history-header">
        <div class="history-email">
          <i data-lucide="mail" class="item-icon"></i>
          <strong>${item.email || 'Email Tidak Diketahui'}</strong>
        </div>
        <button class="btn-delete-item" onclick="deleteHistoryItem(${index})" title="Hapus riwayat ini" aria-label="Hapus item">
          <i data-lucide="x"></i>
        </button>
      </div>

      <div class="history-details">
        <div class="detail-row">
          <span class="detail-label">UID</span>
          <span class="detail-value">${item.uid || '-'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">KEDALUWARSA</span>
          <span class="detail-value">${item.expiry || '-'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">ORDER ID</span>
          <span class="detail-value">${item.order || '-'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">WAKTU UNLOCK</span>
          <span class="detail-value">${dateFormatted}</span>
        </div>
      </div>

      <div class="history-actions">
        <button class="btn-outline btn-sm" onclick="copyHistoryToken('${item.token}')">
          <i data-lucide="copy"></i> Salin Token
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  lucide.createIcons();
}

function copyHistoryToken(token) {
  if (!token) return toast('Token tidak ditemukan', 'error');
  navigator.clipboard.writeText(token);
  toast('Token berhasil disalin!', 'success');
}

// Fitur Baru: Hapus riwayat secara individual
function deleteHistoryItem(index) {
  let list = getHistory();
  if (index >= 0 && index < list.length) {
    const deletedEmail = list[index].email;
    list.splice(index, 1);
    saveHistory(list);
    renderHistory();
    toast(`Riwayat ${deletedEmail || ''} dihapus`, 'info');
  }
}

// Hapus semua riwayat
function clearAllHistory() {
  if (confirm('Apakah Anda yakin ingin menghapus SEMUA riwayat unlock?')) {
    localStorage.removeItem(STORAGE_KEY);
    renderHistory();
    toast('Semua riwayat telah dibersihkan', 'success');
  }
}

// Initial Render
document.addEventListener('DOMContentLoaded', renderHistory);