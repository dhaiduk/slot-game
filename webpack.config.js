'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin  = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: '[name].bundle.[contenthash].css',
});

const config = {
    // точка входа для процесса сборки
    entry: {
        main: path.resolve(__dirname, 'src', 'main.js')
    },
    // указываем паблик-директорию для результата сборки
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.[hash].js'
    },
    module: {
        rules: [
        {
            test: /\.(html)$/,
            use: [
                // для демонстрации полной работы загрузчика
                // обработает исходные .html-файлы и скопирует их в output 
                // {
                //     loader: 'file-loader',
                //     options: {
                //         name: '[name]-dist.[ext]' 
                //     },
                // },
                // {
                //     loader: 'extract-loader',
                // }, 
                {
                    loader: 'html-loader',
                    options: {
                        // https://github.com/webpack-contrib/html-loader/issues/131
                        interpolate: true
                    }
                }
            ]
        },
        {
            test: /\.js$/, // как обрабатывать исходные js-файлы
            include: path.resolve(__dirname, 'src'), // где находятся исходные файлы
            loader: 'babel-loader',
            options: {
                presets: ['env', 'stage-0'] // аналог .babelrc 
            }
        }, 
        {
            test: /\.css$/, // как обрабатывать исходные css-файлы
            include: path.resolve(__dirname, 'src'),
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader'
            })
        },
        {
            test: /\.scss$/,
            exclude: [
                path.resolve(__dirname, 'node_modules'),
            ],
            use: extractSass.extract({
                use: [{
                    loader: 'css-loader',
                    options: { minimize:false }
                }, {
                    loader: 'sass-loader',
                    options: {}
                }],
                fallback: 'style-loader'
            })
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    // для сохранения структуры директорий, хранящих изображения
                    context: './src',
                    useRelativePath: true,
                    name: '[name].[ext]'
                }
            }]
        }]
    },
    devtool: 'source-map',
    plugins: [
        extractSass,
        new CleanWebpackPlugin(['dist'], { verbose: true }), // очищать /dist при сборке
        // неприемлемый способ - просто скопировать все изображения в /dist 
        // new CopyWebpackPlugin([{
        //     from: path.join(__dirname, 'src', 'img'),
        //     to: path.join(__dirname, 'dist', 'src', 'img')
        // }]),
        new ExtractTextPlugin('bundle.[hash].css'),
        new HtmlWebpackPlugin({
            //template: 'html-loader!./src/index.html'
            template: path.resolve(__dirname, 'src', 'index.html'),
            filename: 'index.html', // имя
        }),

    ]
}

module.exports = config;