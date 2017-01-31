import { HotModuleReplacementPlugin, NoErrorsPlugin, DefinePlugin } from 'webpack';
import path from 'path';
import fs from 'fs';

const ROOT_PATH = path.resolve('./');

export default {
    entry: [
        'webpack/hot/dev-server',
        'webpack-dev-server/client?https://0.0.0.0:7070',
        'babel-polyfill',
        path.resolve(ROOT_PATH, 'src/index')
    ],
    resolve: {
        extensions: ['', '.js', '.scss']
    },
    output: {
        path: path.resolve(ROOT_PATH, 'build'),
        filename: 'chaynsweb.bundle.js'
    },
    devServer: {
        historyApiFallback: true,
        cert: fs.readFileSync(path.join(__dirname, 'ssl', 'tobitag.crt')),
        key: fs.readFileSync(path.join(__dirname, 'ssl', 'tobitag.key')),
        host: '0.0.0.0',
        port: 7070,
        stats: {
            colors: true
        }
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass',
                include: path.resolve(ROOT_PATH, 'src')
            }
        ]
    },
    devtool: 'inline-source-map',
    plugins: [
        new HotModuleReplacementPlugin(),
        new NoErrorsPlugin(),
        new DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        })
    ]
};