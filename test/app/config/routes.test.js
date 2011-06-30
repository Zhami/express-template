require('../../common')

var test = microtest.module('app/config/routes.js')

test.requires('../common', [{ class : 'load' }, { class : 'loadController' }])

var load = test.required.load
  , APP  = test.object('app')

EXPORTS = test.compile()

test.describe('test routes', function () {
  var ROUTE  = test.object('route')
    , HOME_C = test.object('home')
    , args, error_call, ERROR_CB

  test.expect(load, 1, ['home'], ROUTE)
  test.expect(APP, 'get', 1, ['/', ROUTE])
  test.expect(load, 1, ['home'], ROUTE)
  test.expect(APP, 'get', 1, ['/home', ROUTE])
  test.expect(load, 1, ['home', 'notFound'], ROUTE)
  test.expect(APP, 'get', 1, ['*', ROUTE])

  test.expect(test.required.loadController, 1, ['home'], HOME_C)

  error_call = test.expect(APP, 'error', 1)

  EXPORTS(APP)

  args = error_call.calls[0].args
  assert.equal(1, args.length)

  ERROR_CB = args[0]

  test.describe('general error', function () {
    var ERROR    = test.object('error')
      , REQUEST  = test.object('request')
      , RESPONSE = test.object('response')
      , NEXT     = test.object('next')

    test.expect(HOME_C, 'setupRequest', 1, [REQUEST, RESPONSE, NEXT], REQUEST)
    test.expect(REQUEST, 'error', 1, [ERROR])

    ERROR_CB(ERROR, REQUEST, RESPONSE, NEXT)
  })
})
