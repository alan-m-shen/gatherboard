#!/bin/sh
set -eu
cd "$(dirname "$0")"
if command -v python3 >/dev/null 2>&1; then
  JAM_PYTHON=$(command -v python3)
else
  JAM_PYTHON="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3"
fi
if [ ! -x "$JAM_PYTHON" ]; then
  echo 'Python 3 is required to serve the whiteboard.' >&2
  exit 1
fi
echo "Gatherboard: http://127.0.0.1:${PORT:-8765}/jam.html"
exec "$JAM_PYTHON" -m http.server "${PORT:-8765}" --bind 127.0.0.1 --directory src/main/webapp
