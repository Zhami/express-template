var fs   = require('fs')
  , path = require('path')

var readdir = function (dir, child) {
  var files = fs.readdirSync(dir)
    , ret   = []
    , file, stat, file_r

  for (var i = 0, il = files.length; i < il; i++) {
    file   = files[i]
    file_r = path.resolve(path.join(dir, file))
    stat   = fs.statSync(file_r)

    if (stat.isDirectory()) {
      ret.push.apply(ret, readdir(file_r, true))
    } else {

      if ('.js' !== path.extname(file) || (!child && 'index.js' === file)) {
        continue
      }

      ret.push(file_r)
    }
  }

  return ret
}

var models = readdir(__dirname)

for (var i = 0, il = models.length; i < il; i++) {
  require(models[i].slice(0, -3))
}
