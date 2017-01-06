'use strict'

const _ = require('lodash')
const Err = require('../error')
let Mockjs = require('mockjs')
let yaml = require('js-yaml')
const Model = require('../models');

let mock = module.exports = {}
mock.getByName = function * () {
  var content = `pageSize: int
list|1:
  - name: int|描述
    url: string|描述
    pets:
    - $ref: $Pet
    age: int`
  try {
    var doc = yaml.safeLoad(content, 'utf8');
  } catch (e) {
    console.log(e);
    throw new Err(e.name, e)
  }
  var user = yield Model.User.findById(1);
  this.body = Mockjs.mock(doc)
}
