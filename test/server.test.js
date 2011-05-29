require('./common')

var test = microtest.module('server.js')

test.requires('cluster', { class: 'cluster' })
test.required.cluster.logger   = test.function('logger')
test.required.cluster.pidfiles = test.function('pidfiles')
test.required.cluster.cli      = test.function('cli')
test.required.cluster.repl     = test.function('repl')

test.describe('creates a cluster', function () {
  var CLUSTER = test.object('cluster')
    , PLUGIN  = test.object('plugin')

  test.expect(test.required.cluster, 1, ['./app'], CLUSTER)

  test.expect(test.required.cluster.logger, 1, ['logs'], PLUGIN)
  test.expect(CLUSTER, 'use', 1, [PLUGIN], CLUSTER)

  test.expect(test.required.cluster.pidfiles, 1, ['pids'], PLUGIN)
  test.expect(CLUSTER, 'use', 1, [PLUGIN], CLUSTER)

  test.expect(test.required.cluster.cli, 1, [], PLUGIN)
  test.expect(CLUSTER, 'use', 1, [PLUGIN], CLUSTER)

  test.expect(test.required.cluster.repl, 1, [9000], PLUGIN)
  test.expect(CLUSTER, 'use', 1, [PLUGIN], CLUSTER)

  test.expect(CLUSTER, 'listen', 1, [8080])

  test.compile()
})
