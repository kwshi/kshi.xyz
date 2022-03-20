plugins:
  ./script/plugins.bash

dev: plugins
  cd main && pnpx svelte-kit dev

build:
  cd main && pnpm run build
