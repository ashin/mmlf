const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

const buildProcess = require('./webpack-lib.js');
const PATHS = {
	app: path.join(__dirname, 'app'),
	style: [
		path.join(__dirname, 'app', 'main.css')
	],
	build: path.join(__dirname, 'build'),
	htmlTemplate: path.join(__dirname, 'app', 'index.ejs')
};
const TARGET = process.env.npm_lifecycle_event;

process.env.BABEL_ENV = TARGET;

const common = {
	resolve: {
		extensions: ['', '.js']
	},
	entry: {
		style: PATHS.style,
		app: PATHS.app
	},
	target: 'web',
	output: {
		path: PATHS.build,
		filename: '[name].js',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: PATHS.htmlTemplate
		}),
		new ExtractTextPlugin('[name].[chunkhash].css')
	],
	module: {
		loaders: [
			{
				test: /\.js?$/,
				loaders: ['babel?cacheDirectory'],
				include: PATHS.app
			},
		],
	}
};

var config;

switch(process.env.npm_lifecycle_event){
	case 'build':
		config = merge(
			common,
			{
	        	devtool: 'source-map',
	        	output: {
	        		path: PATHS.build,
	        		publicPath: '/app/',
	        		filename: '[name].[chunkhash].js',
	        		chunkFilename: '[chunkhash].js'
	        	},
	        	externals: {
					'cheerio': 'window'
				}
	      	},
	      	buildProcess.clean(PATHS.build),
	      	buildProcess.dedupe(PATHS.app),
	      	buildProcess.setFreeVariable(
		    	'process.env.NODE_ENV',
		    	'production'
	      	),
	      	buildProcess.minify(),
	      	buildProcess.setupCSS(PATHS.app, true)
		);
		break;

	default:
		config = merge(
			common,
			buildProcess.devServer({
				host: process.env.HOST,
				port: process.env.PORT
			}),
			buildProcess.setupCSS(PATHS.app),
			{
	        	devtool: 'eval-source-map'
	      	}
		);
};

// quiet mode stops logging of stats
module.exports = validate(config, {
	quiet: true
});