import '../style/panel.css';

/**
 * @param {HTMLElement} root
 */
export function createDetailPanel(root) {
  const el = document.createElement('aside');
  el.className = 'detail-panel';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <div class="detail-panel__header">
      <span class="detail-panel__node-id" data-field="nodeId">◈ NODE —</span>
      <span class="detail-panel__status" data-field="status"></span>
    </div>
    <div class="detail-panel__preview" data-field="preview"></div>
    <h2 class="detail-panel__title" data-field="title"></h2>
    <p class="detail-panel__subtitle" data-field="subtitle"></p>
    <p class="detail-panel__desc" data-field="desc"></p>
    <div class="detail-panel__stack-label">STACK</div>
    <div class="detail-panel__stack" data-field="stack"></div>
    <div class="detail-panel__actions">
      <a class="detail-panel__btn detail-panel__btn--primary" data-field="link" href="#" target="_blank" rel="noreferrer">▶ VIEW PROJECT</a>
      <button type="button" class="detail-panel__btn detail-panel__btn--ghost" data-action="back">← BACK</button>
    </div>
  `;
  root.appendChild(el);

  const fields = {
    nodeId: el.querySelector('[data-field="nodeId"]'),
    status: el.querySelector('[data-field="status"]'),
    preview: el.querySelector('[data-field="preview"]'),
    title: el.querySelector('[data-field="title"]'),
    subtitle: el.querySelector('[data-field="subtitle"]'),
    desc: el.querySelector('[data-field="desc"]'),
    stack: el.querySelector('[data-field="stack"]'),
    link: el.querySelector('[data-field="link"]'),
  };

  function setStatus(node) {
    const st = el.querySelector('.detail-panel__status');
    st.className = 'detail-panel__status';
    if (node.status === 'complete') {
      st.textContent = 'COMPLETE';
      st.classList.add('detail-panel__status--complete');
    } else if (node.status === 'wip') {
      st.textContent = 'WIP';
      st.classList.add('detail-panel__status--wip');
    } else {
      st.textContent = 'LOCKED';
      st.classList.add('detail-panel__status--locked');
    }
  }

  return {
    el,
    open(node) {
      fields.nodeId.textContent = `◈ NODE ${node.label}`;
      setStatus(node);
      fields.preview.style.background = node.previewColor || '#4e7fff';
      fields.title.textContent = node.title;
      fields.subtitle.textContent = node.subtitle;
      fields.desc.textContent = node.description;
      fields.stack.innerHTML = '';
      for (const tag of node.stack || []) {
        const pill = document.createElement('span');
        pill.className = 'detail-panel__pill';
        pill.textContent = tag;
        fields.stack.appendChild(pill);
      }
      const linkBtn = fields.link;
      if (node.link && node.status !== 'locked') {
        linkBtn.href = node.link;
        linkBtn.style.display = 'inline-flex';
      } else {
        linkBtn.removeAttribute('href');
        linkBtn.style.display = 'none';
      }
      el.classList.add('is-open');
      el.setAttribute('aria-hidden', 'false');
    },
    close() {
      el.classList.remove('is-open');
      el.setAttribute('aria-hidden', 'true');
    },
    onBack(cb) {
      el.querySelector('[data-action="back"]').addEventListener('click', cb);
    },
  };
}
