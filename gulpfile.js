/**
 * Created by yangbing5 on 2017/3/27.
 */
var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    uglify = require('gulp-uglify'),
    cleanCss = require('gulp-clean-css'),
    imageMin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    devServer = require('gulp-devserver2'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    clean = require('gulp-clean'),
    livereload = require('gulp-livereload'),
    includeJs = require('gulp-include'),
    includeHtml = require('gulp-html-tag-include');

var mockData = require('./mock/mockData');

//开发
gulp.task('dev', ['server', 'watch']);

gulp.task('server', function () {
    return gulp.src('.')
        .pipe(devServer({
            livereload: {
                enable: true,
                filter: function (filename) {
                    return !/\.git|node_modules|\.idea|\.xml|\.sass-cache/.test(filename);
                }
            },
            open: true,//自动打开浏览器
            proxy: {
                enable: true,
                host: '',
                urls: '',
                mock: mockData
            }
        }))
});


gulp.task('watch', function () {
    gulp.watch(['src/asset/js/*.js', 'src/asset/js/component/*.js'], function (ev) {
        if (ev.type === 'changed') {
            return gulp.src('src/asset/js/*.js')
                .pipe(includeJs()) //js拼接
                .pipe(gulp.dest('./release/asset/js'))
        }
    });
    gulp.watch(['src/*.html','src/**/*.html','src/inc/*.html','src/inc/**/*.html'], function (ev){
        if(ev.type === "changed"){
            return  gulp.src('src/*.html')
                .pipe(includeHtml()) // html拼接
                .pipe(gulp.dest('./release/'))
        }
    });
    gulp.watch(['src/asset/styl/*.styl','src/asset/styl/**/*.styl'],function (ev) {
        if (ev.type === "changed") {
            return gulp.src('src/asset/styl/*.styl')
                .pipe(stylus())
                .pipe(cleanCss())
                .pipe(gulp.dest('./release/asset/css'))
        }
    });
    gulp.watch(['src/asset/img/*'], function (ev){
        if('added' == ev.type || 'changed' == ev.type || 'renamed' == ev.type || 'deleted' == ev.type){
            return  gulp.src(['src/asset/img/*'])
                .pipe(gulp.dest('./release/asset/img'))
        }
    });
});

gulp.task('init',['initJs','initFonts']);

gulp.task('initJs', function () {
    return gulp.src('src/asset/js/lib/*.js')
        .pipe(gulp.dest('./release/asset/js/lib'))
});
gulp.task('initFonts', function () {
    return gulp.src('src/asset/fonts/*.*')
        .pipe(gulp.dest('./release/asset/fonts'));
});


//打包
gulp.task('publish',['clean'],function () {
    gulp.start('replacePath');
});

gulp.task('clean',function () {
    return gulp.src('./dist',{read:false})
        .pipe(clean());
});


gulp.task('replacePath',['fonts','imgmin','css','js','lib'],function () {
    gulp.start('html')
});

gulp.task('fonts', function () {
    return gulp.src('release/asset/fonts/*')
        .pipe(gulp.dest('dist/asset/fonts'))
});
gulp.task('imgmin', function() {
    return gulp.src(['release/asset/img/*.{png,jpg,gif,ico}', 'release/asset/img/**/*.{png,jpg,gif,ico}'])
        .pipe(imagemin())
        .pipe(gulp.dest('dist/asset/img'))
});
gulp.task('css', function () {
    return gulp.src(['rev/**/*.json', './release/asset/css/*'])
        .pipe(revCollector())
        .pipe(rev())
        .pipe(cleanCss())
        .pipe(gulp.dest('dist/asset/css'))
        .pipe( rev.manifest() )
        .pipe( gulp.dest( 'rev/css' ) );
});
gulp.task('js', function () {
    return gulp.src(['./release/asset/js/*.js'])
        .pipe(rev())
        .pipe(uglify())
        .pipe(gulp.dest('dist/asset/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
});
gulp.task('lib', function () {
    return gulp.src(['./release/asset/js/lib/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('dist/asset/js/lib'));
});
gulp.task('html', function () {
    return gulp.src(['rev/**/*.json', './release/*.html'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest('dist'));
});