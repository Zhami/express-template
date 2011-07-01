require('../common')

var test = createTest('../app')
  , REQUIRE = test.function('require')
  , DIRNAME = test.object('dirname')
  , PROCESS = { pid : 'PID' }
  , OPTIONS =
    { locals      :
      { require   : REQUIRE
      , __dirname : DIRNAME
      , process   : PROCESS
      }
    }

var M_EXPRESS = test.object('express')
  , M_PATH    = test.object('path')
  , M_CREDIS  = test.function('credis')
  , M_NET     = test.object('net')
  , M_REPL    = test.object('repl')
  , M_DB      = test.object('db')
  , M_COMMON  = test.object('common')

test.expect(REQUIRE, 1, ['express'], M_EXPRESS)
test.expect(REQUIRE, 1, ['path'], M_PATH)
test.expect(REQUIRE, 1, ['connect-redis'])
  .andReturn(M_CREDIS)
test.expect(REQUIRE, 1, ['net'], M_NET)
test.expect(REQUIRE, 1, ['repl'], M_REPL)
test.expect(REQUIRE, 1, ['./db'], M_DB)
test.expect(REQUIRE, 1, ['./common'], M_COMMON)

var APP         = test.object('app')
  , VIEWS_PATH  = 'VIEWS_PATH'
  , PUBLIC_PATH = 'PUBLIC_PATH'
  , REPL_PATH   = 'REPL_PATH'
  , REDIS_STORE = test.function('RedisStore')
  , ALL_CB, DEV_CB, PROD_CB

APP.router = test.object('router')

;(function bootstrap () {
  var PATH_JOIN   = test.object('path_join')
    , REPL_SERVER = test.object('repl_server')
    , configure_call, create_server_call
    , REPL_CB

  test.expect(M_EXPRESS, 'createServer', 1, [], APP)
  test.expect(M_CREDIS, 1, [M_EXPRESS])
    .andReturn(REDIS_STORE)

  test.expect(M_PATH, 'join', 1, [DIRNAME, 'views'], PATH_JOIN)
  test.expect(M_PATH, 'resolve', 1, [PATH_JOIN], VIEWS_PATH)

  test.expect(M_PATH, 'join', 1, [DIRNAME, 'public'], PATH_JOIN)
  test.expect(M_PATH, 'resolve', 1, [PATH_JOIN], PUBLIC_PATH)

  test.expect(M_PATH, 'join', 1, [DIRNAME, '..', 'repl'], PATH_JOIN)
  test.expect(M_PATH, 'resolve', 1, [PATH_JOIN], REPL_PATH)

  configure_call = test.expect(APP, 'configure', 3)

  create_server_call = test.expect(M_NET, 'createServer', 1, null, REPL_SERVER)
  test.expect(REPL_SERVER, 'listen', 1, [REPL_PATH + '/' + PROCESS.pid + '.sock'])

  assert.equal(APP, test.compile(OPTIONS).exports)

  args = configure_call.calls[0].args
  assert.equal(1, args.length)
  ALL_CB = args[0]

  args = configure_call.calls[1].args
  assert.equal(2, args.length)
  assert.equal('development', args[0])
  DEV_CB = args[1]

  args = configure_call.calls[2].args
  assert.equal(2, args.length)
  assert.equal('production', args[0])
  PROD_CB = args[1]

  args = create_server_call.calls[0].args
  assert.equal(1, args.length)

  REPL_CB = args[0]

  ;(function replServer () {
    var SOCKET = test.object('socket')
      , REPL   = test.object('repl')

    REPL.context = test.object('context')

    test.expect
      ( M_REPL
      , 'start'
      , 1
      , ['express-' + PROCESS.pid + '> ', SOCKET]
      , REPL
      )
    test.expect(REQUIRE, 1, ['async-array'], {})

    REPL_CB(SOCKET)
  })()
})()

;(function allConfigure () {
  var PLUGIN   = test.object('plugin')
    , M_STYLUS = test.object('stylus')
    , M_ROUTES = test.function('routes')
    , args

  test.expect(APP, 'set', 1, ['views', VIEWS_PATH])
  test.expect(APP, 'set', 1, ['view engine', 'jade'])

  test.expect(M_EXPRESS, 'logger', 1, [], PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])
  test.expect(M_EXPRESS, 'bodyParser', 1, [], PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])
  test.expect(M_EXPRESS, 'methodOverride', 1, [], PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  test.expect(REQUIRE, 1, ['stylus'], M_STYLUS)
  stylus_call = test.expect(M_STYLUS, 'middleware', 1, null, PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  test.expect(M_EXPRESS, 'static', 1, [PUBLIC_PATH], PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  test.expect(APP, 'use', 1, [APP.router])

  test.expect(REQUIRE, 1, ['./config/routes'])
    .andReturn(M_ROUTES)
  test.expect(M_ROUTES, 1, [APP])

  ALL_CB()

  args = stylus_call.calls[0].args
  assert.equal(1, args.length)
  assert.deepEqual
    ( { src  : VIEWS_PATH
      , dest : PUBLIC_PATH
      }
    , args[0]
    )
})()

;(function devConfigure () {
  var PLUGIN        = test.object('plugin')
    , REDIS_STORE_I = test.object('redis_store')
    , session_call, args

  test.expect('new', REDIS_STORE, 1, [], REDIS_STORE_I)

  test.expect(M_EXPRESS, 'cookieParser', 1, [], PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  session_call = test.expect(M_EXPRESS, 'session', 1, null, PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  test.expect(M_DB, 'open', 1, ['mongodb://localhost/test'])

  DEV_CB()

  args = session_call.calls[0].args
  assert.equal(1, args.length)
  assert.deepEqual
    ( { secret : 'test'
      , store  : REDIS_STORE_I
      }
    , args[0]
    )
})()

;(function prodConfigure () {
  var PLUGIN        = test.object('plugin')
    , REDIS_STORE_I = test.object('redis_store')
    , session_call, args

  test.expect('new', REDIS_STORE, 1, [], REDIS_STORE_I)

  test.expect(M_EXPRESS, 'cookieParser', 1, [], PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  session_call = test.expect(M_EXPRESS, 'session', 1, null, PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  test.expect(M_DB, 'open', 1, ['mongodb://localhost/test'])

  PROD_CB()

  args = session_call.calls[0].args
  assert.equal(1, args.length)
  assert.deepEqual
    ( { secret : 'test'
      , store  : REDIS_STORE_I
      }
    , args[0]
    )
})()
