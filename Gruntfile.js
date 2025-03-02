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
						arr.push(file.replace(path.normalize(__dirname + "/"), ""));
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
		clean: {
			options: {
				force: true,
			},
			zip: [
				'*.zip',
				'assets/plugins/emoji/fonts/**/*'
			],
		},
		concat: {
			options: {
				separator: "\n",
			},
			emoji: {
				src: [
					'src/js/plugin.js'
				],
				dest: 'assets/plugins/emoji/js/plugin.js'
			},
		},
		uglify: {
			options: {
				sourceMap: false,
				compress: {
					drop_console: true
				},
				output: {
					ascii_only: true
				}
			},
			app: {
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'assets/plugins/emoji/js/plugin.js'
						],
						dest: 'assets/plugins/emoji/js/',
						filter: 'isFile',
						rename: function (dst, src) {
							return dst + '/' + src.replace('.js', '.min.js');
						}
					},
					{
						expand: true,
						flatten : true,
						src: [
							'src/pug/javascript.js'
						],
						dest: 'src/pug/',
						filter: 'isFile',
						rename: function (dst, src) {
							return dst + '/' + src.replace('.js', '.min.js');
						}
					}
				]
			},
		},
		less: {
			css: {
				options : {
					compress: false,
					ieCompat: false,
					plugins: [],
					modifyVars: {
						'font-path': '/assets/plugins/emoji/fonts',
						'font-default': "'Times News Roman'",
						'font-input-text': "'Calibri'",
						'font-input-button': "'Play'",
						'font-textarea-text': "'Open Sans'",
						'font-selector-text': "'Tahoma'"
					}
				},
				files : {
					'assets/plugins/emoji/css/noto-color-emoji.css': [
						'src/less/noto_color_emoji.less'
					],
					'assets/plugins/emoji/css/emoji.css': [
						'src/less/emoji.less'
					],
					'assets/plugins/emoji/css/plugin.css': [
						'src/less/plugin.less'
					]
				}
			},
		},
		autoprefixer:{
			options: {
				browsers: [
					"last 4 version"
				],
				cascade: true
			},
			css: {
				files: {
					'assets/plugins/emoji/css/noto-color-emoji.css' : [
						'assets/plugins/emoji/css/noto-color-emoji.css'
					],
					'assets/plugins/emoji/css/emoji.css' : [
						'assets/plugins/emoji/css/emoji.css'
					],
					'assets/plugins/emoji/css/plugin.css' : [
						'assets/plugins/emoji/css/plugin.css'
					],
				}
			},
		},
		group_css_media_queries: {
			options: {},
			files: {
				'assets/plugins/emoji/css/noto-color-emoji.css': [
					'assets/plugins/emoji/css/noto-color-emoji.css'
				],
				'assets/plugins/emoji/css/emoji.css': [
					'assets/plugins/emoji/css/emoji.css'
				],
				'assets/plugins/emoji/css/plugin.css' : [
					'assets/plugins/emoji/css/plugin.css'
				],
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
					'assets/plugins/emoji/css/emoji.min.css' : [
						'assets/plugins/emoji/css/emoji.css'
					],
					'assets/plugins/emoji/css/plugin.min.css' : [
						'assets/plugins/emoji/css/plugin.css'
					],
				}
			},
		},
		copy: {
			src: {
				expand: true,
				cwd: 'src/fonts',
				src: [
					'**'
				],
				dest: 'assets/plugins/emoji/fonts/',
			}
		},
		pug: {
			serv: {
				options: {
					doctype: 'html',
					client: false,
					pretty: "",//'\t',
					separator:  "",//'\n',
					data: function(dest, src) {
						return {
							"hash_css": hash(
								'assets/plugins/emoji/css/emoji.min.css',
								'assets/plugins/emoji/css/plugin.min.css',
								'assets/plugins/emoji/css/emoji.min.css'
							),
							'hash_js': hash('assets/plugins/emoji/js/plugin.min.js'),
						}
					}
				},
				files: [
					{
						expand: true,
						cwd: __dirname + '/src/pug/',
						src: [ '*.pug' ],
						dest: __dirname + '/assets/plugins/emoji/',
						ext: '.html'
					},
				]
			},
		},
		compress: {
			main: {
				options: {
					archive: 'emoji.zip'
				},
				files: [
					{
						expand: true,
						cwd: '.',
						src: [
							'assets/**',
							'install/**',
						],
						dest: '/emoji/'
					},
				],
			},
		},
	});
	grunt.registerTask('default',	[
		'clean',
		'concat',
		'uglify',
		'less',
		'autoprefixer',
		'group_css_media_queries',
		'cssmin',
		'copy',
		'pug',
		'compress'
	]);
}
