var gulp          = require('gulp');
var rename        = require('gulp-rename');
var browserSync   = require('browser-sync');
var webpackStream = require('webpack-stream');
var webpack       = require('webpack');

var config = {
	module: {
		loaders: [
			{ test: /\.csv?$/, loader: 'dsv-loader' },
			{ test: /\.json$/, loader: 'json-loader' },
			{ test: /\.js$/,   loader: 'babel', exclude: /node_modules/ }
		]
	}
};

gulp.task('js-dev', function() {

	config.plugins = [];

	return gulp.src('src/js/main.js')
		.pipe(webpackStream(config))
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('dist/dev/js'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('js-prod', function() {

	config.plugins = [
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.DedupePlugin()
	];

	return gulp.src('src/js/main.js')
		.pipe(webpackStream(config))
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('.tmp/js'));
});
