const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack-plugin');

exports.devServer = function(options) {
    return {
        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            stats: 'errors-only',
            host: options.host,
            port: options.port,
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin({
                multistep: true
            })
        ]
    }
}

exports.setupCSS = function(paths) {
    return {
        module: {
            loaders: [{
                test: /\.css$/,
                loaders: ['style', 'css'],
                include: paths
            }]
        }
    }
}

exports.minify = function() {
  return {
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            comments: false,
            compress: {
                warnings: false,
                drop_console: true
            },
            mangle: {
                except: ['$', 'webpackJsonp'],
                screw_ie8 : true,
                keep_fnames: true
            }
        })
    ]
  };
}

exports.dedupe = function(paths) {
    return {
        plugins: [
            new webpack.optimize.DedupePlugin()
        ]
    }
}

exports.setFreeVariable = function(key, value) {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  };
}

exports.extractBundle = function(options) {
    const entry = {};
    entry[options.name] = options.entries;

    return {
        entry: entry,
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                names: [options.name, 'manifest']
            })
        ]
    }
}

exports.setupCSS = function(paths, shouldExtract) {
    const CHUNK_MODULE = {
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    include: paths,
                    exclude: /node_modules/,
                },
            ]
        },
        postcss: [
            require('autoprefixer')
        ],
    };

    if(shouldExtract) {
        CHUNK_MODULE.plugins = [ new ExtractTextPlugin('[name].[chunkhash].css') ];
        CHUNK_MODULE.module.loaders[0].loader = ExtractTextPlugin.extract('style-loader', 'css-loader?localIdentName=[emoji]!postcss-loader!less-loader');
    } else {
        CHUNK_MODULE.module.loaders[0].loaders = ['style-loader', 'css-loader?localIdentName=[name]__[local]___[emoji]!postcss-loader!less-loader']
    }

    return CHUNK_MODULE;
}

exports.purifyCSS = function(paths) {
    return {
        plugins: [
            new PurifyCSSPlugin({
                basePath: process.cwd(),
                paths: paths
            }),
        ]
    }
}

exports.clean = function(path) {
    return {
        plugins: [
            new CleanWebpackPlugin([path], {
                root: process.cwd()
            })
        ]
    }
}