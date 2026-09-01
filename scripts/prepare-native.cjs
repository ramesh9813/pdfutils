const fs = require('fs');
const path = require('path');

const esbuildSrc = path.join(__dirname, '../node_modules/@esbuild/linux-arm64/bin/esbuild');
if (fs.existsSync(esbuildSrc) && !fs.existsSync('/tmp/esbuild')) {
  fs.copyFileSync(esbuildSrc, '/tmp/esbuild');
  fs.chmodSync('/tmp/esbuild', 0o755);
}

const rollupSrc = path.join(__dirname, '../node_modules/@rollup/rollup-linux-arm64-gnu/rollup.linux-arm64-gnu.node');
if (fs.existsSync(rollupSrc) && !fs.existsSync('/tmp/rollup.node')) {
  fs.copyFileSync(rollupSrc, '/tmp/rollup.node');
}
