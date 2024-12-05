module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json', // Ensure this path is correct
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Integrates Prettier with ESLint
  ],
  root: true,
  env: {
    node: true,
    jest: true, // Enables Jest-specific globals like "describe" and "it"
  },
  ignorePatterns: ['.eslintrc.js', 'dist/**/*'], // Ignore compiled files
  rules: {
    // NestJS & TypeScript rules
    '@typescript-eslint/interface-name-prefix': 'off', // Legacy rule
    '@typescript-eslint/explicit-function-return-type': 'warn', // Warn instead of turning off
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-explicit-any': 'off', // Allow `any`, but use sparingly

    // General coding style
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto', // Avoid line-ending issues across OS
      },
    ],

    // Additional rules you may consider enabling
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn on unused variables but ignore underscores
    '@typescript-eslint/no-inferrable-types': 'off', // Allow explicit types for clarity
    'no-console': 'warn', // Avoid excessive `console.log` statements
  },
};
