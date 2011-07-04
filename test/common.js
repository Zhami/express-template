global.assert    = require('assert')

var fake    = require('fake')
  , sandbox = require('sandboxed-module')

global.createTest = function (module) {
  var test = fake.create()
  test.compile = function (options) {
    return sandbox.load(module, options)
  }
  return test
}
