var gulp          = require('gulp');
var browserSync   = require('browser-sync');
var rollup        = require('rollup');
var babel         = require('rollup-plugin-babel');
var npm           = require('rollup-plugin-npm');
var commonjs      = require('rollup-plugin-commonjs');
var uglify        = require('rollup-plugin-uglify');

gulp.task('js-dev', function(done) {
	bundleJS(false, function() {
		done();
	});
});

gulp.task('js-prod', function(done) {
	bundleJS(true, function() {
		done();
	});
});

function bundleJS(isProd, done) {

	var plugins = [
		babel({
			exclude: 'node_modules/**'
		}),
		npm({ jsnext: true, main: true }),
		commonjs()
	];

	if (isProd) plugins.push(uglify());
	var output = isProd ? '.tmp/js/bundle.js' : 'dist/dev/js/bundle.js';

	rollup.rollup({
		entry: 'src/js/main.js',
		plugins: plugins
	})
	.catch(function(error) {
		console.log(error);
	})
	.then(function(bundle) {
		return bundle.write({
			format: 'iife',
			dest: output
		});
	})
	.catch(function(error) {
		console.log(error);
	})
	.then(function() {
		if (!isProd) {
			browserSync.reload(output);
		}
		done();
	});

}

