require('./common')

var test = microtest.module('server.js')

test.requires('cluster', { class: 'cluster' })
test.requires('fs')
test.requires('path')

DIRNAME = test.context.__dirname = test.object('__dirname')

test.required.cluster.logger   = test.function('logger')
test.required.cluster.pidfiles = test.function('pidfiles')
test.required.cluster.cli      = test.function('cli')
test.required.cluster.repl     = test.function('repl')

test.describe('creates a cluster', function () {
  var CLUSTER = test.object('cluster')
    , PLUGIN  = test.object('plugin')
    , MASTER  = test.object('master')
    , master_closing_call, args
    , CLOSING_CB

  test.expect(test.required.cluster, 1, ['./app'], CLUSTER)

  test.expect(test.required.cluster.logger, 1, ['logs'], PLUGIN)
  test.expect(CLUSTER, 'use', 1, [PLUGIN], CLUSTER)

  test.expect(test.required.cluster.pidfiles, 1, ['pids'], PLUGIN)
  test.expect(CLUSTER, 'use', 1, [PLUGIN], CLUSTER)

  test.expect(test.required.cluster.cli, 1, [], PLUGIN)
  test.expect(CLUSTER, 'use', 1, [PLUGIN], CLUSTER)

  test.expect(test.required.cluster.repl, 1, [9000], PLUGIN)
  test.expect(CLUSTER, 'use', 1, [PLUGIN], CLUSTER)

  test.expect(CLUSTER, 'listen', 1, [8080], MASTER)

  master_closing_call = test.expect(MASTER, 'on', 1)

  test.compile()

  args = master_closing_call.calls[0].args
  assert.equal(2, args.length)
  assert.equal('closing', args[0])

  CLOSING_CB = args[1]

  test.describe('clean up repl', function () {
    var ONE = test.object('one')
      , TWO = test.object('two')
      , CHILD

    ONE.proc     = test.object('proc')
    ONE.proc.pid = 'ONE'
    TWO.proc     = test.object('proc')
    TWO.proc.pid = 'TWO'

    MASTER.children = [ONE, TWO]

    for (var i = 0, il = MASTER.children.length; i < il; i++) {
      CHILD = MASTER.children[i]

      test.expect(test.required.path, 'join', 1, [DIRNAME, 'repl'], 'JOIN')
      test.expect(test.required.path, 'resolve', 1, ['JOIN/' + CHILD.proc.pid + '.sock'], 'RESOLVE')
      test.expect(test.required.fs, 'unlink', 1, ['RESOLVE'])
    }

    CLOSING_CB()
  })
})
