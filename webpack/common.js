import AppCacheWebpackPlugin from 'appcache-webpack-plugin';
import path from 'path';
import autoprefixer from 'autoprefixer';
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const ROOT_PATH = path.resolve('./');

export default {
    entry: {
        chaynsnetRuntime: path.resolve(ROOT_PATH, 'src/index')
    },
    resolve: {
        extensions: ['.js', '.scss']
    },
    output: {
        path: path.resolve(ROOT_PATH, 'build'),
        filename: '[name].bundle.js?[hash]',
        chunkFilename: '[name].chunk.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                postcssFlexbugsFixes,
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 10',
                                    ],
                                    flexbox: 'no-2009',
                                }),
                            ]
                        }

                    },
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(ROOT_PATH, 'index.ejs'),
            manifest: 'appcache.manifest',
            hash: true
        }),
        new AppCacheWebpackPlugin({
            output: 'appcache.manifest',
            cache: [
                'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css'
            ]
        }),
    ],
};
