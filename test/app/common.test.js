require('../common')

var test = microtest.module('app/common.js')

test.context.__dirname = test.object('__dirname')
test.requires('express-aid', { name : 'express_aid' })
test.requires
  ( './errors'
  , [ { class : 'NotFoundError' }
    , { class : 'ApplicationError' }
    , { class : 'BadRequestError' }
    ]
  )

var AID = test.object('aid')
  , EXPORTS, PAGE_REQUEST, PAGE

AID.Base        = test.function('Base')
AID.BaseRequest = test.function('BaseRequest')

test.expect
  ( test.required.express_aid
  , 'createAid'
  , 1
  , [test.context.__dirname]
  , AID
  )
EXPORTS = test.compile()

test.describe('gets aid', function () {
  assert.equal(EXPORTS.Base, AID.Base)
  assert.equal(EXPORTS.BaseRequest, AID.BaseRequest)
})

test.describe('Page inherits Base', function () {
  assert.equal(EXPORTS.Page.prototype.__proto__, EXPORTS.Base.prototype)
})

test.describe('new Page', function () {
  var base_call
    , NAME = test.object('name')

  base_call = test.expect(EXPORTS.Base, 1, [NAME])

  PAGE = new EXPORTS.Page(NAME)

  assert.equal(PAGE, base_call.calls[0].context)
})

test.describe('Page#setupRequest', function () {
  var REQUEST    = test.object('request')
    , RESPONSE   = test.object('response')
    , NEXT       = test.object('next')
    , THIS       = test.object('this')
    , page_request_call

  page_request_call = test.expect('new', EXPORTS.BaseRequest, 1, [THIS, REQUEST, RESPONSE, NEXT])

  var RETURN = PAGE.setupRequest.call(THIS, REQUEST, RESPONSE, NEXT)

  assert.equal(RETURN, page_request_call.calls[0].context)
})

test.describe('PageRequest', function () {
  var REQUEST  = test.object('request')
    , RESPONSE = test.object('response')
    , PAGE     = test.object('page')
    , NEXT     = test.object('next')
    , base_call, args

  assert.equal(EXPORTS.PageRequest.prototype.__proto__, EXPORTS.BaseRequest.prototype)

  base_call = test.expect(EXPORTS.BaseRequest, 1, [PAGE, REQUEST, RESPONSE, NEXT])

  PAGE_REQUEST = new EXPORTS.PageRequest(PAGE, REQUEST, RESPONSE, NEXT)

  assert.equal(PAGE_REQUEST, base_call.calls[0].context)

  PAGE_REQUEST.response = RESPONSE
})

test.describe('PageRequest#_renderError', function () {
  var STRING       = test.object('string')
    , RENDER_ERROR = test.object('render_error')
    , ERROR        = test.object('error')
    , render_call, args, RENDER_CB

  ERROR.code = test.object('code')
  ERROR.name = test.object('mesage')

  test.expect(PAGE_REQUEST, 'setTitle', 1, [ERROR.name])
  render_call = test.expect(PAGE_REQUEST, 'render', 1)

  PAGE_REQUEST._renderError(ERROR)

  args = render_call.calls[0].args
  assert.equal(4, args.length)
  assert.equal('error', args[0])
  assert.deepEqual
    ( { error : ERROR }
    , args[1]
    )
  RENDER_CB = args[2]
  assert.equal(true, args[3])

  test.expect(PAGE_REQUEST.response, 'send', 1, [STRING, ERROR.code])

  RENDER_CB(null, STRING)

  test.describe('error', function () {
    test.expect(PAGE_REQUEST.response, 'send', 1, ['Error occured during page render.', 500])
    RENDER_CB(RENDER_ERROR)
  })
})

test.describe('PageRequest#error', function () {
  var ERROR  = test.object('error')

  test.expect('new', test.required.ApplicationError, 1, [ERROR.message], ERROR)
  test.expect(PAGE_REQUEST, '_renderError', 1, [ERROR])

  PAGE_REQUEST.error(ERROR)

  test.describe('PageRequest#error known', function () {
    test.expect('new', test.required.ApplicationError, 1, ['MESSAGE'])

    var ERROR = new test.required.ApplicationError('MESSAGE')

    test.expect(PAGE_REQUEST, '_renderError', 1, [ERROR])

    PAGE_REQUEST.error(ERROR)
  })
})

test.describe('PageRequest#setTitle', function () {
  var TITLE = 'TITLE'

  PAGE_REQUEST.setTitle(TITLE)

  assert.equal(PAGE_REQUEST.data.title, 'TITLE - Welcome')
  assert.equal(PAGE_REQUEST.data.title_name, 'TITLE')
})
