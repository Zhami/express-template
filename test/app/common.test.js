require('../common')

var test = microtest.module('app/common.js')

test.context.__dirname = 'DIRNAME'
test.requires('express-aid', { name : 'express_aid' })
test.requires('./db', { name : 'db' })

var AID = test.object('aid')

AID.PageRequest = test.function('PageRequest')

test.describe('bootstrap', function () {
  var create_aid_call
    , args

  create_aid_call = test.expect
    ( test.required.express_aid
    , 'createAid'
    , 1
    , null
    , AID
    )

  test.compile()

  args = create_aid_call.calls[0].args
  assert.equal(1, args.length)
  assert.deepEqual
    ( { controllers : 'app/controllers'
      , models      : 'app/models'
      , mongoose    : test.required.db
      }
    , args[0]
    )
})
