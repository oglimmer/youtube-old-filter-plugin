/*
 * YouTube Old Video Filter
 * Hides home-feed ("For you") video cards older than a configured age.
 */
(() => {
  "use strict";

  const api = typeof browser !== "undefined" ? browser : chrome;

  const DEFAULTS = { enabled: true, amount: 4, unit: "weeks" };
  const UNIT_DAYS = { days: 1, weeks: 7, months: 30, years: 365 };

  let maxAgeDays = DEFAULTS.amount * UNIT_DAYS[DEFAULTS.unit];
  let enabled = DEFAULTS.enabled;

  /* ---------- style ---------- */

  const style = document.createElement("style");
  style.textContent = ".yof-hidden { display: none !important; }";
  (document.head || document.documentElement).appendChild(style);

  /* ---------- relative-date parsing ---------- */

  // Maps the first letters of a time word (many languages) to a number of days.
  function unitToDays(rawWord) {
    const w = rawWord.toLowerCase();
    const is = (...prefixes) => prefixes.some((p) => w.startsWith(p));

    if (is("sec", "sek", "seg", "sik")) return 1 / 86400;
    if (is("min")) return 1 / 1440;
    if (is("hour", "hora", "heure", "stund", "uur", "ora", "ore", "timme", "time")) return 1 / 24;
    if (is("day", "tag", "jour", "dia", "día", "giorn", "dag", "dzie")) return 1;
    if (is("week", "woch", "semain", "seman", "settiman", "uge", "vecka", "tydz")) return 7;
    if (is("month", "monat", "mois", "mes", "mês", "maand", "mesi", "maned", "månad", "miesi")) return 30;
    if (is("year", "jahr", "año", "ano", "anno", "ans", "an", "jaar", "år", "lat", "rok")) return 365;
    return null;
  }

  const NUM_WORD = /(\d+)\s*([\p{L}]+)/gu;

  // Returns the age in days, or null when no relative date was found.
  function parseAgeDays(text) {
    if (!text) return null;
    NUM_WORD.lastIndex = 0;
    let m;
    while ((m = NUM_WORD.exec(text)) !== null) {
      const days = unitToDays(m[2]);
      if (days !== null) return parseInt(m[1], 10) * days;
    }
    return null;
  }

  /* ---------- DOM helpers ---------- */

  const ITEM_SELECTOR = [
    "ytd-rich-item-renderer",
    "ytm-rich-item-renderer",
  ].join(",");

  const META_SELECTOR = [
    "#metadata-line span",
    ".inline-metadata-item",
    "yt-content-metadata-view-model span",
    ".yt-content-metadata-view-model-wiz__metadata-text",
  ].join(",");

  const TITLE_SELECTOR = [
    "a#video-title-link",
    "a#video-title",
    "h3 a[aria-label]",
    ".yt-lockup-metadata-view-model-wiz__title",
  ].join(",");

  // Live streams and premieres have no age -> never hide them.
  const LIVE_SELECTOR = [
    "[overlay-style='LIVE']",
    "badge-shape[aria-label='LIVE']",
    ".badge-shape-wiz--thumbnail-live",
  ].join(",");

  function itemAgeDays(item) {
    if (item.querySelector(LIVE_SELECTOR)) return null;

    for (const el of item.querySelectorAll(META_SELECTOR)) {
      const age = parseAgeDays(el.textContent);
      if (age !== null) return age;
    }
    const title = item.querySelector(TITLE_SELECTOR);
    if (title) {
      const age = parseAgeDays(title.getAttribute("aria-label"));
      if (age !== null) return age;
    }
    return null;
  }

  function isHomeFeed() {
    const p = location.pathname;
    return p === "/" || p === "" || p === "/index";
  }

  /* ---------- main pass ---------- */

  function apply() {
    const items = document.querySelectorAll(ITEM_SELECTOR);
    const active = enabled && isHomeFeed();

    for (const item of items) {
      if (!active) {
        item.classList.remove("yof-hidden");
        continue;
      }
      const age = itemAgeDays(item);
      const hide = age !== null && age > maxAgeDays;
      item.classList.toggle("yof-hidden", hide);
    }
  }

  let pending = false;
  function scheduleApply() {
    if (pending) return;
    pending = true;
    setTimeout(() => {
      pending = false;
      apply();
    }, 150);
  }

  /* ---------- settings ---------- */

  function readSettings(cfg) {
    const s = Object.assign({}, DEFAULTS, cfg || {});
    const amount = Number(s.amount) > 0 ? Number(s.amount) : DEFAULTS.amount;
    const perUnit = UNIT_DAYS[s.unit] || UNIT_DAYS[DEFAULTS.unit];
    maxAgeDays = amount * perUnit;
    enabled = s.enabled !== false;
  }

  api.storage.sync.get(DEFAULTS).then((cfg) => {
    readSettings(cfg);
    apply();
  });

  api.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    api.storage.sync.get(DEFAULTS).then((cfg) => {
      readSettings(cfg);
      apply();
    });
  });

  /* ---------- triggers ---------- */

  new MutationObserver(scheduleApply).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  window.addEventListener("yt-navigate-finish", scheduleApply, true);
  window.addEventListener("popstate", scheduleApply, true);
  document.addEventListener("DOMContentLoaded", scheduleApply);
  setInterval(scheduleApply, 2000);
})();
