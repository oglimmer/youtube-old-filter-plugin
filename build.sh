#!/usr/bin/env bash
# Packs the extension into dist/youtube-old-filter.xpi (a plain zip).
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p dist
rm -f dist/youtube-old-filter.xpi
zip -r -FS dist/youtube-old-filter.xpi \
  manifest.json content.js options.html options.js icons \
  -x '*.DS_Store'
echo "Built: dist/youtube-old-filter.xpi"
