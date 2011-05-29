require('../common')

var test = microtest.module('app/routes.js')

test.requires('./common', { name: 'common' })

var load = test.required.common.load = test.function('load')
  , APP  = test.object('app')

EXPORTS = test.compile()

test.describe('test routes', function () {
  var ROUTE = test.object('route')

  test.expect(load, 1, ['home'], ROUTE)
  test.expect(APP, 'get', 1, ['/', ROUTE])
  test.expect(load, 1, ['home'], ROUTE)
  test.expect(APP, 'get', 1, ['/home', ROUTE])

  EXPORTS(APP)
})
