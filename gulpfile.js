var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var imageop = require('gulp-image-optimization');

/**
 * Gulp main task to build the production version of the app.
 */
gulp.task('build', ['html', 'css', 'js', 'img', 'vendor']);

/**
 * Minifies HTML files and moves them to the build directory.
 */
gulp.task('html', function () {
	gulp.src('index.html')
		.pipe(htmlmin({
			removeComments: true,
			collapseWhitespace: true,
			minifyJs: true,
			minifyCSS: true
		}))
		.pipe(gulp.dest('build'));
});

/**
 * Minifies CSS files and moves them to the build directory.
 */
gulp.task('css', function () {
	gulp.src('css/*.css')
		.pipe(cssmin())
		.pipe(gulp.dest('build/css'));
});

/**
 * Minifies JS files and moves them to the build directory.
 */
gulp.task('js', function () {
	gulp.src('js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('build/js'));
});

/**
 * Moves all the images to the build directory.
 */
gulp.task('img', function () {
	gulp.src('img/*')
		.pipe(gulp.dest('build/img'));
});

/**
 * Moves the libs into the build directory.
 */
gulp.task('vendor', function () {
	gulp.src('lib/**/*')
		.pipe(gulp.dest('build/lib'));
});

/**
 * The Moderniz js library is not minified, minifies it.
 * This task should be called before the main task build if
 * we want to have modernizr minified.
 */
gulp.task('min-modernizr', function () {
	gulp.src('lib/modernizr/modernizr.js')
		.pipe(uglify())
		.pipe(gulp.dest('lib/modernizr'));
});

/**
 * Optimizes the images. This task should be called before the build task
 * if we want optimized images in the production version of the app.
 */
gulp.task('optim-img', function () {
	gulp.src('img/*')
		.pipe(imageop({
			optimizationLevel: 5,
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest('img'));
});
