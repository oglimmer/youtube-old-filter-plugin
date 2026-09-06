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

## Install

### From GitHub (easiest)

1. Go to the [latest release](https://github.com/oglimmer/youtube-old-filter-plugin/releases/latest).
2. Download `youtube-old-filter.xpi`.
3. Drag the file onto a Firefox window, then click **Add**.

The file is signed by Mozilla, so Firefox keeps it after a restart.

Firefox checks for new versions on its own, about once a day. It reads
`updates.json` in this repo and installs any newer release for you.

### From your own signed file

1. Run `npm run sign` (see [Build and sign](#build-and-sign)).
2. Open the `.xpi` in `web-ext-artifacts/` with Firefox.

### For testing (temporary)

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on...**
3. Pick `manifest.json` in this folder

Firefox removes a temporary add-on when it restarts.

Or run `npm run start`. This opens a fresh Firefox with the add-on loaded and
reloads it when you edit a file.

## Settings

Click the toolbar icon, or open `about:addons` -> the add-on -> Preferences.

| Setting | Meaning |
| --- | --- |
| On / off | Turn the filter off without removing the add-on |
| Number + unit | Hide videos older than this (days, weeks, months, years) |

Settings are stored in `storage.sync`, so they follow your Firefox account.

## Build and sign

You need Node.js.

```sh
npm install
npm run lint     # check the add-on for errors
npm run build    # makes web-ext-artifacts/*.zip (unsigned)
npm run sign     # makes web-ext-artifacts/*.xpi (signed, self-hosted)
```

`npm run sign` needs Mozilla API keys. Get them at
[addons.mozilla.org/developers/addon/api/key/](https://addons.mozilla.org/en-US/developers/addon/api/key/)
and pass them like this:

```sh
npm run sign -- --api-key=user:12345:67 --api-secret=abcdef...
```

Firefox only installs signed add-ons. An unsigned `.zip` works with
`about:debugging` or Firefox Developer Edition with
`xpinstall.signatures.required` set to `false` in `about:config`.

### Shipping a new version

1. Raise `version` in `manifest.json`. Mozilla refuses the same version twice.
2. `npm run sign`
3. Create a GitHub release tagged `vX.Y.Z` and attach the `.xpi` as
   `youtube-old-filter.xpi`.
4. Point `updates.json` at the new version and tag, then push to `main`.

Step 4 is what makes existing users get the update.

## Files

| File | Purpose |
| --- | --- |
| `manifest.json` | Manifest V3 add-on definition |
| `content.js` | Reads card ages and hides the old ones |
| `options.html` / `options.js` | Settings page, also used as the toolbar popup |
| `icons/icon-48.png`, `icons/icon-96.png` | Toolbar and add-on icon |
| `icons/icon.svg` | Source the PNG icons are rendered from |
| `package.json` | `web-ext` scripts for lint, run, build and sign |
| `updates.json` | Tells Firefox where the newest signed `.xpi` lives |

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
