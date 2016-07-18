module.exports = {
	proxy: 'http://localhost/_jsdev/pagecontroller.js',
	webpack: {
		entry: 'src/js/main.js',
		resolveExtensions: ['', '.js', '.json', '.es6']
	},
	src: {
		html: './*.html',
		js: './src/js/**/*.js',
		sass: './src/sass/**/*.scss'
	},
	dest: {
		path: './',
		js: './dist',
		css: './dist'
	},
	baseNames: {
		css: 'style',
		js: 'main'
	}
};