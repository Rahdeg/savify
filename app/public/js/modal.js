// public/js/modal.js

// Keep things safe by waiting for DOM ready
document.addEventListener('DOMContentLoaded', function () {
  // modal open/close helpers (exposed globally so templates can call them)
  window.openCreateGoalModal = function () {
    const modal = document.getElementById('createGoalModal');
    if (!modal) return;
    modal.classList.remove('hidden');
  };

  window.closeCreateGoalModal = function () {
    const modal = document.getElementById('createGoalModal');
    if (!modal) return;
    modal.classList.add('hidden');
  };

  // optional click outside to close
  const modalEl = document.getElementById('createGoalModal');
  if (modalEl) {
    modalEl.addEventListener('click', function (e) {
      if (e.target === modalEl) modalEl.classList.add('hidden');
    });
  }

  // set min date to today on some date inputs (if present)
  const today = new Date().toISOString().split('T')[0];
  ['startDate', 'endDate', 'withdrawalDate'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.min = today;
  });

  // Form submission via fetch - prevents redirect and shows inline messages
  const form = document.getElementById('createGoalForm');
  const msgEl = document.getElementById('goalModalMessage');
  const submitBtn = document.getElementById('submitGoalBtn');

  function showMessage(text, type) {
    if (!msgEl) return;
    msgEl.textContent = '';
    // reset visibility and styling
    msgEl.classList.remove('hidden',
      // color classes we may add below
      'text-red-700', 'bg-red-100',
      'text-green-700', 'bg-green-100',
      'p-2', 'rounded'
    );

    // common styling: padding and rounded corners
    msgEl.classList.add('p-2', 'rounded');

    if (type === 'error') {
      // red text on light-red background
      msgEl.classList.add('text-red-700', 'bg-red-100');
    } else {
      // green text on light-green background
      msgEl.classList.add('text-green-700', 'bg-green-100');
    }
  }

  // escape text to prevent HTML injection when inserting user/server strings
  function escapeHtml(unsafe) {
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Convert YYYY-MM-DD to human readable with ordinal day, e.g. "29th of April 2026"
  function formatHumanDate(dateStr) {
    if (!dateStr) return '';
    // Validate simple YYYY-MM-DD
    if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(dateStr)) return escapeHtml(dateStr);
    const [y, m, d] = dateStr.split('-');
    const day = Number(d);
    if (Number.isNaN(day)) return escapeHtml(dateStr);

    function ordinal(n) {
      const v = n % 100;
      if (v >= 11 && v <= 13) return 'th';
      switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    }

    const monthNames = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];
    const monthIndex = Number(m) - 1;
    const monthName = monthNames[monthIndex] || m;

    return `${day}${ordinal(day)} of ${monthName} ${y}`;
  }

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (submitBtn) submitBtn.disabled = true;
      if (msgEl) msgEl.classList.add('hidden');

      try {
        const fd = new FormData(form);
        const params = new URLSearchParams();
        for (const pair of fd.entries()) params.append(pair[0], pair[1]);

        const res = await fetch(form.action || '/goals/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString()
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          showMessage(data.error || data.message || 'An error occurred', 'error');
        } else {
          // show success and include formatted bold withdrawal date when present
          const rawDate = data && data.scheduled_withdrawal_date;
          if (rawDate) {
            const human = formatHumanDate(rawDate);
            // build safe HTML: escape the human text, wrap in <strong>
            const safeText = escapeHtml(data.message || 'Goal created successfully');
            msgEl.innerHTML = `${safeText}, your scheduled withdrawal date is <strong>${escapeHtml(human)}</strong>`;
            // apply success styling
            msgEl.classList.remove('hidden');
            msgEl.classList.add('p-2', 'rounded', 'text-green-700', 'bg-green-100');
          } else {
            showMessage(data.message || 'Goal created successfully', 'info');
          }
          form.reset();
        }
      } catch (err) {
        showMessage(err.message || 'Network error', 'error');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
});

