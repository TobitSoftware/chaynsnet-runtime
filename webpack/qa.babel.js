import webpack from 'webpack';
import config from './prod.babel';

config.devtool = 'inline-source-map';

config.plugins.pop();
config.plugins.push(
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('qa')
        }
    })
);

export default config;