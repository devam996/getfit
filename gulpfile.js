var gulp = require('gulp');
var clc = require('cli-color');
var path = require('path');
var runSequence = require('run-sequence');
var plugins = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'gulp.*'],
	replaceString: /\bgulp[\-.]/,
	camelize: true,
	lazy: true
});

var development = plugins.environments.development;
var production = plugins.environments.production;
var folderName = '';
if (!production()) {
	plugins.environments.current('development');
}

var gulp_src = gulp.src;
gulp.src = function() {
	return gulp_src.apply(gulp, arguments)
		.pipe(plugins.plumber(function(error) {
			plugins.util.log(clc.red.bold('Error (' + error.plugin + '): ' + error.message));
			plugins.util.log(clc.yellow.bold('Error File:' + error.fileName));
			plugins.util.log(clc.blue.bold('Error Cause: ' + error.cause));
			plugins.util.log(clc.red.bold('ERROR' + error));
			this.emit('end');
		}));
};



gulp.task('scripts::vendors', function() {
	var basePath = './resources/assets/js/lib/';
	var vendorFilesArray = [
		// 'lodash.min.js',
		// 'moment.min.js',
		// 'store.min.js',
        'angular.min.js',
        'angular-animate.min.js',
        'angular-aria.min.js',
        'angular-messages.min.js',
        'angular-sanitize.min.js',
        'angular-material.min.js'
	];

	var vendorSrc = vendorFilesArray.map(function(file) {
		return path.join(basePath, file);
	});

	vendorSrc.push(path.join(basePath, '*.js'));

	gulp.src(vendorSrc)
		.pipe(plugins.concat('vendor.js'))
		.pipe(gulp.dest('./public/js'));
});

gulp.task('templates::build', function() {
	gulp.src('./resources/assets/templates/**/*.html')
		.pipe(plugins.htmlmin({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('./public/templates'));
});

gulp.task('sass::build', function() {
	gulp.src('./resources/assets/sass/**/*.scss')
		.pipe(development(plugins.sourcemaps.init()))
		.pipe(plugins.sass({
			outputStyle: production() ? 'compressed' : 'expanded'
		}))
		.pipe(plugins.autoprefixer('last 2 versions'))
		.pipe(development(plugins.sourcemaps.write()))
		.pipe(gulp.dest('./public/css'));
});



gulp.task('scripts::build', function() {
	var src_ang_path = [];
	var angular_files_order = ['module', 'config', 'service', 'factory', 'filter', 'directive', 'controller', 'animation'];

	src_ang_path = angular_files_order.map(function(file) {
		return path.join('./resources/assets/js/src', '/**/*' + file + '.js');
	});

	return gulp.src(src_ang_path)
		.pipe(production(plugins.sourcemaps.init()))
		.pipe(plugins.concat(folderName + 'App.js'))
		.pipe(production(plugins.uglify()))
		.pipe(production(plugins.sourcemaps.write('./')))
		.pipe(gulp.dest('./public/js'));
});

function isChanged(file) {
	
	if (file.extname == '.js') {
		var splitArray = file.path.split('/');
		folderName = splitArray[splitArray.length - 2];

		return runSequence('scripts::build');

	} else if (file.extname == '.scss') {
		return runSequence('sass::build');

	} else if (file.extname == '.html') {
		return runSequence('templates::build');

	}
}

gulp.task('clean', function() {
	return gulp.src(['./public/js/*', './public/css/*'])
		.pipe(plugins.clean());
});

var watchFilter = plugins.filter(isChanged);

gulp.task('watch', ['scripts::build', 'sass::build', 'templates::build'], function() {
	return gulp.src('*', {
			read: false
		})
		.pipe(plugins.watch(['./resources/assets/**/*'], {
			read: false
		}))
		.pipe(watchFilter);
});

gulp.task('build', ['clean', 'scripts::vendors', 'scripts::build', 'sass::build', 'templates::build']);

gulp.task('default', ['watch']);