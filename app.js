(() => {
  'use strict';
  const slides = [...document.querySelectorAll('.slide')];
  if (!slides.length) return;
  document.documentElement.classList.add('js');
  const total = slides.length;
  const byId = id => document.getElementById(id);
  const previous = byId('previous-button');
  const next = byId('next-button');
  const contents = byId('contents-dialog');
  const sources = byId('sources-dialog');
  const notesPanel = byId('notes-panel');
  const notesButton = byId('notes-button');
  const fullscreen = byId('fullscreen-button');
  let current = 0;
  let notesOpen = false;
  let dialogTrigger = null;
  let metricFrame = 0;
  const metricCache = new WeakMap();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const cleanIndex = index => Math.max(0, Math.min(total - 1, index));
  const indexFromHash = () => {
    const match = /^#slide-(\d+)$/.exec(location.hash);
    return match ? cleanIndex(Number(match[1]) - 1) : 0;
  };

  function getMetric(element) {
    if (metricCache.has(element)) return metricCache.get(element);
    const node = [...element.childNodes].find(child => child.nodeType === Node.TEXT_NODE && /\d/.test(child.textContent));
    const match = node && /^(\s*[^0-9\-]*?)(-?\d+(?:\.\d+)?)(.*?)(\s*)$/.exec(node.textContent);
    if (!match) return null;
    const metric = {
      node,
      target: Number(match[2]),
      decimals: match[2].split('.')[1]?.length || 0,
      prefix: match[1],
      suffix: match[3],
      trailing: match[4]
    };
    metricCache.set(element, metric);
    return metric;
  }

  function metricText(metric, value) {
    return `${metric.prefix}${value.toFixed(metric.decimals)}${metric.suffix}${metric.trailing}`;
  }

  function slideMetrics(slide) {
    return [...slide.querySelectorAll('.metric-number')]
      .map(getMetric).filter(Boolean);
  }

  function resetSlideMetrics(slide) {
    for (const metric of slideMetrics(slide)) metric.node.textContent = metricText(metric, 0);
  }

  function animateSlideMetrics(slide) {
    const metrics = slideMetrics(slide);
    if (reducedMotion.matches) {
      metrics.forEach(metric => { metric.node.textContent = metricText(metric, metric.target); });
      return;
    }
    if (!metrics.length) return;
    const duration = 800;
    const stagger = 60;
    let startTime = null;
    const tick = time => {
      if (slide !== slides[current]) { metricFrame = 0; return; }
      if (startTime === null) startTime = time;
      const elapsed = time - startTime;
      let complete = true;
      metrics.forEach((metric, index) => {
        const progress = Math.max(0, Math.min(1, (elapsed - index * stagger) / duration));
        const eased = 1 - (1 - progress) ** 3;
        metric.node.textContent = metricText(metric, metric.target * eased);
        if (progress < 1) complete = false;
      });
      if (complete) metricFrame = 0;
      else metricFrame = requestAnimationFrame(tick);
    };
    metricFrame = requestAnimationFrame(tick);
  }

  function showSlide(index, updateHash = true) {
    cancelAnimationFrame(metricFrame);
    metricFrame = 0;
    resetSlideMetrics(slides[current]);
    current = cleanIndex(index);
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
      slide.inert = i !== current;
      if (i === current) slide.scrollTop = 0;
    });
    resetSlideMetrics(slides[current]);
    animateSlideMetrics(slides[current]);
    if (previous) previous.disabled = current === 0;
    if (next) next.disabled = current === total - 1;
    if (byId('slide-count')) byId('slide-count').textContent = `${String(current + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    if (byId('progress-fill')) byId('progress-fill').style.width = `${(current + 1) / total * 100}%`;
    const progressTrack = document.querySelector('[role="progressbar"]');
    if (progressTrack) progressTrack.setAttribute('aria-valuenow', String(current + 1));
    if (byId('notes-copy')) byId('notes-copy').textContent = slides[current].querySelector('.speaker-note')?.textContent.trim() || '';
    if (byId('announcer')) byId('announcer').textContent = `สไลด์ ${current + 1} จาก ${total}: ${slides[current].dataset.title}`;
    if (byId('contents-list')) {
      byId('contents-list').querySelectorAll('button').forEach((button, i) => {
        button.classList.toggle('selected', i === current);
        if (i === current) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
      });
    }
    const targetHash = `#slide-${current + 1}`;
    if (updateHash && location.hash !== targetHash) location.hash = targetHash;
    window.PhetpriContours?.setActive(current === 0);
  }

  function openDialog(dialog, trigger) {
    if (!dialog || typeof dialog.showModal !== 'function') return;
    dialogTrigger = trigger;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector('.close-dialog')?.focus({ preventScroll: true });
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    dialog.close();
    dialogTrigger?.focus({ preventScroll: true });
  }

  for (const dialog of [contents, sources]) {
    if (!dialog) continue;
    dialog.querySelector('.close-dialog')?.addEventListener('click', () => closeDialog(dialog));
    dialog.addEventListener('close', () => dialogTrigger?.focus({ preventScroll: true }));
  }

  slides.forEach((slide, i) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    const number = document.createElement('span');
    number.textContent = String(i + 1).padStart(2, '0');
    button.append(number, document.createTextNode(slide.dataset.title || `สไลด์ ${i + 1}`));
    button.addEventListener('click', () => { closeDialog(contents); showSlide(i); });
    item.append(button);
    byId('contents-list')?.append(item);
  });

  previous?.addEventListener('click', () => showSlide(current - 1));
  next?.addEventListener('click', () => showSlide(current + 1));
  document.querySelector('.start-button')?.addEventListener('click', () => showSlide(1));
  document.querySelectorAll('[data-goto]').forEach(button => button.addEventListener('click', () => showSlide(Number(button.dataset.goto))));
  byId('contents-button')?.addEventListener('click', event => openDialog(contents, event.currentTarget));
  byId('sources-button')?.addEventListener('click', event => openDialog(sources, event.currentTarget));
  notesButton?.addEventListener('click', () => {
    notesOpen = !notesOpen;
    if (notesPanel) notesPanel.hidden = !notesOpen;
    notesButton.setAttribute('aria-pressed', String(notesOpen));
  });

  fullscreen?.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch (_) {}
  });

  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || contents?.open || sources?.open) return;
    const interactive = event.target.closest('button,a,input,textarea,select,[contenteditable]');
    if (['ArrowRight', 'PageDown'].includes(event.key)) { event.preventDefault(); showSlide(current + 1); }
    else if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); showSlide(current - 1); }
    else if (event.key === 'Home' && !interactive) { event.preventDefault(); showSlide(0); }
    else if (event.key === 'End' && !interactive) { event.preventDefault(); showSlide(total - 1); }
    else if (event.key === ' ' && !interactive) { event.preventDefault(); showSlide(current + 1); }
    else if (event.key === 'Escape' && notesOpen) {
      notesOpen = false;
      if (notesPanel) notesPanel.hidden = true;
      notesButton?.setAttribute('aria-pressed', 'false');
    }
  });

  let start = null;
  const main = byId('slides');
  main?.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || !event.isPrimary || event.target.closest('button,a,.three-stage-wrap,#gps-stage')) return;
    start = { x: event.clientX, y: event.clientY, id: event.pointerId, time: performance.now() };
  }, { passive: true });
  main?.addEventListener('pointerup', event => {
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6 && performance.now() - start.time < 900) {
      showSlide(current + (dx < 0 ? 1 : -1));
    }
    start = null;
  }, { passive: true });

  window.addEventListener('hashchange', () => {
    if (indexFromHash() === current) return;
    showSlide(indexFromHash(), false);
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) showSlide(indexFromHash(), false);
  });

  showSlide(indexFromHash(), false);
})();
