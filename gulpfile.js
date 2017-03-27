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
