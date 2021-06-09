import gulp from 'gulp';
import del from 'del';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify-es';
import autoprefixer from 'gulp-autoprefixer';
import pug from 'gulp-pug';
import rename from 'gulp-rename';
import babel from 'gulp-babel';
import imagemin from 'gulp-imagemin';
import cleanCSS from 'gulp-clean-css';

const paths = {
  pug: {
    src: './src/pages/*.pug',
    watchSrc: './src/pages/**/*.pug',
    dest: './dist/pages/',
  },
  styles: {
    src: './src/scss/**/*.scss',
    dest: './dist/css/',
  },
  scripts: {
    src: './src/js/**/*.js',
    dest: './dist/js/',
  },
  images: {
    src: './src/img/**/*.*',
    dest: './dist/img/',
  },
};

gulp.task('clean', () => del('./dist'));

gulp.task('pug', (done) => {
  gulp.src(paths.pug.src).pipe(pug({})).pipe(gulp.dest(paths.pug.dest));
  done();
});

gulp.task('sass', (done) => {
  gulp
    .src(paths.styles.src)
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.styles.dest));
  done();
});

gulp.task('sass:build', (done) => {
  gulp
    .src(paths.styles.src)
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.styles.dest));
  done();
});

gulp.task('js', (done) => {
  gulp
    .src(paths.scripts.src)
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scripts.dest));
  done();
});

gulp.task('js:build', (done) => {
  gulp
    .src(paths.scripts.src)
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      }),
    )
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scripts.dest));
  done();
});

gulp.task('img', (done) => {
  gulp.src(paths.images.src).pipe(gulp.dest(paths.images.dest));
  done();
});

gulp.task('img:build', (done) => {
  gulp.src(paths.images.src).pipe(imagemin()).pipe(gulp.dest(paths.images.dest));
  done();
});

gulp.task('watch', () => {
  gulp.watch(paths.pug.watchSrc).on('change', gulp.series('dev'));
  gulp.watch(paths.styles.src).on('change', gulp.series('dev'));
  gulp.watch(paths.scripts.src).on('change', gulp.series('dev'));
});

gulp.task('dev', gulp.series('clean', ['pug', 'sass', 'js', 'img']));
gulp.task('build', gulp.series('clean', ['pug', 'sass:build', 'js:build', 'img:build']));

gulp.task('default', gulp.series('dev', ['watch']));
