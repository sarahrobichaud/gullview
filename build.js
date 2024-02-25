import esbuild from 'esbuild';

const config = {
    entryPoints: ['src/Gullview.ts'],
    target: ['chrome58', 'firefox57', 'safari11', 'edge18'],
    platform: 'browser',
    bundle: true,
};

const iife = esbuild.build({
    ...config,
    entryPoints: ['src/index.ts'],
    format: 'iife',
    globalName: 'Gullview',
    outfile: 'dist/gullview.min.js',
});

const esm = esbuild.build({
    ...config,
    format: 'esm',
    outfile: 'dist/gullview.js',
});

// const cjs = esbuild.build({
//     ...config,
//     format: 'cjs',
//     outfile: 'dist/gullview.mjs',
// });

const minStyles = esbuild.build({
    entryPoints: ['public/gullview.css'],
    bundle: true,
    minify: true,
    outfile: 'dist/css/gullview.min.css',
});
const styles = esbuild.build({
    entryPoints: ['public/gullview.css'],
    bundle: true,
    outfile: 'dist/css/gullview.css',
});

await Promise.all([iife, esm, minStyles, styles]).catch((e) => {
    console.error(e);
    process.exit(1);
});
