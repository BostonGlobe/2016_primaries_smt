var gulp        = require('gulp');
var browserSync = require('browser-sync');

// browser-sync task for starting the server.
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: './',
			index: 'preview.html'
		},
		notify: false,
		ghostMode: false
	});
});

gulp.task('browser-sync-reload', function() {
	browserSync.reload();
});
