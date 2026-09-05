"use strict";

const api = typeof browser !== "undefined" ? browser : chrome;
const DEFAULTS = { enabled: true, amount: 4, unit: "weeks" };

const $enabled = document.getElementById("enabled");
const $amount = document.getElementById("amount");
const $unit = document.getElementById("unit");
const $status = document.getElementById("status");

let statusTimer = null;

function save() {
  const amount = Math.max(1, parseInt($amount.value, 10) || DEFAULTS.amount);
  $amount.value = amount;
  api.storage.sync
    .set({ enabled: $enabled.checked, amount, unit: $unit.value })
    .then(() => {
      $status.textContent = "Saved.";
      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => ($status.textContent = ""), 1500);
    });
}

api.storage.sync.get(DEFAULTS).then((cfg) => {
  $enabled.checked = cfg.enabled !== false;
  $amount.value = cfg.amount;
  $unit.value = cfg.unit;
});

$enabled.addEventListener("change", save);
$amount.addEventListener("change", save);
$unit.addEventListener("change", save);
