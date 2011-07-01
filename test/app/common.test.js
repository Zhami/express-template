require('../common')

var test    = createTest('../app/common')
  , M_AID   = test.object('aid')
  , M_DB    = test.object('db')
  , OPTIONS =
    { requires        :
      { 'express-aid' : M_AID
      , './db'        : M_DB
      }
    , locals          :
      { __dirname     : 'DIRNAME'
      }
    }

var AID = test.object('aid')

AID.PageRequest = test.function('PageRequest')

;(function bootstrap () {
  var create_aid_call
    , args

  create_aid_call = test.expect
    ( M_AID
    , 'createAid'
    , 1
    , null
    , AID
    )

  test.compile(OPTIONS)

  args = create_aid_call.calls[0].args
  assert.equal(1, args.length)
  assert.deepEqual
    ( { controllers : 'DIRNAME/controllers'
      , models      : 'DIRNAME/models'
      , mongoose    : M_DB
      }
    , args[0]
    )
})()
