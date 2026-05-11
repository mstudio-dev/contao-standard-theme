/**
 * dropdown.js — Accessible Dropdown-Menü
 * Contao Standard Theme
 *
 * Markup-Voraussetzungen:
 *   <div class="dropdown">
 *     <button class="btn dropdown__toggle" aria-expanded="false"
 *             aria-haspopup="true" aria-controls="dd-menu-1">
 *       Menü
 *     </button>
 *     <ul class="dropdown__menu" id="dd-menu-1" role="menu">
 *       <li role="none">
 *         <a class="dropdown__item" href="#" role="menuitem">Eintrag</a>
 *       </li>
 *     </ul>
 *   </div>
 *
 * ARIA-Pattern: APG Disclosure Navigation Menu
 * Tastatur: Enter/Space öffnet, Escape schließt, Pfeiltasten navigieren,
 *           Tab verlässt das Menü.
 */

'use strict';

import { toggleAriaExpanded, onEscape } from './a11y.js';

/** Alle aktiven Dropdown-Instanzen */
const instances = new Set();

class Dropdown {
  /**
   * @param {HTMLElement} container — .dropdown-Element
   */
  constructor(container) {
    this.container = container;
    this.toggle    = container.querySelector('.dropdown__toggle');
    this.menu      = container.querySelector('.dropdown__menu');

    if (!this.toggle || !this.menu) return;

    this.items         = [];
    this.currentIndex  = -1;
    this._cleanupEsc   = null;

    this._bindEvents();
    instances.add(this);
  }

  /* ── Events ──────────────────────────────────────────────────────────────── */

  _bindEvents() {
    this.toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this._handleToggle();
    });

    this.toggle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this._open();
        this._focusItem(0);
      }
    });

    this.menu.addEventListener('keydown', (e) => this._handleMenuKeydown(e));

    /* Klick außerhalb schließt */
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this._close();
      }
    });
  }

  _handleToggle() {
    const isOpen = this.toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      this._close();
    } else {
      this._open();
    }
  }

  _handleMenuKeydown(event) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this._focusItem(this.currentIndex + 1);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this._focusItem(this.currentIndex - 1);
        break;

      case 'Home':
        event.preventDefault();
        this._focusItem(0);
        break;

      case 'End':
        event.preventDefault();
        this._focusItem(this.items.length - 1);
        break;

      case 'Tab':
        this._close();
        break;

      case 'Escape':
        /* Wird auch von onEscape behandelt, direkt hier ebenfalls */
        this._close();
        this.toggle.focus();
        break;
    }
  }

  /* ── Öffnen/Schließen ────────────────────────────────────────────────────── */

  _open() {
    /* Alle anderen schließen */
    instances.forEach((inst) => {
      if (inst !== this) inst._close();
    });

    toggleAriaExpanded(this.toggle, true);
    this.menu.removeAttribute('hidden');
    this.menu.style.display = 'block';

    this.items = Array.from(
      this.menu.querySelectorAll('.dropdown__item:not([disabled]):not([aria-disabled="true"])')
    );
    this.currentIndex = -1;

    this._cleanupEsc = onEscape(() => {
      this._close();
      this.toggle.focus();
    });
  }

  _close() {
    toggleAriaExpanded(this.toggle, false);
    this.menu.style.display = '';
    this.currentIndex = -1;

    if (this._cleanupEsc) {
      this._cleanupEsc();
      this._cleanupEsc = null;
    }
  }

  /* ── Fokus-Navigation ────────────────────────────────────────────────────── */

  _focusItem(index) {
    if (this.items.length === 0) return;

    /* Zirkulär navigieren */
    if (index < 0) index = this.items.length - 1;
    if (index >= this.items.length) index = 0;

    this.currentIndex = index;
    this.items[index].focus();
  }

  /* ── Cleanup ─────────────────────────────────────────────────────────────── */

  destroy() {
    this._close();
    instances.delete(this);
  }
}

/* ── Auto-Initialisierung ─────────────────────────────────────────────────── */

/**
 * Initialisiert alle .dropdown-Elemente im DOM.
 */
export function initDropdowns(root = document) {
  root.querySelectorAll('.dropdown').forEach((el) => {
    if (!el._dropdownInstance) {
      el._dropdownInstance = new Dropdown(el);
    }
  });
}

/* DOM-ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initDropdowns());
} else {
  initDropdowns();
}

export { Dropdown };
