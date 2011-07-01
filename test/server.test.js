require('./common')

var test      = createTest('../server')
  , path      = require('path')
  , M_CLUSTER = test.function('cluster')
  , M_FS      = test.object('fs')
  , DIRNAME   = test.object('dirname')
  , OPTIONS   =
    { requires    :
      { cluster   : M_CLUSTER
      , fs        : M_FS
      }
    , locals      :
      { __dirname : DIRNAME
      }
    }

M_CLUSTER.logger   = test.function('logger')
M_CLUSTER.pidfiles = test.function('pidfiles')
M_CLUSTER.cli      = test.function('cli')
M_CLUSTER.repl     = test.function('repl')

;(function createsCluster () {
  var CLUSTER = test.object('cluster')
    , PLUGIN  = test.object('plugin')
    , MASTER  = test.object('master')
    , master_closing_call, args
    , CLOSING_CB

  test.expect(M_CLUSTER, 1, ['./app'], CLUSTER)

  test.expect(M_CLUSTER.logger, 1, ['logs'], PLUGIN)
  test.expect(CLUSTER, 'use', 1, [PLUGIN], CLUSTER)

  test.expect(M_CLUSTER.pidfiles, 1, ['pids'], PLUGIN)
  test.expect(CLUSTER, 'use', 1, [PLUGIN], CLUSTER)

  test.expect(M_CLUSTER.cli, 1, [], PLUGIN)
  test.expect(CLUSTER, 'use', 1, [PLUGIN], CLUSTER)

  test.expect(M_CLUSTER.repl, 1, [9000], PLUGIN)
  test.expect(CLUSTER, 'use', 1, [PLUGIN], CLUSTER)

  test.expect(CLUSTER, 'listen', 1, [8080], MASTER)

  master_closing_call = test.expect(MASTER, 'on', 1)

  test.compile(OPTIONS)

  args = master_closing_call.calls[0].args
  assert.equal(2, args.length)
  assert.equal('closing', args[0])

  CLOSING_CB = args[1]

  ;(function cleansUpRepl () {
    var ONE = test.object('one')
      , TWO = test.object('two')
      , CHILD, PATH

    ONE.proc     = test.object('proc')
    ONE.proc.pid = 'ONE'
    TWO.proc     = test.object('proc')
    TWO.proc.pid = 'TWO'

    MASTER.children = [ONE, TWO]

    for (var i = 0, il = MASTER.children.length; i < il; i++) {
      CHILD = MASTER.children[i]
      PATH  = path.resolve
        ( path.join(__dirname, '..', 'repl') + '/' + CHILD.proc.pid + '.sock'
        )
      test.expect(M_FS, 'unlink', 1, [PATH])
    }

    CLOSING_CB()
  })()
})()
