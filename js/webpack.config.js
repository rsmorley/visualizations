const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: {
    app: './src/index.js',
    print: './src/print.js',
    utilities: './src/utilities.js'
  },
	devServer: {
    host: '0.0.0.0',
		contentBase: './dist',
	},
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        title: 'Visualizations',
        template: 'src/index.html'
      }),
  ],
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
				],
			},
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
		],
	},
};
