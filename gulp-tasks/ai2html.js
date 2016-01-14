var gulp    = require('gulp');
var changed = require('gulp-changed');

var src = 'src/html/partials/ai2html/**/*';

gulp.task('ai2html-dev', function() {

	return gulp.src(src)
		.pipe(changed('dist/dev/assets'))
		.pipe(gulp.dest('dist/dev/assets'));

});
