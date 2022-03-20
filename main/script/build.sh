#!/bin/sh
set -eu

echo "compiling build plugins"
for plugin in '../plugin'/*; do
  echo "plugin $plugin"
  ( cd "$plugin"; pnpx tsc -b )
done

pnpx svelte-kit build
