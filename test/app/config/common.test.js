require('../../common')

var test = createTest('../app/config/common')
  , REQUIRE = test.function('require')
  , OPTIONS =
    { locals      :
      { require   : REQUIRE
      }
    }

var M_EXPRESS = test.object('express')

test.expect(REQUIRE, 1, ['express'], M_EXPRESS)

var APP         = test.object('app')
  , VIEWS_PATH  = 'VIEWS_PATH'
  , PUBLIC_PATH = 'PUBLIC_PATH'

APP.router      = test.object('router')
APP.VIEWS_PATH  = VIEWS_PATH
APP.PUBLIC_PATH = PUBLIC_PATH

;(function allConfigure () {
  var PLUGIN   = test.object('plugin')
    , M_STYLUS = test.object('stylus')
    , args

  test.expect(APP, 'set', 1, ['views', VIEWS_PATH])
  test.expect(APP, 'set', 1, ['view engine', 'jade'])

  test.expect(M_EXPRESS, 'logger', 1, [], PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])
  test.expect(M_EXPRESS, 'bodyParser', 1, [], PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])
  test.expect(M_EXPRESS, 'methodOverride', 1, [], PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  test.expect(REQUIRE, 1, ['stylus'], M_STYLUS)
  stylus_call = test.expect(M_STYLUS, 'middleware', 1, null, PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  test.expect(M_EXPRESS, 'static', 1, [PUBLIC_PATH], PLUGIN)
  test.expect(APP, 'use', 1, [PLUGIN])

  test.compile(OPTIONS).exports(APP)

  args = stylus_call.calls[0].args
  assert.equal(1, args.length)
  assert.deepEqual
    ( { src  : VIEWS_PATH
      , dest : PUBLIC_PATH
      }
    , args[0]
    )
})()
