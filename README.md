# YouTube Old Video Filter

A small Firefox add-on with one job: on the YouTube home ("For you") feed, hide
every video suggestion that is older than a date you choose.

Default: **hide anything older than 4 weeks.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## What it does

- Reads the age YouTube already prints on each card ("3 weeks ago").
- Hides the whole card with `display: none`, so the grid closes up. No gaps.
- Only touches the home feed. Search, subscriptions and channel pages stay as they are.
- Never hides live streams (they have no age).
- Keeps working while you scroll, because the feed loads more cards as you go.

## Install for testing (temporary)

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on...**
3. Pick `manifest.json` in this folder

Firefox removes a temporary add-on when it restarts.

## Settings

Click the toolbar icon, or open `about:addons` -> the add-on -> Preferences.

| Setting | Meaning |
| --- | --- |
| On / off | Turn the filter off without removing the add-on |
| Number + unit | Hide videos older than this (days, weeks, months, years) |

Settings are stored in `storage.sync`, so they follow your Firefox account.

## Build a package

```sh
./build.sh
```

This creates `dist/youtube-old-filter.xpi`.

To install that file permanently you must sign it at
[addons.mozilla.org](https://addons.mozilla.org), or use Firefox Developer
Edition with `xpinstall.signatures.required` set to `false` in `about:config`.

## Files

| File | Purpose |
| --- | --- |
| `manifest.json` | Manifest V3 add-on definition |
| `content.js` | Reads card ages and hides the old ones |
| `options.html` / `options.js` | Settings page, also used as the toolbar popup |
| `icons/icon.svg` | Toolbar and add-on icon |
| `build.sh` | Zips the add-on into `dist/` |

## Languages

The age text is read in the language YouTube shows it in. Recognised:
English, German, Spanish, French, Italian, Portuguese, Dutch, Danish, Swedish,
Norwegian and Polish.

If your language is missing, add its time words to `unitToDays()` in
`content.js`.

## Permissions

Only `storage`, to save your settings. The add-on makes no network requests and
sends nothing anywhere.

## Licence

[MIT](LICENSE)
