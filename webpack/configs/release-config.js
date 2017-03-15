import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import AppCacheWebpackPlugin from 'appcache-webpack-plugin';

import BASE_CONFIG from './base-config';

const ROOT_PATH = path.resolve('./');

export default (qa = false) => ({
    ...BASE_CONFIG,
    devtool: qa ? 'inline-source-map' : 'hidden-source-map',
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
                'https://chayns-res.tobit.com/api/v3.1/css/chayns.min.css',
                'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css'
            ]
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(qa ? 'qa' : 'production')
            }
        }),
    ]
});