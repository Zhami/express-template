require('../../common')

var test = microtest.module('app/controllers/home.js')

test.requires('../common', [{ class : 'Page' }, { class : 'NotFoundError' }])

var EXPORTS, HOME

EXPORTS = test.compile()

test.describe('Home inherits Page', function () {
  assert.equal(EXPORTS.prototype.__proto__, test.required.Page.prototype)
})

test.describe('new Home', function () {
  var page_call

  page_call = test.expect(test.required.Page, 1, 'home')

  HOME = new EXPORTS()

  assert.equal(HOME, page_call.calls[0].context)
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
