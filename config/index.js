//全局配置
var config = {
		htmloptions:{//压缩html配置
				removeComments: true,//清除HTML注释
	        	collapseWhitespace: true,//压缩HTML
	        	collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
	        	removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
	        	removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
	        	removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
	        	minifyJS: true,//压缩页面JS
	        	minifyCSS: true//压缩页面CSS
		},
		serveroptions:{
			root:"./dist",//dist作为服务器
		 	port:8000,//端口号  8080经常被占用
			livereload: true
		},
		pages:["index","list","car"],
		cssoptions:{//css配置
			"index":{//index页面的css文件  准备存放准备合并的css
				"common":["./src/stylesheets/reset.scss","./src/views/index/stylesheets/common/*.scss"],
				"index":"./src/views/index/stylesheets/index/*.scss"
			},
			"list":{
				"list":["./src/stylesheets/reset.scss","./src/views/list/*/*.scss"]
			}
		},
		jsoptions:{//js配置
			"index":{
					index:"./src/views/index/javascript/index.js",
		    		vendor:"./src/views/index/javascript/vendor.js"
			},
			 "list": "./src/views/list/javascripts/list.js"
		}
	}
	//把config暴露出去 方便其他地方引用，只能暴露一次
	module.exports = config;