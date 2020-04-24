const gulp = require("gulp"),
    { series } = require("gulp"),
    gulpts = require("gulp-typescript"),
    sourcemaps = require("gulp-sourcemaps"),
    del = require("del"),
    tsProject = gulpts.createProject("tsconfig.json"),
    gulptslint = require("gulp-tslint"),
    builddir = "artifacts/build/",
    sources = {
        ts: "+(lib|tests)/**/*.ts",
        js: "+(lib|tests)/**/*.js*",
    };

function onError(callback) {
    process.exit(1);
    callback();
}

function js() {
    return gulp.src([sources.js]).pipe(gulp.dest(builddir));
}

function ts() {
    return gulp
        .src(sources.ts)
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .on("error", onError)
        .js.pipe(sourcemaps.write("."))
        .pipe(gulp.dest(builddir));
}

function tslint() {
    return gulp
        .src(sources.ts)
        .pipe(
            gulptslint({
                formatter: "verbose",
                sort: true,
            })
        )
        .pipe(
            gulptslint.report({
                summarizeFailureOutput: true,
            })
        );
}

function clean() {
    return del(builddir + "*");
}

exports.default = series(clean, js, ts, tslint);
