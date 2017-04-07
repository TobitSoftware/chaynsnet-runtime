import { HotModuleReplacementPlugin, NoEmitOnErrorsPlugin, DefinePlugin } from 'webpack';
import path from 'path';
import fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import BASE_CONFIG from './configs/base-config';

const ROOT_PATH = path.resolve('./');


const ssl = {};

try {
    ssl.cert = fs.readFileSync(path.join(__dirname, 'ssl', 'ssl.crt'));
    ssl.key = fs.readFileSync(path.join(__dirname, 'ssl', 'ssl.key'));
} catch (e) {
    console.log('\n---------------------------\nNo SSL Certificate found.\n---------------------------\n');
}

export default {
    ...BASE_CONFIG,
    devServer: {
        historyApiFallback: true,
        cert: ssl.cert,
        key: ssl.key,
        host: '0.0.0.0',
        port: 7070,
        stats: {
            colors: true
        }
    },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(ROOT_PATH, 'index.ejs')
        }),
        new DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),
        new HotModuleReplacementPlugin(),
        new NoEmitOnErrorsPlugin(),
    ]
};
