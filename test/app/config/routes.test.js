require('../../common')

var test     = createTest('../app/config/routes')
  , M_COMMON = test.object('common')
  , OPTIONS  =
    { requires :
      { '../common' : M_COMMON
      }
    }

M_COMMON.load           = test.function('load')
M_COMMON.loadController = test.function('loadController')

var load = M_COMMON.load
  , APP  = test.object('app')

APP.router = test.object('router')

EXPORTS = test.compile(OPTIONS).exports

;(function createsRoutes () {
  var ROUTE  = test.object('route')
    , HOME_C = test.object('home')
    , args, error_call, ERROR_CB

  test.expect(APP, 'use', 1, [APP.router])

  test.expect(load, 1, ['home'], ROUTE)
  test.expect(APP, 'get', 1, ['/', ROUTE])
  test.expect(load, 1, ['home'], ROUTE)
  test.expect(APP, 'get', 1, ['/home', ROUTE])
  test.expect(load, 1, ['home', 'notFound'], ROUTE)
  test.expect(APP, 'get', 1, ['*', ROUTE])

  test.expect(M_COMMON.loadController, 1, ['home'], HOME_C)

  error_call = test.expect(APP, 'error', 1)

  EXPORTS(APP)

  args = error_call.calls[0].args
  assert.equal(1, args.length)

  ERROR_CB = args[0]

  ;(function error () {
    var ERROR    = test.object('error')
      , REQUEST  = test.object('request')
      , RESPONSE = test.object('response')
      , NEXT     = test.object('next')

    test.expect(HOME_C, 'setupRequest', 1, [REQUEST, RESPONSE, NEXT], REQUEST)
    test.expect(REQUEST, 'error', 1, [ERROR])

    ERROR_CB(ERROR, REQUEST, RESPONSE, NEXT)
  })()
})()
