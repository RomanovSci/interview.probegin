const path = require('path');
const webpack = require('webpack');

let config = {
    entry: ['babel-polyfill', "./frontend/main.js"],
    devtool: 'source-map',

    output: {
        path: './web/assets/',
        filename: "./bundle.js",
        publicPath: "/assets/"
    },
    resolve: {
        root: path.resolve('./frontend'),
        extensions: ['', '.js', '.es6', '.jsx'],
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx|es6)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.(css|scss)$/,
                loaders: [
                    'style-loader',
                    'css-loader',
                    'sass-loader?'
                    + 'includePaths[]=' + path.resolve(__dirname + '/../styles')
                    + '&includePaths[] = ' + path.resolve(__dirname, "./node_modules/compass-mixins/lib"),
                ]
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=30000&name=[name].[ext]'
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            },
            {
                test: /\.(ttf|eot|svg|woff|woff2)(\?[\w\d]+)/,
                loader: "file-loader"
            }
        ],
    }
};

if (process.env.NODE_ENV === 'production') {
    config.plugins = [];

    config.plugins.push(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }));

    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
}

module.exports = config;