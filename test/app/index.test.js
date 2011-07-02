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
  , M_NET     = test.object('net')
  , M_REPL    = test.object('repl')
  , M_COMMON  = test.object('common')
  , M_DB      = test.object('./db')
  , M_UTIL    = test.object('util')

test.expect(REQUIRE, 1, ['express'], M_EXPRESS)
test.expect(REQUIRE, 1, ['path'], M_PATH)
test.expect(REQUIRE, 1, ['net'], M_NET)
test.expect(REQUIRE, 1, ['repl'], M_REPL)
test.expect(REQUIRE, 1, ['./common'], M_COMMON)
test.expect(REQUIRE, 1, ['./db'], M_DB)
test.expect(REQUIRE, 1, ['util'], M_UTIL)

var APP         = test.object('app')
  , REPL_PATH   = 'REPL_PATH'
  , ALL_CB, DEV_CB, PROD_CB

APP.router = test.object('router')

;(function bootstrap () {
  var PATH_JOIN   = test.object('path_join')
    , REPL_SERVER = test.object('repl_server')
    , configure_call, create_server_call
    , REPL_CB

  test.expect(M_EXPRESS, 'createServer', 1, [], APP)

  test.expect(M_PATH, 'join', 1, [DIRNAME, 'views'], PATH_JOIN)
  test.expect(M_PATH, 'resolve', 1, [PATH_JOIN])

  test.expect(M_PATH, 'join', 1, [DIRNAME, 'public'], PATH_JOIN)
  test.expect(M_PATH, 'resolve', 1, [PATH_JOIN])

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
  var M_COMMON = test.function('common')
    , M_ROUTES = test.function('routes')

  test.expect(REQUIRE, 1, ['./config/common'])
    .andReturn(M_COMMON)
  test.expect(M_COMMON, 1, [APP])

  test.expect(REQUIRE, 1, ['./config/routes'])
    .andReturn(M_ROUTES)
  test.expect(M_ROUTES, 1, [APP])

  ALL_CB()
})()

;(function devConfigure () {
  var M_DEV = test.function('prod')

  test.expect(REQUIRE, 1, ['./config/development'])
    .andReturn(M_DEV)
  test.expect(M_DEV, 1, [APP])

  DEV_CB()
})()

;(function prodConfigure () {
  var M_PROD = test.function('prod')

  test.expect(REQUIRE, 1, ['./config/production'])
    .andReturn(M_PROD)
  test.expect(M_PROD, 1, [APP])

  PROD_CB()
})()
