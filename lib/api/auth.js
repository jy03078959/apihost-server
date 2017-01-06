'use strict'
const debug = require('debug')('auth-api')
const crypto = require('crypto')
const config = require('config')
const db = require('../models')
const Err = require('../error')
let authAPI = module.exports = {}

authAPI.loginOrRegister = function *() {
  let body = yield this.parseBody()
  let username = (body.username || '').toLowerCase().trim()
  let mobile = (body.mobile || '').replace(/\s+/g, '').replace(/^\+?86/, '')
  let password = body.password || ''
  if (username && !/^\w{6,20}$/.test(username)) throw new Err('invalid params', 'username')
  if (mobile && !/^[0-9]{11}$/.test(mobile)) throw new Err('invalid params', 'mobile')
  let cond = {}
  if (username) cond.username = username
  if (mobile) cond.mobile = mobile
  if (Object.keys(cond) === 0) throw new Err('invalid params', ['username', 'mobile'])
  let user = yield db.user.load(cond)
  if (!user) {
    user = {
      username: cond.username || md5(random(16)),
      mobile: cond.mobile || '',
      password: md5(config.password_salt, password),
      create_time: new Date(),
      activate: 1
    }
    yield db.user.insert(user)
  }

  if (user.password !== md5(config.password_salt, password)) throw new Err('no auth')

  return createAndReturnToken.call(this, user)
}


function md5 (data) {
  return crypto.createHash('md5').update(data).digest('hex')
}

function random (length) {
  length = length || 16
  return crypto.randomBytes(length).toString('hex')
}

function createAndReturnToken (user) {
  let access_token = this.signToken({
    t: Date.now(),
    i: user.id,
    a: user.activate
  })
  this.cookies.set('PJ_SESSION', access_token)
  this.body = {
    access_token: 'Bearer ' + access_token
  }
  return access_token
}
