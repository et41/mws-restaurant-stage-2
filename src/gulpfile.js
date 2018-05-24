var gulp = require('gulp');
var sass = require('gulp-sass');
let cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');

gulp.task('default', ['styles','minify-css','scripts','minify'], function() {

});
gulp.task('dist', [
	'styles',
	'scripts-dist',
	'minify'
]);


gulp.task('minify', function() {
  return gulp.src('*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(htmlmin({removeComments: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
	gulp.src('sass/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(gulp.dest('/css'))
});

gulp.task('minify-css', function() {
  return gulp.src('css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('sass'));
});
gulp.task('scripts', function() {
	gulp.src(['js/**/dbhelper.js','js/**/main.js'])
		.pipe(concat('all.js'))
		.pipe(gulp.dest('dist/js'));
});


gulp.task('scripts-dist', function() {
	gulp.src(['js/**/dbhelper.js','js/**/main.js'])
		.pipe(concat('all.js'))
		.pipe(uglify().on('error', uglify.logError))
		.pipe(gulp.dest('dist/js'));
});

