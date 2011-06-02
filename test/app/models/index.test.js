require('../../common')

var test = microtest.module('app/models/index.js')
  , DIRNAME, FILES

DIRNAME = test.context.__dirname = 'app/models'
test.requires('fs')
test.requires('path')

FILES = ['index.js', 'test.js', 'test']

test.describe('loads files', function () {
  var JOIN    = test.object('join')
    , RESOLVE = test.object('resolve')
    , STAT    = test.object('stat')

  test.expect(test.required.fs, 'readdirSync', 1, [DIRNAME], FILES)

  test.expect(test.required.path, 'join', 1, [DIRNAME, FILES[0]], JOIN)
  test.expect(test.required.path, 'resolve', 1, [JOIN], RESOLVE)
  test.expect(test.required.fs, 'statSync', 1, [RESOLVE], STAT)
  test.expect(STAT, 'isDirectory', 1, [], false)
  test.expect(test.required.path, 'extname', 1, [FILES[0]], '.js')

  test.expect(test.required.path, 'join', 1, [DIRNAME, FILES[1]], JOIN)
  test.expect(test.required.path, 'resolve', 1, [JOIN], RESOLVE)
  test.expect(test.required.fs, 'statSync', 1, [RESOLVE], STAT)
  test.expect(STAT, 'isDirectory', 1, [], false)
  test.expect(test.required.path, 'extname', 1, [FILES[1]], '.js')

  test.expect(test.required.path, 'join', 1, [DIRNAME, FILES[2]], JOIN)
  test.expect(test.required.path, 'resolve', 1, [JOIN], RESOLVE)
  test.expect(test.required.fs, 'statSync', 1, [RESOLVE], STAT)
  test.expect(STAT, 'isDirectory', 1, [], true)
  test.expect(test.required.fs, 'readdirSync', 1, [RESOLVE], [])

  test.expect(RESOLVE, 'slice', 1, [0, -3], 'ONE')
  test.requires('ONE')

  test.compile()
})
