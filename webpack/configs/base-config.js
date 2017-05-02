import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import AppCacheWebpackPlugin from 'appcache-webpack-plugin';

const ROOT_PATH = path.resolve('./');

export default {
    entry: {
        chaynsweb: [
            'babel-polyfill',
            path.resolve(ROOT_PATH, 'src/index')
        ]
    },
    resolve: {
        extensions: ['.js', '.scss']
    },
    output: {
        path: path.resolve(ROOT_PATH, 'build'),
        filename: '[name].bundle.js?[hash]'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],
                include: path.resolve(ROOT_PATH, 'src')
            }
        ]
    }
};