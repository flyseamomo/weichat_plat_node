  const query = require('../../utils/query').query
  const Authorizer_access_token = require('../../common/authorizer_access_token')
  const wechat_user = require('../wechat/wechat_user')
  const subscribe = require('./subscribe')
  const sendMsg = require('../wechat/sendMsg')
  const request = require('superagent')

  module.exports = async(xml) => {
      let originalid = xml.ToUserName[0]
      let openid = xml.FromUserName[0]
      let msg_str = xml.Content[0]
      //根据originalid查询appid
      let opt = await query('SELECT appid FROM wechat_config WHERE originalid = ?', originalid)
      console.log('msg_event_appid',opt)
      let appid = opt.obj[0].appid
      //发送关键词
      let result = await query('SELECT * FROM msg WHERE appid = ? AND msg_str = ?', [appid, msg_str])
      console.log('meg_event_str',result)
      if (result.obj.length > 0) {
          sendMsg(appid, xml.FromUserName[0], 'text', result.obj[0].reply, null)
          if (result.obj[0].postUrl) {
              let post = await request('POST', result.obj[0].postUrl).send(xml)
              console.log('post', post.text)
          }
      }
  }
