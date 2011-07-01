require('../common')

var test       = createTest('../app/db')
  , REQUIRE    = test.function('require')
  , M_MONGOOSE = test.object('mongoose')
  , OPTIONS    =
    { locals    :
      { require : REQUIRE
      }
    }

test.expect(REQUIRE, 1, ['mongoose'], M_MONGOOSE)
test.expect(REQUIRE, 1, ['express-mongoose'])

var CONNECTION = test.object('connection')

;(function bootstrap () {
  test.expect(M_MONGOOSE, 'createConnection', 1, [], CONNECTION)

  assert.equal(CONNECTION, test.compile(OPTIONS).exports)
})()
