//node的运行环境
'use strict';
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry:{
        //入口
        'main':'./src/main.js'
    },
    output:{
        //产出
        //产出的目录
        path: path.resolve('./dist'),
        //js文件名
        filename:'build.js'
    },
    module:{
        //加载器
        loaders:[
        //css
            {
                test:/\.css$/,
                loader:'style-loader!css-loader'
            },
        //less
            {
                test:/\.less$/,
                loader:'style-loader!css-loader!less-loader'
            },
        //处理文件
            {
                test:/\.(jpg|png|gif|svg|ttf)$/,
                // loader:'url-loader?limit=4096&name=[name].[ext]'
                loader:'url-loader',
                options:{
                    limit:4096,
                    name:'[name].[ext]'
                }
            },
            //处理js
            {   
                test:/\.js$/,
                loader:'babel-loader',
                exclude:/node_modules/,//排除node_modules
                options:{
                    presets:['env'],//处理es2015/2016/2017语法部分
                    plugins:['transform-runtime'],//处理函数
                }
            },
            //处理vue
            {
                test:/\.vue$/,
                loader:'vue-loader'
            }

        ]
    },
    //处理html
    plugins:[
        new htmlWebpackPlugin({
            template:'./index.html'
        })

    ],
	externals : {
		vue : 'Vue',
		axios : 'axios',
		'vue-router' : 'VueRouter'
	},
	devtool:'inline-source-map'
}