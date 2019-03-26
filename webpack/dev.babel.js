import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import merge from 'webpack-merge';
import common from './common';

const ROOT_PATH = path.resolve('./');

const ssl = {};

try {
    ssl.cert = fs.readFileSync(path.join(__dirname, 'ssl', 'ssl.crt'));
    ssl.key = fs.readFileSync(path.join(__dirname, 'ssl', 'ssl.key'));
} catch (e) {
    // eslint-disable-next-line no-console
    console.log('\n---------------------------\nNo SSL Certificate found.\n---------------------------\n');
}

export default merge(
    common,
    {
        mode: 'development',
        output: {
            filename: '[name].bundle.js',
        },
        devServer: {
            host: '0.0.0.0',
            port: 7070,
            historyApiFallback: true,
            compress: true,
            disableHostCheck: true,
            cert: ssl.cert,
            key: ssl.key,
        },
        devtool: 'inline-source-map',
        plugins: [
            new webpack.DefinePlugin({
                __DEV__: true,
                __STAGING__: false,
                __PROD__: false,
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.LoaderOptionsPlugin({
                debug: true
            }),
            new webpack.NamedModulesPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new HtmlWebpackPlugin({
                template: path.resolve(ROOT_PATH, 'index.ejs')
            }),
        ]
    }
);