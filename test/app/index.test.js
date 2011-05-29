require('../common')

var test = microtest.module('app/index.js')

test.context.__dirname = test.object('dirname')

test.requires('express')
test.requires('mongoose')
test.requires('path')
test.requires('connect-redis', { class: 'RedisStore' })
test.requires('./common', [{ class: 'setup' }, { name: 'common' }, { class: 'Base' }, { class: 'BaseRequest' }])

var APP         = test.object('app')
  , VIEWS_PATH  = test.object('views_path')
  , PUBLIC_PATH = test.object('public_path')
  , ALL_CB, DEV_CB, PROD_CB

APP.router = test.object('router')

test.describe('bootstrap', function () {
  var PATH_JOIN = test.object('path_join')
    , configure_call

  test.expect(test.required.express, 'createServer', 1, [], APP)

  test.expect(test.required.path, 'join', 1, [test.context.__dirname, '..', 'views'], PATH_JOIN)
  test.expect(test.required.path, 'resolve', 1, [PATH_JOIN], VIEWS_PATH)

  test.expect(test.required.path, 'join', 1, [test.context.__dirname, '..', 'public'], PATH_JOIN)
  test.expect(test.required.path, 'resolve', 1, [PATH_JOIN], PUBLIC_PATH)

  configure_call = test.expect(APP, 'configure', 3)

  test.expect(test.required.setup, 1, [test.context.__dirname])

  test.requires('./routes', { class: 'routes' })
  test.expect(test.required.routes, 1, [APP])

  assert.equal(APP, test.compile())

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
})

test.describe('setTitle', function () {
  var TITLE = 'TITLE'
    , THIS  = test.object('this')

  THIS.data =
    { title: 'test'
    }

  test.required.BaseRequest.prototype.setTitle.call(THIS, TITLE)

  assert.equal(THIS.data.title, TITLE + ' - test')
})

test.describe('all configure', function () {
  var PLUGIN = test.object('plugin')
    , args

  test.expect(APP, 'set', 1, ['views', VIEWS_PATH])
  test.expect(APP, 'set', 1, ['view engine', 'jade'])

  test.expect(test.required.express, 'logger', 1, [], PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])
  test.expect(test.required.express, 'bodyParser', 1, [], PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])
  test.expect(test.required.express, 'methodOverride', 1, [], PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  test.requires('stylus')
  stylus_call = test.expect(test.required.stylus, 'middleware', 1, null, PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  test.expect(APP, 'use', 1, [APP.router])
  test.expect(test.required.express, 'static', 1, [PUBLIC_PATH], PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  ALL_CB()

  args = stylus_call.calls[0].args
  assert.equal(1, args.length)
  assert.deepEqual
    ( { src: PUBLIC_PATH
      }
    , args[0]
    )
})

test.describe('dev configure', function () {
  var PLUGIN      = test.object('plugin')
    , REDIS_STORE = test.object('redis_store')
    , session_call, error_handler_call, args

  test.expect('new', test.required.RedisStore, 1, [], REDIS_STORE)

  test.expect(test.required.express, 'cookieParser', 1, [], PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  session_call = test.expect(test.required.express, 'session', 1, null, PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  error_handler_call = test.expect(test.required.express, 'errorHandler', 1, null, PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  test.expect(test.required.mongoose, 'connect', 1, ['mongodb://localhost/test'])

  DEV_CB()

  args = session_call.calls[0].args
  assert.equal(1, args.length)
  assert.deepEqual
    ( { secret : 'test'
      , store  : REDIS_STORE
      }
    , args[0]
    )

  args = error_handler_call.calls[0].args
  assert.equal(1, args.length)
  assert.deepEqual
    ( { dumpExceptions : true
      , showStack      : true
      }
    , args[0]
    )
})

test.describe('prod configure', function () {
  var PLUGIN      = test.object('plugin')
    , REDIS_STORE = test.object('redis_store')
    , session_call, error_handler_call, args

  test.expect('new', test.required.RedisStore, 1, [], REDIS_STORE)

  test.expect(test.required.express, 'cookieParser', 1, [], PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  session_call = test.expect(test.required.express, 'session', 1, null, PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  test.expect(test.required.express, 'errorHandler', 1, [], PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  test.expect(test.required.mongoose, 'connect', 1, ['mongodb://localhost/test'])

  PROD_CB()

  args = session_call.calls[0].args
  assert.equal(1, args.length)
  assert.deepEqual
    ( { secret : 'test'
      , store  : REDIS_STORE
      }
    , args[0]
    )
})
