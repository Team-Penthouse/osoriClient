module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-flow', '@babel/preset-typescript'],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./src'],
            },
        ],
        ['react-native-reanimated/plugin'],
    ],
};
