import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import AppCacheWebpackPlugin from 'appcache-webpack-plugin';

const ROOT_PATH = path.resolve('./');

export default {
    entry: {
        chaynsweb: [
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
    devtool: 'hidden-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(ROOT_PATH, 'index.html'),
            hash: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        }),
        new AppCacheWebpackPlugin({
            output: 'appcache.manifest',
            cache: [
                'https://chayns-res.tobit.com/api/v3.1/js/chayns.min.js',
                'https://chayns-res.tobit.com/api/v3.1/css/chayns.min.css',
                'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css'
            ]
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
    ]
};