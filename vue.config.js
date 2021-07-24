module.exports = {
    // css 相关选项
    css: {
        /*为预处理器 loader 传递自定义选项*/
        loaderOptions: {
            sass: {
                prependData: `@import "@/assets/common.scss";`
            }
        }
    },
    configureWebpack: (config) => {
        config.module.rules.push({
            test: /\.csv$/,
            use: [
                "csv-loader"
            ]
        })
    }
}