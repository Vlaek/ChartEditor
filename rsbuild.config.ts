import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginLess } from '@rsbuild/plugin-less';

export default defineConfig({
    plugins: [
        pluginReact(),
        pluginLess({
            lessLoaderOptions: {
                lessOptions: {
                    javascriptEnabled: true,
                    math: 'always',
                },
            },
        }),
    ],
    source: {
        entry: {
            index: './src/Bootstrap/index.tsx',
        },
    },
    resolve: {
        alias: {
            '@Bootstrap': './src/Bootstrap',
            '@Common': './src/Common',
            '@Entities': './src/Entities',
        },
    },
    html: {
        title: 'Редактор диаграмм',
    },
    output: {
        distPath: {
            root: 'dist',
        },
        assetPrefix: process.env.NODE_ENV === 'production' ? './' : '/',
    },
});
