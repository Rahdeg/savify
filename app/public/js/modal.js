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
    msgEl.textContent = text;
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
          form.reset();
          window.closeCreateGoalModal();
          window.location.href = '/goals';
        }
      } catch (err) {
        showMessage(err.message || 'Network error', 'error');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
});

