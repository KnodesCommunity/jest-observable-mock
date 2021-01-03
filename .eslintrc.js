module.exports = {
    env: {
        node: true,
        es2020: true,
        jest: true
    },
    extends: [
        'eslint:recommended',
    ],
    overrides: [
        {
            files: ['*.ts'],
            plugins: [
                '@typescript-eslint',
            ],
            parser: '@typescript-eslint/parser',
            extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended'
            ]
        }
    ]
}
