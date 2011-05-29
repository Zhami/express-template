var cluster = require('cluster')

cluster('./app')
  .use(cluster.logger('logs'))
  .use(cluster.pidfiles('pids'))
  .use(cluster.cli())
  .use(cluster.repl(9000))
  .listen(8080)
