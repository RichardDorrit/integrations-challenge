import { Configuration } from 'webpack';

const config: Configuration = {
  mode: 'development',

  context: __dirname,

  entry: './client.ts',

  output: {
    publicPath: '/',
    filename: 'main.bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

export default config;
