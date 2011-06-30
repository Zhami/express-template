require('../common')

var test = microtest.module('app/db.js')

test.requires('mongoose')
test.requires('express-mongoose')

var CONNECTION = test.object('connection')

test.describe('bootstrap', function () {
  test.expect(test.required.mongoose, 'createConnection', 1, [], CONNECTION)

  assert.equal(CONNECTION, test.compile())
})
