const { minify } = require('terser');
const fs = require('fs');
const path = require('path');

const JS_DIR = path.join(__dirname, 'js');
const DIST_DIR = path.join(__dirname, 'dist', 'js');

const targets = [
    'Index.js',
    'tracker.js',
    'supabase-client.js',
    'product.js',
    'reservation.js',
    'faq.js'
];

async function build() {
    // dist/js 디렉토리 생성
    fs.mkdirSync(DIST_DIR, { recursive: true });

    for (const file of targets) {
        const inputPath = path.join(JS_DIR, file);
        const outputPath = path.join(DIST_DIR, file);

        if (!fs.existsSync(inputPath)) {
            console.log('[건너뜀] ' + file + ' (파일 없음)');
            continue;
        }

        const code = fs.readFileSync(inputPath, 'utf-8');
        const result = await minify(code, {
            compress: {
                drop_console: true,
                passes: 2
            },
            mangle: {
                toplevel: true
            },
            format: {
                comments: false
            }
        });

        fs.writeFileSync(outputPath, result.code);
        var originalSize = (code.length / 1024).toFixed(1);
        var minifiedSize = (result.code.length / 1024).toFixed(1);
        console.log('[완료] ' + file + ' (' + originalSize + 'KB -> ' + minifiedSize + 'KB)');
    }

    console.log('\n빌드 완료: dist/js/');
}

build().catch(function(err) {
    console.error('빌드 실패:', err);
    process.exit(1);
});
