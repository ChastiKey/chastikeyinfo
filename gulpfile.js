import gulp from 'gulp'
import { homedir } from 'os'

const paths = {
  plugins: `${homedir()}/.config/BetterDiscord/plugins/`,
  source: `./src/ChastiKeyInfo.plugin.js`
}

const move = () => gulp.src(paths.source).pipe(gulp.dest(paths.plugins))
const watch = () => gulp.watch(paths.source, move)

export { move, watch }
