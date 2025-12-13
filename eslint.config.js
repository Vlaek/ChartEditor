import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
    js.configs.recommended,

    {
        files: ['**/*.{ts,tsx}'],
        ignores: ['**/*.d.ts'],
        plugins: {
            '@typescript-eslint': ts,
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.es2020,
            },
        },
        rules: {
            ...ts.configs['recommended'].rules,
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['error', { 
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            }],
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    prefer: 'type-imports',
                    fixStyle: 'inline-type-imports',
                },
            ],
            'no-undef': 'off',
            
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'interface',
                    format: ['PascalCase'],
                    custom: {
                        regex: '^I[A-Z]',
                        match: true,
                    },
                },
                {
                    selector: 'typeAlias',
                    format: ['PascalCase'],
                    custom: {
                        regex: '^T[A-Z]',
                        match: true,
                    },
                },
                {
                    selector: 'enum',
                    format: ['PascalCase'],
                    custom: {
                        regex: '^E[A-Z]',
                        match: true,
                    },
                },
                {
                    selector: 'enumMember',
                    format: ['UPPER_CASE'],
                },
                {
                    selector: 'class',
                    format: ['PascalCase'],
                },
                {
                    selector: 'function',
                    format: ['PascalCase'],
                    filter: {
                        regex: '^(?!use)[A-Z]',
                        match: true,
                    },
                },
                {
                    selector: 'function',
                    format: ['camelCase'],
                    filter: {
                        regex: '^use[A-Z]',
                        match: true,
                    },
                },
                {
                    selector: 'function',
                    format: ['camelCase'],
                },
                {
                    selector: 'variable',
                    format: ['camelCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'variable',
                    modifiers: ['exported'],
                    format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
                },
                {
                    selector: 'parameter',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'method',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'property',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                },
            ],
        },
    },

    {
        files: ['**/*.d.ts'],
        plugins: {
            '@typescript-eslint': ts,
        },
        languageOptions: {
            parser: tsParser,
        },
        rules: {
            '@typescript-eslint/naming-convention': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            'no-undef': 'off',
        },
    },

    {
        files: ['**/*.{jsx,tsx}'],
        ignores: ['**/*.d.ts', '**/global.d.ts'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        settings: {
            react: {
                version: '19.0',
            },
        },
        languageOptions: {
            globals: {
                React: 'readonly',
            },
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/display-name': 'off',
            'react/jsx-uses-react': 'off',
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'react/jsx-no-target-blank': 'error',
            'react/jsx-key': ['error', { checkFragmentShorthand: true }],
            'react/self-closing-comp': ['error', {
                component: true,
                html: true,
            }],
            'react/jsx-curly-brace-presence': ['error', {
                props: 'never',
                children: 'never',
            }],
        },
    },

    {
    plugins: {
        import: importPlugin,
    },
    rules: {
        'import/order': ['error', {
            groups: [
                'builtin',
                'external',
                'internal',
                'parent',
                'sibling',
                'index',
                'object',
                'type',
            ],
            pathGroups: [
                {
                pattern: 'react',
                group: 'external',
                position: 'before',
                },
                {
                pattern: '@/**',
                group: 'internal',
                position: 'after',
                },
            ],
            pathGroupsExcludedImportTypes: ['react'],
            alphabetize: {
                order: 'asc',
                caseInsensitive: true,
            },
        }],
        'import/no-duplicates': 'error',
        'import/no-unresolved': 'off',
        'import/named': 'off',
        'import/namespace': 'off',
        'import/default': 'off',
        'import/export': 'error',
        },
    },

    {
        files: ['**/*.{jsx,tsx}'],
        ignores: ['**/*.d.ts', '**/global.d.ts'],
        plugins: {
            'jsx-a11y': jsxA11y,
        },
        rules: {
            ...jsxA11y.configs.recommended.rules,
            'jsx-a11y/click-events-have-key-events': 'warn',
            'jsx-a11y/interactive-supports-focus': 'warn',
        },
    },

    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        ignores: ['**/*.d.ts', '**/global.d.ts'],
        rules: {
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debugger': 'warn',
            'no-var': 'error',
            'prefer-const': ['error', {
                destructuring: 'any',
                ignoreReadBeforeAssign: false,
            }],
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all'],
            'quotes': ['error', 'single', { avoidEscape: true }],
            'semi': ['error', 'always'],
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],
            'arrow-spacing': ['error', { before: true, after: true }],
            'indent': ['error', 4, {
                SwitchCase: 1,
                ignoredNodes: ['ConditionalExpression'],
            }],
            'max-len': ['warn', {
                code: 150,
                ignoreComments: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
            }],
            'padding-line-between-statements': [
                'error',
                { blankLine: 'always', prev: '*', next: 'return' },
                { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
                { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
                { blankLine: 'always', prev: 'directive', next: '*' },
                { blankLine: 'any', prev: 'directive', next: 'directive' },
            ],
        },
    },

    {
        ignores: [
            'node_modules/',
            'dist/',
            'build/',
            'coverage/',
            '.rsbuild/',
            '*.config.*',
            '*.d.ts',
            '**/global.d.ts',
        ],
    },
];