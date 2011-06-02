require('../common')

var test = microtest.module('app/errors.js')
  , EXPORTS

test.context.Error = test.function('Error')
test.context.Error.captureStackTrace = test.function('captureStackTrace')

EXPORTS = test.compile()

test.describe('NotFoundError', function () {
  var error_call, ERROR, stack_call
    , PATH = 'PATH'

  assert.equal(test.context.Error.prototype, EXPORTS.NotFoundError.prototype.__proto__)

  error_call = test.expect(test.context.Error, 1, [])
  stack_call = test.expect(test.context.Error.captureStackTrace, 1)

  ERROR = new EXPORTS.NotFoundError(PATH)

  assert.equal(ERROR, error_call.calls[0].context)

  args = stack_call.calls[0].args
  assert.equal(2, args.length)
  assert.equal(ERROR, args[0])
  assert.equal(EXPORTS.NotFoundError, args[1])

  assert.equal(ERROR.message, '"PATH" was not found.')
})

test.describe('BadRequestError', function () {
  var error_call, ERROR, stack_call
    , PATH = 'PATH'

  assert.equal(test.context.Error.prototype, EXPORTS.BadRequestError.prototype.__proto__)

  error_call = test.expect(test.context.Error, 1, [])
  stack_call = test.expect(test.context.Error.captureStackTrace, 1)

  ERROR = new EXPORTS.BadRequestError(PATH)

  assert.equal(ERROR, error_call.calls[0].context)

  args = stack_call.calls[0].args
  assert.equal(2, args.length)
  assert.equal(ERROR, args[0])
  assert.equal(EXPORTS.BadRequestError, args[1])

  assert.equal(ERROR.message, PATH)
})

test.describe('ApplicationError', function () {
  var error_call, ERROR, stack_call
    , PATH = 'PATH'

  assert.equal(test.context.Error.prototype, EXPORTS.ApplicationError.prototype.__proto__)

  error_call = test.expect(test.context.Error, 1, [])
  stack_call = test.expect(test.context.Error.captureStackTrace, 1)

  ERROR = new EXPORTS.ApplicationError(PATH)

  assert.equal(ERROR, error_call.calls[0].context)

  args = stack_call.calls[0].args
  assert.equal(2, args.length)
  assert.equal(ERROR, args[0])
  assert.equal(EXPORTS.ApplicationError, args[1])

  assert.equal(ERROR.message, PATH)
})
