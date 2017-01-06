'use strict'

const _ = require('lodash')
const db = require('../model')
const Err = require('../error')

let userAPI = module.exports = {}

userAPI.getInfo = function *() {
  let token = this.token
  let user = yield db.user.load({id: token.i})
  if (!user) throw new Err('not found', 'user')
  user.extra = user.extra || {}
  user.extra.bankInfo = user.extra.bankInfo || {}
  this.body = showUserResponse(user)
}

userAPI.updateInfo = function *() {
  let token = this.token
  let user = yield db.user.load({id: token.i})
  if (!user) throw new Err('not found', 'user')
  let extra = user.extra || {}
  let body = yield this.parseBody()
  extra.bankInfo = extra.bankInfo || {}
  extra.bankInfo = {
    bankName: body.bankName !== undefined ? body.bankName : extra.bankInfo.bankName || '',
    bankAddress: body.bankAddress !== undefined ? body.bankAddress : extra.bankInfo.bankAddress || '',
    bankAccount: body.bankAccount !== undefined ? body.bankAccount : extra.bankInfo.bankAccount || '',
    bankAccountName: body.bankAccountName !== undefined ? body.bankAccountName : extra.bankInfo.bankAccountName || '',
    bankNumber: body.bankNumber !== undefined ? body.bankNumber : extra.bankInfo.bankNumber || ''
  }
  let updateInfo = {
    realname: body.realname !== undefined ? body.realname : user.realname || '',
    phone: body.phone !== undefined ? body.phone : user.phone || '',
    email: body.email !== undefined ? body.email : user.email || '',
    bank: body.bank !== undefined ? body.bank : user.bank || '',
    area: body.area !== undefined ? body.area : user.area || '',
    note: body.note !== undefined ? body.note : user.note || '',
    update_time: new Date(),
    extra: extra
  }

  yield db.user.update(user.id, updateInfo)
  yield updateContact(user.id, updateInfo)
  _.assign(user, updateInfo)
  this.body = showUserResponse(user)
}

function showUserResponse (user) {
  let extra = user.extra || {}
  let bankInfo = extra.bankInfo || {}
  return {
    id: user.id,
    realname: user.realname || '',
    avatar: user.avatar || '',
    phone: user.phone || '',
    mobile: user.mobile || '',
    email: user.email || '',
    bank: user.bank || '',
    area: user.area || '',
    funpjAccount: user.mobile ? user.mobile + '@funpj.com' : '',
    note: user.note || '',
    createTime: user.create_time.toISOString(),
    updateTime: user.update_time.toISOString(),

    // extra info
    bankName: bankInfo.bankName || '',
    bankAddress: bankInfo.bankAddress || '',
    bankAccount: bankInfo.bankAccount || '',
    bankAccountName: bankInfo.bankAccountName || '',
    bankNumber: bankInfo.bankNumber || ''
  }
}

function * updateContact (user_id, content) {
  let contact = yield db.contact.load({app_user_id: user_id})
  if (contact) {
    yield db.contact.update(contact.id, content)
  } else {
    yield db.contact.insert(_.assign({}, content, {
      type: db.contact.TYPE_TYPE.PUBLIC,
      app_user_id: user_id
    }))
  }
}

function * linkToContact (mobile, user_id) {
  let contact = yield db.contact.load({mobile: mobile})
  if (contact) {
    yield db.contact.update(contact.id, {app_user_id: user_id})
  }
}
