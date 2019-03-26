import webpack from 'webpack';
import merge from 'webpack-merge';
import common from './common';

export default merge(
    common,
    {
        mode: 'production',
        devtool: 'inline-source-map',
        plugins: [
            new webpack.DefinePlugin({
                __DEV__: false,
                __STAGING__: false,
                __PROD__: true,
            }),
        ]
    }
);
