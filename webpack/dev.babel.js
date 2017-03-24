import { HotModuleReplacementPlugin, NoEmitOnErrorsPlugin, DefinePlugin } from 'webpack';
import path from 'path';
import fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const ROOT_PATH = path.resolve('./');


const ssl = {};

try {
    ssl.cert = fs.readFileSync(path.join(__dirname, 'ssl', 'ssl.crt'));
    ssl.key = fs.readFileSync(path.join(__dirname, 'ssl', 'ssl.key'));
} catch (e) {
    console.log('\n---------------------------\nNo SSL Certificate found.\n---------------------------\n');
}


export default {
    entry: {
        chaynsweb: [
            'babel-polyfill',
            'webpack/hot/dev-server',
            'webpack-dev-server/client?https://0.0.0.0:7070',
            path.resolve(ROOT_PATH, 'src/index')
        ]
    },
    resolve: {
        extensions: ['.js', '.scss']
    },
    output: {
        path: path.resolve(ROOT_PATH, 'build'),
        filename: '[name].bundle.js'
    },
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
                    'sass-loader'
                ],
                include: path.resolve(ROOT_PATH, 'src')
            }
        ]
    },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(ROOT_PATH, 'index.html')
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