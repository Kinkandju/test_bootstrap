const source_folder = "src";
const project_folder = "project";

const path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/assets/img/",
		fonts: project_folder + "/assets/fonts/"
	},
	src: {
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
		css: source_folder + "/scss/style.scss",
		js: source_folder + "/js/*.js",
		img: source_folder + "/assets/img/**/*.{jpg,png,gif,ico,webp}",
		fonts: source_folder + "/assets/fonts/*.{woff,woff2}"
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/assets/img/**/*.{jpg,png,gif,ico,webp}"
	},
	clean: "./" + project_folder + "/"
}

const { src, dest } = require("gulp"),
	gulp = require("gulp"),
	browsersync = require("browser-sync").create(),
	fileinclude = require("gulp-file-include"),
	del = require("del"),
	sass = require("gulp-sass")(require("sass")),
	autoprefixer = require("gulp-autoprefixer"),
	cleancss = require("gulp-clean-css"),
	rename = require("gulp-rename"),
	groupmedia = require("gulp-group-css-media-queries");

const browserSync = (params) => {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		port: 3000,
		notify: false
	})
}

const parseHtml = () => {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}

const parseCss = () => {
	return src(path.src.css)
		.pipe(
			sass({
				outputStyle: "expanded"
			})
		)
		.pipe(
			groupmedia()
		)
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)
		.pipe(dest(path.build.css))
		.pipe(cleancss())
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}

const parseJs = () => {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}

const createImages = () => {
	return src(path.src.img)
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
}

const parseFonts = () => {
	return src(path.src.fonts)
		.pipe(dest(path.build.fonts))
		.pipe(browsersync.stream())
}

const watchFiles = (params) => {
	gulp.watch([path.watch.html], parseHtml);
	gulp.watch([path.watch.css], parseCss);
	gulp.watch([path.watch.js], parseJs);
	gulp.watch([path.watch.img], createImages);
}

const cleanFolder = (params) => {
	return del(path.clean);
}

let build = gulp.series(cleanFolder, gulp.parallel(parseHtml, parseCss, parseJs, createImages, parseFonts,));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.parseFonts = parseFonts;
exports.createImages = createImages;
exports.parseJs = parseJs;
exports.parseCss = parseCss;
exports.parseHtml = parseHtml;
exports.build = build;
exports.watch = watch;
exports.default = watch;