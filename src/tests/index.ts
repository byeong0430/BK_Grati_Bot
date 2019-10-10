import 'mocha'
import assert from 'assert'
const handler = require('../index').handler
const payload = require('../json/payload.json')

describe('Telegram tests', async () => {
  it('test', async () => {
    // const handlerResponse = await handler(payload)
    // assert.equal(handlerResponse.statusCode, 200)
    // assert.notEqual(handlerResponse.payload.length, 0)
  })
})
