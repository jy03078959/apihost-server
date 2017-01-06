'use strict'
const path = require('path')
const config = require('config')
const Router = require('toa-router')
const Mock = require('../api/mock')

const Err = require('../error')

let router = module.exports = new Router(config.rootAPI)

// root
router.get('/', function * () {
  this.body = {
    name: 'mock Server',
    version: require('../../package.json').version
  }
})
// mock
router.get('/mock/:name', Mock.getByName)

router.otherwise(function * () {
  throw new Err('not found')
})
