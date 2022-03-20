#!/bin/sh
set -eu

echo "compiling build plugins"
for plugin in '../plugin'/*; do
  echo "plugin $plugin"
  ( cd "$plugin"; tsc -b )
done

svelte-kit build
