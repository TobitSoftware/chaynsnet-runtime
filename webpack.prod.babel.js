import webpack from 'webpack';
import path from 'path';

const ROOT_PATH = path.resolve('./');

export default {
    entry: [
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
                include: path.resolve(ROOT_PATH, 'src')
            }
        ]
    },
    devtool: "hidden-source-map",
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};