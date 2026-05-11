/**
 * a11y.js — Accessibility-Helfer
 * Contao Standard Theme
 *
 * Exports: trapFocus, releaseFocus, toggleAriaExpanded, announceToScreenReader
 * Keine externen Abhängigkeiten.
 */

'use strict';

/* ── Fokussierbare Selektoren ─────────────────────────────────────────────── */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
  'details > summary',
  'audio[controls]',
  'video[controls]',
].join(', ');

/* ── Fokus-Trap ───────────────────────────────────────────────────────────── */

let _trapHandler = null;
let _previousFocus = null;

/**
 * Sperrt den Fokus innerhalb von `container`.
 * Speichert das vorherige aktive Element für restoreFocus().
 *
 * @param {HTMLElement} container
 */
export function trapFocus(container) {
  _previousFocus = document.activeElement;

  const focusable = Array.from(container.querySelectorAll(FOCUSABLE)).filter(
    (el) => !el.closest('[hidden]') && !el.closest('[aria-hidden="true"]')
  );

  if (focusable.length === 0) return;

  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  /* Fokus auf erstes Element setzen */
  first.focus();

  /* Vorherigen Handler entfernen */
  if (_trapHandler) {
    document.removeEventListener('keydown', _trapHandler);
  }

  _trapHandler = (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      /* Shift+Tab: vom ersten zum letzten springen */
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      /* Tab: vom letzten zum ersten springen */
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  document.addEventListener('keydown', _trapHandler);
}

/**
 * Hebt den Fokus-Trap auf und stellt den vorherigen Fokus wieder her.
 */
export function releaseFocus() {
  if (_trapHandler) {
    document.removeEventListener('keydown', _trapHandler);
    _trapHandler = null;
  }

  if (_previousFocus && typeof _previousFocus.focus === 'function') {
    _previousFocus.focus();
    _previousFocus = null;
  }
}

/* ── ARIA-Toggle ──────────────────────────────────────────────────────────── */

/**
 * Schaltet aria-expanded zwischen "true" und "false".
 *
 * @param {HTMLElement} trigger   — Button mit aria-expanded
 * @param {boolean}     [force]   — optional: erzwungener Wert
 * @returns {boolean}             — neuer Zustand
 */
export function toggleAriaExpanded(trigger, force) {
  const current = trigger.getAttribute('aria-expanded') === 'true';
  const next    = typeof force === 'boolean' ? force : !current;

  trigger.setAttribute('aria-expanded', String(next));
  return next;
}

/**
 * Setzt aria-hidden auf einem Element.
 *
 * @param {HTMLElement} el
 * @param {boolean}     hidden
 */
export function setAriaHidden(el, hidden) {
  if (hidden) {
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('tabindex', '-1');
  } else {
    el.removeAttribute('aria-hidden');
    el.removeAttribute('tabindex');
  }
}

/* ── Screen-Reader-Ankündigung ────────────────────────────────────────────── */

let _liveRegion = null;

/**
 * Kündigt eine Nachricht für Screen-Reader an (aria-live="polite").
 *
 * @param {string} message
 * @param {'polite'|'assertive'} [priority='polite']
 */
export function announceToScreenReader(message, priority = 'polite') {
  if (!_liveRegion) {
    _liveRegion = document.createElement('div');
    _liveRegion.id = 'a11y-live-region';
    _liveRegion.setAttribute('role', 'status');
    _liveRegion.setAttribute('aria-live', priority);
    _liveRegion.setAttribute('aria-atomic', 'true');
    _liveRegion.className = 'visually-hidden';
    document.body.appendChild(_liveRegion);
  }

  _liveRegion.setAttribute('aria-live', priority);

  /* Kurze Verzögerung, damit Screen-Reader die Änderung wahrnehmen */
  _liveRegion.textContent = '';
  requestAnimationFrame(() => {
    _liveRegion.textContent = message;
  });
}

/* ── Escape-Taste: Handler ────────────────────────────────────────────────── */

/**
 * Ruft `callback` auf, wenn Escape gedrückt wird.
 * Gibt eine cleanup-Funktion zurück.
 *
 * @param {Function} callback
 * @returns {Function} cleanup
 */
export function onEscape(callback) {
  const handler = (event) => {
    if (event.key === 'Escape') callback(event);
  };
  document.addEventListener('keydown', handler);
  return () => document.removeEventListener('keydown', handler);
}

/* ── Fokussierbare Elemente abrufen ───────────────────────────────────────── */

/**
 * Gibt alle fokussierbaren Elemente innerhalb von `container` zurück.
 *
 * @param {HTMLElement} container
 * @returns {HTMLElement[]}
 */
export function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE)).filter(
    (el) => !el.closest('[hidden]') && !el.closest('[aria-hidden="true"]')
  );
}
