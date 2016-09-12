import webpack from 'webpack';
import path from 'path';

const ROOT_PATH = path.resolve('./');

export default {
    entry: [
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
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                include: path.resolve(ROOT_PATH, 'src')
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass',
                include: path.resolve(ROOT_PATH, 'src')
            }
        ]
    },
    devtool: 'hidden-source-map',
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};