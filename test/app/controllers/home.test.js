require('../../common')

var test     = createTest('../app/controllers/home')
  , M_COMMON = test.object('common')
  , OPTIONS  =
    { requires :
      { '../common' : M_COMMON
      }
    }

M_COMMON.Page          = test.function('Page')
M_COMMON.NotFoundError = test.function('NotFoundError')

var EXPORTS, HOME

EXPORTS = test.compile(OPTIONS).exports

;(function HomeInheritsPage () {
  assert.equal(EXPORTS.prototype.__proto__, M_COMMON.Page.prototype)
})()

;(function newHome () {
  var page_call

  page_call = test.expect(M_COMMON.Page, 1, 'home')

  HOME = new EXPORTS()

  assert.equal(HOME, page_call.calls[0].context)
})()

;(function HomeIndex () {
  var REQUEST = test.object('request')

  test.expect(REQUEST, 'setTitle', 1, ['It is working!'])
  test.expect(REQUEST, 'render', 1, ['index'])

  HOME.index(REQUEST)
})()

;(function HomeNotFound () {
  var REQUEST = test.object('request')
    , ERROR   = test.object('error')

  REQUEST.request     = test.object('request')
  REQUEST.request.url = test.object('url')

  test.expect('new', M_COMMON.NotFoundError, 1, [REQUEST.request.url], ERROR)
  test.expect(REQUEST, 'error', 1, [ERROR])

  HOME.notFound(REQUEST)
})()
