	//引入gulp
	var gulp = require("gulp");
	//压缩html
	var htmlmin = require("gulp-htmlmin");
	//全局配置--因为是模块化 所以不用写后缀名.js
	//var congfig = require("./config/index")
	var config = require("./config");//默认寻找index文件所以可以省略
	//热更新服务器
	var connect = require("gulp-connect");
	//合并css
	var concat = require("gulp-concat");
	//压缩css
	var minifycss = require("gulp-minify-css");
	//css加前缀
	var  autoprefixer = require("gulp-autoprefixer");
	//重命名
	var rename = require("gulp-rename")
	//合并文件流
	var merge = require("merge-stream")
	//小型webpack
	var webpack = require("webpack-stream")
	//自动引入依赖文件
	var inject = require("gulp-inject")
	//编译sass
	var sass = require("gulp-sass");
	//处理html 将SRC中HTML文件输出到dist中
	gulp.task("handle:html",function(){
		return gulp.src("./src/views/*/*.html")
		    //.pipe(htmlmin(config.htmloptions))
		    .pipe(gulp.dest("./dist"))
	})
	//处理CSS 合并CSS 压缩CSS 前缀 输出
	gulp.task("handle:css",function(){
		let streams = [];//存放下面多个文件流shuzu
		for( var page in config.cssoptions ){
			for( var file in config.cssoptions[page]){
				let stream = gulp.src(config.cssoptions[page][file])
				   .pipe(sass({ outputStyle:"compressed" }))//把sass转成css
		           .pipe(autoprefixer({
           			    browsers: ['last 2 versions','Safari >0', 'Explorer >0', 'Edge >0', 'Opera >0', 'Firefox >=20'],//last 2 versions- 主流浏览器的最新两个版本
            			cascade: false, //是否美化属性值 默认：true 像这样：
            			//-webkit-transform: rotate(45deg);
          			    //transform: rotate(45deg);
                        remove:true //是否去掉不必要的前缀 默认：true 
                    }))
		           .pipe(concat(file+".css"))//合并
		           //.pipe(minifycss())//压缩
		           .pipe(rename({suffix:'.min'}))
		           .pipe(gulp.dest("./dist/"+page+"/css"))
		             streams.push(stream)
			}
		}
		 return merge( ...streams )//展开运算符
	})
	//处理js es6--编译成es5 合并 压缩
	gulp.task("handle:js",function(){
		/*gulp.src("/src/entry.js")//随便写一个
		//真正处理开始
		    .pipe(webpack({
		    	mode:"production",//设置打包模式：none development production(会压缩代码)
		    	//单入口 单出口
		    	/*entry:"./src/views/index/javascript/index.js",//入口
		    	output:{
		    		filename:"index.js"
		    	}*/
		    	//多入口 单出口----谁在前面 打包也在前面
		    	/*entry:["./src/views/index/javascript/index.js","./src/views/index/javascript/vendor.js"],//入口
		    	output:{
		    		filename:"index.js"
		    	}
		    	//多入口 多出口
		    	entry:{
		    		   index:"./src/views/index/javascript/index.js",
		    		   vendor:"./src/views/index/javascript/vendor.js"
		        },//入口
		    	output:{
		    		filename:"[name].min.js"//[name]--entry中键名是什么打包出来就是什么
		    	}
		    }))
		    .pipe(gulp.dest("./dist/index/js"))*/
		   let streams=[];
		   for( const page in config.jsoptions ){
		    let entry = config.jsoptions[page]
		    //如果是数组---多出口  字符串--单出口
        let filename = Array.isArray(entry) || ((typeof entry) === 'string') ? page : '[name]'
		let stream = gulp.src('src/entry.js')
        				.pipe(webpack({
                		mode: 'production',
                		entry: entry,
               			 output: { filename: filename+'.min.js' },
               			 module: {
                   			 rules: [ //webpack中在这里使用各种loader对代码进行各种编译
                       			 {
		                            test: /\.js$/, // 对js文件进行处理
		                            loader: 'babel-loader', // 使用babel-loader对其进行处理
		                            query: {
		                                presets: ['es2015'] // 将es6编译一下
		                          }
                        }
                    ]
                }
           			 }))
            			.pipe(gulp.dest('./dist/' + page + '/js'))
       				 streams.push(stream)
		   }
		  return merge( ...streams )
	})
	//给各页面对应的html文件添加依赖
	gulp.task('inject', function () {
		setTimeout(()=>{
			config.pages.forEach( page =>{
				var target = gulp.src('./dist/'+page+'/'+page+'.html');
			  	var sources = gulp.src(['./dist/'+page+'/js/*.js', './dist/'+page+'/css/*.css'], {read: false});
			    target.pipe(inject(sources,{ignorePath:"/dist"}))
			          .pipe(gulp.dest('./dist/'+page+''));
			} )
		},2000)
	});
	//监听函数
	gulp.task("watch",function(){
		gulp.watch("./src/views/*/*.html",["handle:html","inject","reload"])
		gulp.watch("./src/**/*.css",["handle:css","inject","reload"]),
		gulp.watch("./src/**/*.js",["handle:js","inject","reload"])
	})
	//热更新服务器
	gulp.task("server",function(){
		connect.server(config.serveroptions)
	})
	//文档内容有改变 服务器自动刷新
	gulp.task("reload", function(){
		gulp.src("./dist/**/*.html")//让所有html文件重新加载一下
		    .pipe(connect.reload());
	})
	//默认任务
	gulp.task("default",["server","handle:html","handle:css","handle:js","inject","watch"])
