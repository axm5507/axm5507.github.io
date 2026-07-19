# amanikandan.com

The live portfolio site, deployed via GitHub Pages to the custom domain
`amanikandan.com`. It's an interactive Game Boy portfolio: walk around a small
world where buildings/NPCs point to projects and experience, with a sidebar
linking to résumé/GitHub/LinkedIn/contact, and Select overlaying live emulator
internals.

This repo is intentionally just the **built static output** — plain HTML/CSS/JS
plus the compiled wasm module. There's no build step here on purpose, so GitHub
Pages can serve it as-is with nothing but "Deploy from branch" turned on.

The actual source — the Rust emulator core, the wasm bindings, and the front-end
source these files are built from — lives in
[axm5507/gameboy-emulator](https://github.com/axm5507/gameboy-emulator), under
its `web/` directory. The Game Boy ROM itself (`roms/portfolio.gb`) is authored in
GB Studio; see that repo's `GBSTUDIO.md`.

## Updating the live site

Whenever the emulator core, the front-end, or the ROM changes in
`gameboy-emulator`:

```sh
cd ../gameboy-emulator
./scripts/build-web.sh          # or scripts\build-web.ps1 on Windows
```

Then copy the rebuilt output over here and push:

```sh
cp ../gameboy-emulator/web/index.html ../gameboy-emulator/web/style.css ../gameboy-emulator/web/main.js .
cp ../gameboy-emulator/web/pkg/emulator_core.js ../gameboy-emulator/web/pkg/emulator_core_bg.wasm ../gameboy-emulator/web/pkg/*.d.ts pkg/
cp ../gameboy-emulator/web/roms/portfolio.gb roms/
git add -A
git commit -m "Update site"
git push
```

GitHub Pages redeploys automatically on push to `main`.
