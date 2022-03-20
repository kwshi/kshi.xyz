#!/bin/bash
set -euo pipefail

function log {
  echo $'\e[32m'"$1"$'\e[m'
}

log 'compiling build plugins'
for p in plugin/*; do
  pushd "$p" > '/dev/null'
  log "plugin: ${p#plugin/}"
  pnpx tsc -b
  popd > '/dev/null'
done

cd 'main'
pnpx svelte-kit dev
