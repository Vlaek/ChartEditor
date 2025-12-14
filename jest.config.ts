import type { Config } from 'jest'

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    rootDir: '.',
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '^@Common/(.*)$': '<rootDir>/src/Common/$1',
        '^@Entities/(.*)$': '<rootDir>/src/Entities/$1',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
}

export default config