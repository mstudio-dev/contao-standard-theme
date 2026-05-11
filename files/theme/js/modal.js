/**
 * modal.js — Accessible Modal-Dialog
 * Contao Standard Theme
 *
 * Markup-Vorlage (kopieren und in Twig einbetten):
 *
 *   <!-- Trigger -->
 *   <button class="btn btn--primary" data-modal-open="modal-demo"
 *           aria-haspopup="dialog">
 *     Dialog öffnen
 *   </button>
 *
 *   <!-- Modal (außerhalb des Hauptinhalts, z.B. vor </body>) -->
 *   <div class="modal-overlay" id="modal-demo" role="dialog"
 *        aria-modal="true" aria-labelledby="modal-demo-title"
 *        aria-describedby="modal-demo-desc" hidden>
 *     <div class="modal" data-focus-trap>
 *       <div class="modal__header">
 *         <h2 class="modal__title" id="modal-demo-title">Titel</h2>
 *         <button class="modal__close" aria-label="Dialog schließen"
 *                 data-modal-close>
 *           <!-- SVG × Icon -->
 *           <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20">
 *             <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor"
 *                   stroke-width="2" stroke-linecap="round"/>
 *           </svg>
 *         </button>
 *       </div>
 *       <div class="modal__body" id="modal-demo-desc">
 *         <p>Inhalt…</p>
 *       </div>
 *       <div class="modal__footer">
 *         <button class="btn btn--ghost" data-modal-close>Abbrechen</button>
 *         <button class="btn btn--primary">Bestätigen</button>
 *       </div>
 *     </div>
 *   </div>
 *
 * WCAG: 1.3.1, 2.1.1, 2.1.2, 4.1.2 (ARIA Dialog Pattern)
 */

'use strict';

import { trapFocus, releaseFocus, onEscape, announceToScreenReader } from './a11y.js';

class Modal {
  /**
   * @param {HTMLElement} overlay — .modal-overlay / [role="dialog"]
   */
  constructor(overlay) {
    this.overlay    = overlay;
    this.dialog     = overlay.querySelector('.modal, [data-focus-trap]');
    this.closeButtons = overlay.querySelectorAll('[data-modal-close]');

    this._cleanupEsc = null;
    this._bindEvents();
  }

  /* ── Events ──────────────────────────────────────────────────────────────── */

  _bindEvents() {
    /* Schließen per Close-Button */
    this.closeButtons.forEach((btn) => {
      btn.addEventListener('click', () => this.close());
    });

    /* Klick auf Overlay-Hintergrund schließt Modal */
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
  }

  /* ── Öffnen ──────────────────────────────────────────────────────────────── */

  open() {
    this.overlay.removeAttribute('hidden');

    /* Klasse für CSS-Transition (is-open) */
    requestAnimationFrame(() => {
      this.overlay.classList.add('is-open');
    });

    /* body-Scroll sperren */
    document.body.style.overflow = 'hidden';

    /* Fokus-Trap aktivieren */
    if (this.dialog) {
      trapFocus(this.dialog);
    }

    /* Escape-Taste */
    this._cleanupEsc = onEscape(() => this.close());

    /* Screen-Reader-Ankündigung */
    const title = this.overlay.querySelector('[id$="-title"]');
    if (title) {
      announceToScreenReader(`Dialog geöffnet: ${title.textContent.trim()}`);
    }
  }

  /* ── Schließen ───────────────────────────────────────────────────────────── */

  close() {
    this.overlay.classList.remove('is-open');

    /* Warten auf CSS-Transition, dann verstecken */
    const onTransitionEnd = () => {
      this.overlay.setAttribute('hidden', '');
      this.overlay.removeEventListener('transitionend', onTransitionEnd);
    };

    /* Prüfen, ob Transitions aktiviert sind */
    const duration = parseFloat(
      getComputedStyle(this.overlay).transitionDuration
    );

    if (duration > 0) {
      this.overlay.addEventListener('transitionend', onTransitionEnd, { once: true });
    } else {
      this.overlay.setAttribute('hidden', '');
    }

    /* body-Scroll freigeben */
    document.body.style.overflow = '';

    /* Fokus zurückgeben */
    releaseFocus();

    /* Escape-Handler entfernen */
    if (this._cleanupEsc) {
      this._cleanupEsc();
      this._cleanupEsc = null;
    }

    announceToScreenReader('Dialog geschlossen');
  }

  /* ── Toggle ──────────────────────────────────────────────────────────────── */

  toggle() {
    if (this.overlay.hasAttribute('hidden')) {
      this.open();
    } else {
      this.close();
    }
  }
}

/* ── Registry ─────────────────────────────────────────────────────────────── */

const registry = new Map();

/**
 * Gibt die Modal-Instanz für eine ID zurück (oder erstellt sie).
 *
 * @param {string} id
 * @returns {Modal|null}
 */
export function getModal(id) {
  if (registry.has(id)) return registry.get(id);

  const el = document.getElementById(id);
  if (!el) return null;

  const instance = new Modal(el);
  registry.set(id, instance);
  return instance;
}

/* ── Auto-Initialisierung ─────────────────────────────────────────────────── */

/**
 * Initialisiert alle Trigger und Modal-Elemente im DOM.
 * Trigger: [data-modal-open="modal-id"]
 */
export function initModals(root = document) {
  /* Modal-Overlays registrieren */
  root.querySelectorAll('[role="dialog"].modal-overlay').forEach((el) => {
    if (el.id && !registry.has(el.id)) {
      registry.set(el.id, new Modal(el));
    }
  });

  /* Trigger verdrahten */
  root.querySelectorAll('[data-modal-open]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const id    = trigger.dataset.modalOpen;
      const modal = getModal(id);
      if (modal) modal.open();
    });
  });
}

/* DOM-ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initModals());
} else {
  initModals();
}

export { Modal };
