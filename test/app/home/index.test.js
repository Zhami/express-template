require('../../common')

var test = microtest.module('app/home/index.js')

test.requires
  ( '../common'
  , [ { class : 'Base' }
    , { class : 'BaseRequest' }
    ]
  )

test.requires
  ( '../errors'
  , [ { class : 'NotFoundError' }
    , { class : 'ApplicationError' }
    , { class : 'BadRequestError' }
    ]
  )

test.requires('./request', { class : 'HomeRequest' })

var EXPORTS, HOME

EXPORTS = test.compile()

test.describe('Home inherits Base', function () {
  assert.equal(EXPORTS.prototype.__proto__, test.required.Base.prototype)
})

test.describe('new Home', function () {
  var base_call

  base_call = test.expect(test.required.Base, 1, 'home')

  HOME = new EXPORTS()

  assert.equal(HOME, base_call.calls[0].context)
})

test.describe('Home#setupRequest', function () {
  var REQUEST    = test.object('request')
    , RESPONSE   = test.object('response')
    , NEXT       = test.object('next')
    , THIS       = test.object('this')
    , home_request_call

  home_request_call = test.expect('new', test.required.HomeRequest, 1, [THIS, REQUEST, RESPONSE, NEXT])

  var RETURN = HOME.setupRequest.call(THIS, REQUEST, RESPONSE, NEXT)

  assert.equal(RETURN, home_request_call.calls[0].context)
})

test.describe('Home#index', function () {
  var REQUEST = test.object('request')

  test.expect(REQUEST, 'setTitle', 1, ['It is working!'])
  test.expect(REQUEST, 'render', 1, ['index'])

  HOME.index(REQUEST)
})

test.describe('Home#notFound', function () {
  var REQUEST = test.object('request')
    , ERROR   = test.object('error')

  REQUEST.request     = test.object('request')
  REQUEST.request.url = test.object('url')

  test.expect('new', test.required.NotFoundError, 1, [REQUEST.request.url], ERROR)
  test.expect(REQUEST, 'error', 1, [ERROR])

  HOME.notFound(REQUEST)
})
