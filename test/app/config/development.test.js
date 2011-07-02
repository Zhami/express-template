require('../../common')

var test = createTest('../app/config/development')
  , REQUIRE = test.function('require')
  , OPTIONS =
    { locals      :
      { require   : REQUIRE
      }
    }

var M_EXPRESS = test.object('express')
  , M_CREDIS  = test.function('credis')
  , M_DB      = test.object('db')

test.expect(REQUIRE, 1, ['express'], M_EXPRESS)
test.expect(REQUIRE, 1, ['../db'], M_DB)
test.expect(REQUIRE, 1, ['connect-redis'])
  .andReturn(M_CREDIS)

var APP         = test.object('app')
  , REDIS_STORE = test.function('RedisStore')
  , EXPORTS

;(function bootstrap () {
  test.expect(M_CREDIS, 1, [M_EXPRESS])
    .andReturn(REDIS_STORE)
  EXPORTS = test.compile(OPTIONS).exports
})()


;(function devConfigure () {
  var PLUGIN        = test.object('plugin')
    , REDIS_STORE_I = test.object('redis_store')
    , session_call, args

  test.expect('new', REDIS_STORE, 1, [], REDIS_STORE_I)

  test.expect(M_EXPRESS, 'cookieParser', 1, [], PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  session_call = test.expect(M_EXPRESS, 'session', 1, null, PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  test.expect(M_DB, 'open', 1, ['mongodb://localhost/test'])

  EXPORTS(APP)

  args = session_call.calls[0].args
  assert.equal(1, args.length)
  assert.deepEqual
    ( { secret : 'test'
      , store  : REDIS_STORE_I
      }
    , args[0]
    )
})()
