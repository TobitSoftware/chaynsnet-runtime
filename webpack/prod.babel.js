import webpack from 'webpack';
import path from 'path';
import AppCacheWebpackPlugin from 'appcache-webpack-plugin';

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
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('live')
            }
        }),
        new AppCacheWebpackPlugin({
            output: 'appcache.manifest',
            cache: [
                'https://chayns-res.tobit.com/api/v3.1/js/chayns.min.js',
                'https://chayns-res.tobit.com/api/v3.1/css/chayns.min.css'
            ]
        })
    ]
};