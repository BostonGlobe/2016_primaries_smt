var gulp = require('gulp');
var shell = require('shelljs');

gulp.task('chmod-prod', function(done) {

  shell.exec('chmod -R 775 dist/prod');

	done();

});
