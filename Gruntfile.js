module.exports = function(grunt) {
	const fs = require('fs'),
		path = require('path'),
		chalk = require('chalk'),
		hash = function (...args) {
			let md5 = require('md5'),
				result = "",
				arr = [];
			if(!args.length){
				let time = (new Date()).getTime();
				arr.push("Not arguments");
				result = md5(time).toString();
			}else{
				let text = "";
				for(let index in args){
					let file = args[index];
					file = path.normalize(path.join(__dirname, file));
					try{
						let buff = fs.readFileSync(file, {
							encoding: "utf8"
						}).toString();
						text += buff;
						arr.push(file);
					}catch(e){
						// Ничего не делаем
						arr.push("Not found");
					}
				}
				result = md5(text).toString();
			}
			arr.push(result);
			grunt.log.oklns([chalk.cyan("Generate hash:") + "\n" + chalk.yellow(arr.join("\n"))]);
			return result;
		};

	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({
		globalConfig: {},
		pkg: {},
		less: {
			css: {
				options : {
					compress: false,
					ieCompat: false,
					plugins: [],
					modifyVars: {
						'font-path': '/assets/plugins/emoji/fonts',
					}
				},
				files : {
					'assets/plugins/emoji/css/noto-color-emoji.css': [
						'src/less/noto_color_emoji.less'
					]
				}
			},
		},
		cssmin: {
			options: {
				mergeIntoShorthands: false,
				roundingPrecision: -1
			},
			minify: {
				files: {
					'assets/plugins/emoji/css/noto-color-emoji.min.css' : [
						'assets/plugins/emoji/css/noto-color-emoji.css'
					],
				}
			},
		},
		copy: {
			fonts: {
				expand: true,
				cwd: 'node_modules/@fontsource/noto-color-emoji/files',
				src: [
					'**'
				],
				dest: 'assets/plugins/emoji/fonts/',
			},
		}
	});
	grunt.registerTask('default',	[
		//'concat',
		//'uglify',
		'less',
		//'autoprefixer',
		'cssmin',
		//'pug',
		'copy'
	]);
}
