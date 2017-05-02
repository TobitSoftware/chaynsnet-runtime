/**
 * Config for the postcss-loader that we use in our webpack config.
 *
 * The postcss-loader edits your css, with the plugins you add in this config, before it becomes appended to the bundle.
 *
 * We add autoprefixer as an plugin for the postcss-loader.
 *
 * autoprefixer? wait!whaat?? Check this repository for details -> [https://github.com/postcss/autoprefixer]
 */

module.exports = {
    plugins: [
        require('autoprefixer')
    ]
};