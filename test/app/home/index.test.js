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

var EXPORTS, HOME, HOME_REQUEST

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

  base_request_call = test.expect('new', test.required.BaseRequest, 1, [THIS, REQUEST, RESPONSE, NEXT])

  var RETURN = HOME.setupRequest.call(THIS, REQUEST, RESPONSE, NEXT)

  assert.equal(RETURN, base_request_call.calls[0].context)
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

test.describe('HomeRequest', function () {
  var REQUEST  = test.object('request')
    , RESPONSE = test.object('response')
    , NEXT     = test.object('next')
    , base_call, args

  assert.equal(EXPORTS.HomeRequest.prototype.__proto__, test.required.BaseRequest.prototype)

  base_call = test.expect(test.required.BaseRequest, 1, [HOME, REQUEST, RESPONSE, NEXT])

  HOME_REQUEST = new EXPORTS.HomeRequest(HOME, REQUEST, RESPONSE, NEXT)

  assert.equal(HOME_REQUEST, base_call.calls[0].context)

  HOME_REQUEST.response = RESPONSE
})

test.describe('HomeRequest#_renderError', function () {
  var STRING       = test.object('string')
    , RENDER_ERROR = test.object('render_error')
    , ERROR        = test.object('error')
    , render_call, args, RENDER_CB

  ERROR.code    = test.object('code')
  ERROR.message = test.object('mesage')

  test.expect(HOME_REQUEST, 'setTitle', 1, [ERROR.message])
  render_call = test.expect(HOME_REQUEST, 'render', 1)

  HOME_REQUEST._renderError(ERROR)

  args = render_call.calls[0].args
  assert.equal(4, args.length)
  assert.equal('error', args[0])
  assert.deepEqual
    ( { error : ERROR }
    , args[1]
    )
  RENDER_CB = args[2]
  assert.equal(true, args[3])

  test.expect(HOME_REQUEST.response, 'send', 1, [STRING, ERROR.code])

  RENDER_CB(null, STRING)

  test.describe('error', function () {
    test.expect(HOME_REQUEST.response, 'send', 1, ['Error occured during page render.', 500])
    RENDER_CB(RENDER_ERROR)
  })
})

test.describe('HomeRequest#error', function () {
  var ERROR  = test.object('error')

  test.expect('new', test.required.ApplicationError, 1, [ERROR.message], ERROR)
  test.expect(HOME_REQUEST, '_renderError', 1, [ERROR])

  HOME_REQUEST.error(ERROR)

  test.describe('HomeRequest#error known', function () {
    test.expect('new', test.required.ApplicationError, 1, ['MESSAGE'])

    var ERROR = new test.required.ApplicationError('MESSAGE')

    test.expect(HOME_REQUEST, '_renderError', 1, [ERROR])

    HOME_REQUEST.error(ERROR)
  })
})

test.describe('HomeRequest#setTitle', function () {
  var TITLE = 'TITLE'

  HOME_REQUEST.setTitle(TITLE)

  assert.equal(HOME_REQUEST.data.title, 'TITLE - Welcome')
  assert.equal(HOME_REQUEST.data.title_name, 'TITLE')
})
