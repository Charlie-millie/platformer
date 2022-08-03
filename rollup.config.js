import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sass from 'rollup-plugin-sass';
import hotcss from "rollup-plugin-hot-css";
import image from '@rollup/plugin-image';
import typescript from 'rollup-plugin-typescript2';

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/script/index.ts',
    output: {
        sourcemap: true,
        format: 'umd',
        name: 'Platformer',
        file: 'public/build/platformer.js'
    },
    plugins: [
        typescript({
            tsconfig: 'tsconfig.json'
        }),
        hotcss({
            file: 'platformer.css',
            extensions: ['.css', '.scss'],
            loaders: ['scss'],
            hot: true
        }),
        sass({
            insert: true
        }),
        image(),
        resolve({
            browser: true
        }),
        commonjs(),
        !production && serve(),
        !production && livereload('public'),
        production && terser(),

    ],
    watch: {
        clearScreen: false
    }
};

function serve() {
    let started = false;

    return {
        writeBundle() {
            if (!started) {
                started = true;

                require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
                    stdio: ['ignore', 'inherit', 'inherit'],
                    shell: true
                });
            }
        }
    };
}
