var cluster = require('cluster')
  , fs      = require('fs')
  , path    = require('path')

var master = cluster('./app')
  .use(cluster.logger('logs'))
  .use(cluster.pidfiles('pids'))
  .use(cluster.cli())
  .use(cluster.repl(9000))
  .listen(8080)

master.on('closing', function () {
  var pid

  for (var i = 0, il = master.children.length; i < il; i++) {
    pid = master.children[i].proc.pid

    fs.unlink(path.resolve(path.join(__dirname, 'repl') + '/' + pid + '.sock'))
  }
})
