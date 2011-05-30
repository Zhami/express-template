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

  test.expect(REQUEST, 'render', 1, ['index'])

  HOME.index(REQUEST)
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
})

test.describe('HomeRequest#error', function () {
  var ERROR     = test.object('error')
    , render_call, args
  ERROR.message = test.object('message')
  ERROR.stack   = test.object('stack')

  test.expect('new', test.required.ApplicationError, 1, [ERROR.message], ERROR)
  render_call = test.expect(HOME_REQUEST, 'render', 1)

  HOME_REQUEST.error(ERROR)

  args = render_call.calls[0].args
  assert.equal(3, args.length)
  assert.equal('error', args[0])
  assert.deepEqual
    ( { error : ERROR
      }
    , args[1]
    )
  assert.equal(true, args[2])

  test.describe('HomeRequest#error known', function () {
    test.expect('new', test.required.ApplicationError, 1, ['MESSAGE'])

    var ERROR = new test.required.ApplicationError('MESSAGE')
      , render_call, args

    render_call = test.expect(HOME_REQUEST, 'render', 1)

    HOME_REQUEST.error(ERROR)

    args = render_call.calls[0].args
    assert.equal(3, args.length)
    assert.equal('error', args[0])
    assert.deepEqual
      ( { error : ERROR
        }
      , args[1]
      )
    assert.equal(true, args[2])
  })
})

test.describe('HomeRequest#setTitle', function () {
  var TITLE = 'TITLE'

  HOME_REQUEST.setTitle(TITLE)

  assert.equal(HOME_REQUEST.data.title, 'TITLE - Welcome')
  assert.equal(HOME_REQUEST.data.title_name, 'TITLE')
})
