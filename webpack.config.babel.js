import webpack from 'webpack';
import path from 'path';

const ROOT_PATH = path.resolve('./');

export default {
    entry: [
        "webpack/hot/dev-server",
        "webpack-dev-server/client?http://0.0.0.0:8081",
        path.resolve(ROOT_PATH, "src/index")
    ],
    resolve: {
        extensions: ["", ".js"]
    },
    output: {
        path: path.resolve(ROOT_PATH, "build"),
        filename: "app.bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            }
        ]
    },
    devtool: "inline-source-map",
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};