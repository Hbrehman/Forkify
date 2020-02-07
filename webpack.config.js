// In webpack there are four core concepts
//1) Entry point is the point where the webpack start the bundling.This is the file where webpack will look for files that it needs to bundle.
//2) output tells the webpack where to save the files
// loaders in webpack allow us to import or load all kind of different files and more importantly to also process them like converting sass to css and converting es6 to es5
// plugins allow us to do complex processing of our input files and in our case of index.html file
const htmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
module.exports = {
    entry: ['babel-polyfill' ,'./src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};