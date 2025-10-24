



document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});




document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById('story-modal');
  if (!modal) return; // falls Modal-Container fehlt

  const modalBody = modal.querySelector('.story-modal-body');
  const closeBtn = modal.querySelector('.close-modal');

  document.querySelectorAll('.story-card').forEach(card => {
    const content = card.querySelector('.story-content');
    const fade = card.querySelector('.fade-out');
    const btn = card.querySelector('.toggle-btn');

    if (!btn) return; // safety

    // nur zeigen, wenn Text länger als Vorschauhöhe
    if (content.scrollHeight > content.clientHeight) {
      card.classList.add('needs-expand');
    } else {
      fade?.style?.setProperty('display', 'none');
      btn.style.display = 'none';
    }

    // Klick öffnet Modal
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      openStoryModal(card);
    });
  });

  function openStoryModal(card) {
    const clone = card.cloneNode(true);
    clone.querySelectorAll('.toggle-btn, .fade-out').forEach(el => el.remove());

    modalBody.innerHTML = '';
    modalBody.appendChild(clone);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeStoryModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeStoryModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeStoryModal();
  });
});
