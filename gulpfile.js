'use strict'

const gulp 			= require("gulp");
const sass			= require("gulp-sass");
const autoprefixer	= require("gulp-autoprefixer");
const concat		= require("gulp-concat");
const del			= require("del");
const uglify		= require("gulp-uglify");
const rename		= require("gulp-rename");
const sourcemaps	= require("gulp-sourcemaps");
const browserSync	= require("browser-sync").create();

const srcScssDir = "./src/scss/";
const srcJsDir = "./src/js/";

const buildCssDir = "./css/";
const buildJsDir = "./js/";

const outputStylesFile = "styles.css";
const outputScriptFile = "scripts.js";

function scss() {
	del([buildCssDir + "*"]);
	return gulp.src(srcScssDir + "**/*.scss")
		.pipe(sourcemaps.init())
		.pipe(sass({
			errorLogToConsole: true,
			outputStyle: "compressed"
		}))
		.on('error', console.error.bind(console))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 5 versions'],
			cascade: false
		}))
		.pipe(concat(outputStylesFile))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(buildCssDir))
		.pipe(browserSync.stream());
}

function js() {
	del([buildJsDir + "*"]);

	gulp.src([	'node_modules/jquery/dist/jquery.js',
				'node_modules/popper.js/dist/umd/popper.js',
				'node_modules/bootstrap/dist/js/bootstrap.js'	])
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(rename({suffix: ".min"}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(buildJsDir));

	return gulp.src(srcJsDir + "**/*.js")
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(concat(outputScriptFile))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(buildJsDir));
}

function watch() {
	browserSync.init({
		server: {
			baseDir: "./"
		},
		port: 3000
	});

	gulp.watch(srcScssDir + "**/*.scss", {delay: 300}, scss);
	gulp.watch(srcJsDir + "**/*.js", {delay: 300}, gulp.series(js, reload));
	gulp.watch("./**/*.html", {delay: 300}, reload);
}

function build(done) {
	scss();
	js();
	done();
}

function reload(done) {
	browserSync.reload();
	done();
}

exports.default = gulp.series(build, watch);
exports.build = build;