/* ============================================================
   JEREMY ORTIZ SITE — shared behavior
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- mobile nav toggle ---- */
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  /* ---- mark current page link active ---- */
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });

  /* ---- "waterfall" scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---- gallery slider: exits left, enters from right ---- */
  const slider = document.querySelector('.slider');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.slide'));
    let activeIndex = slides.findIndex(s => s.classList.contains('active'));
    if (activeIndex === -1) activeIndex = 0;

    function goTo(nextIndex) {
      const current = slides[activeIndex];
      current.classList.remove('active');
      current.classList.add('exit-left');

      const next = slides[(nextIndex + slides.length) % slides.length];
      next.classList.remove('exit-left');
      // force reflow so the transform restarts from the right
      next.style.transition = 'none';
      next.style.transform = 'translateX(100%)';
      next.offsetHeight; // reflow
      next.style.transition = '';
      requestAnimationFrame(() => next.classList.add('active'));

      setTimeout(() => current.classList.remove('exit-left'), 700);
      activeIndex = (nextIndex + slides.length) % slides.length;
    }

    document.querySelector('.slider-next')?.addEventListener('click', () => goTo(activeIndex + 1));
    document.querySelector('.slider-prev')?.addEventListener('click', () => goTo(activeIndex - 1));

    // autoplay
    let autoplay = setInterval(() => goTo(activeIndex + 1), 5000);
    slider.addEventListener('mouseenter', () => clearInterval(autoplay));
    slider.addEventListener('mouseleave', () => {
      autoplay = setInterval(() => goTo(activeIndex + 1), 5000);
    });
  }

  /* ---- contact: phone confirm modal before dialing ---- */
  const phoneBtn   = document.querySelector('.phone-trigger');
  const modal       = document.querySelector('.modal-overlay');
  const modalConfirm= document.querySelector('.modal-actions .confirm');
  const modalCancel = document.querySelector('.modal-actions .cancel');

  if (phoneBtn && modal) {
    phoneBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
    });
    modalCancel?.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
    modalConfirm?.addEventListener('click', () => {
      window.location.href = phoneBtn.dataset.tel; // tel:+1...
    });
  }

});