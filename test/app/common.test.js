require('../common')

var test = microtest.module('app/common.js')

test.context.__dirname = test.object('__dirname')
test.requires('express-aid', { name : 'express_aid' })
test.requires('./', { name : 'app' })

test.describe('bootstrap', function () {
  var AID = test.object('aid')

  test.expect
    ( test.required.express_aid
    , 'createAid'
    , 1
    , [ test.required.app
      , test.context.__dirname
      ]
    , AID
    )

  assert.equal(test.compile(), AID)
})
