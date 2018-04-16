const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const WebpackDevServer = require("webpack-dev-server");

fs.open('./src/config/env.js', 'w', function(err, fd) {
    const buf = 'export default "development";';
    fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});

module.exports = merge(webpackBaseConfig, {
    devtool: '#source-map',
    output: {
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            filename: 'vendors.js'
        }),
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: './src/template/index.ejs',
            chunks: ['vendors', 'main'],
            inject: false
        })
    ],
    devServer: {
        contentBase: "./",
        open: true,
        inline: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
        host: '127.0.0.1',
        port: 8080,
        proxy: {
            '/user-apis': {
                target: 'http://192.168.0.155/',
                //target: 'http://192.168.0.231:8088/',
                changeOrigin: true,
                secure: false
            },
            '/task_server': {
                target: 'http://192.168.0.155',
                changeOrigin: true,
                secure: false
            },
            '/task_server/socket': {
                target: 'ws://192.168.0.155',
                ws: true
            },
            '/images': {
                target: 'http://192.168.0.155/',
                //target: 'http://192.168.0.231:8088/',
                changeOrigin: true,
                secure: false
            }
        }
    }
});