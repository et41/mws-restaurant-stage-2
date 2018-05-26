var gulp = require('gulp');
var sass = require('gulp-sass');
let cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var browserSync = require('browser-sync');

gulp.task('default', ['serve','styles','minify-css','scripts','minify'], function() {

});
/*gulp.task('dist', [
	'styles',
	'scripts-dist',
	'minify',
	'serve',
]);*/


gulp.task('minify', function() {
  return gulp.src('*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(htmlmin({removeComments: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
	gulp.src('css/**/*.css')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(gulp.dest('/sass'))
});

gulp.task('minify-css', function() {
  return gulp.src('css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('sass'));
});

gulp.task('scripts', function() {
	return gulp.src(['js/**/dbhelper.js', 'js/**/main.js', 'js/**/intersection.js', 'js/**/mainRestaurants.js'])
		.pipe(concat('all.js'))
		.pipe(gulp.dest('js'))
});

gulp.task('watch', function() {
  gulp.watch('css/*.css', ['minify-css']);
  gulp.watch('js/*.js', ['scripts']);
});


gulp.task('serve', ['scripts', 'minify-css','styles'], function() {
  browserSync.init({
    server: '.',
    port: 8000
  });
  gulp.watch('css/*.css', ['minify-css']).on('change', browserSync.reload);
  gulp.watch('js/*.js', ['scripts']).on('change', browserSync.reload);
  gulp.watch('css/*.css', ['styles']).on('change', browserSync.reload);

  gulp.watch('*.html').on('change', browserSync.reload);
});


