import gulp from 'gulp';
import del from 'del';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify-es';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import babel from 'gulp-babel';
import imagemin from 'gulp-imagemin';
import cleanCSS from 'gulp-clean-css';

const paths = {
  static: {
    src: './src/pages/**/*.html',
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
  bootstrap: {
    scss: {
      src: './node_modules/bootstrap/dist/css/bootstrap.min.css',
      dest: './dist/css/',
    },
    js: {
      src: './node_modules/bootstrap/dist/js/bootstrap.min.js',
      dest: './dist/js/',
    },
  },
};

gulp.task('clean', () => del('./dist'));

gulp.task('static', (done) => {
  gulp.src(paths.static.src).pipe(gulp.dest(paths.static.dest));
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

gulp.task('bootstrap', (done) => {
  gulp.src(paths.bootstrap.scss.src).pipe(gulp.dest(paths.bootstrap.scss.dest));
  gulp.src(paths.bootstrap.js.src).pipe(gulp.dest(paths.bootstrap.js.dest));
  done();
});

gulp.task('watch', () => {
  gulp.watch(paths.static.src).on('change', gulp.series('dev'));
  gulp.watch(paths.styles.src).on('change', gulp.series('dev'));
  gulp.watch(paths.scripts.src).on('change', gulp.series('dev'));
});

gulp.task('dev', gulp.series('clean', ['static', 'sass', 'js', 'img', 'bootstrap']));
gulp.task('build', gulp.series('clean', ['static', 'sass:build', 'js:build', 'img:build', 'bootstrap']));

gulp.task('default', gulp.series('dev', ['watch']));
