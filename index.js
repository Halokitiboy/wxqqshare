'use strict'
const wxapi = '//res.wx.qq.com/open/js/jweixin-1.4.0.js'
const qqapi = '//open.mobile.qq.com/sdk/qqapi.js?_bid=156'
let reqUrl = ''
/**
 * 默认传参
 * {
 *    title,
 *    desc,
 *    link,
 *    imgUrl
 * }
 */
const shareConfig = {
  title: '', // 分享标题
  summary: '', // 分享描述
  url: '', // 分享链接
  pic: '', // 分享图标
  debug: false, // 调试
  hideAllNonBaseMenuItem: false, // 隐藏所有基础类
  conf: {
    // appId: '', // 必填，公众号的唯一标识
  // timestamp: '', // 必填，生成签名的时间戳
  // nonceStr: '', // 必填，生成签名的随机串
  // signature: '',// 必填，签名
  }
}
function require (url, onload) {
  var doc = document
  var head = doc.head || (doc.getElementsByTagName('head')[0] || doc.documentElement)
  var node = doc.createElement('script')
  node.onload = onload
  node.onerror = function () {

  }
  node.async = true
  node.src = url[0]
  head.appendChild(node)
}
/**
 * 初始化设置
 * @param {*} opts
 */
function init (opts) {
  let ua = navigator.userAgent
  let isWX = ua.match(/MicroMessenger\/([\d\.]+)/)
  let isQQ = ua.match(/QQ\/([\d\.]+)/)
  isWX && _initWX(opts)
  isQQ && _initQQ(opts)
}
/**
 * 微信qq分享配置
 * ajaxUrl // 服务器请求地址
 * @param {*} param0
 */
function wxqqshare ({ title, desc, link, imgUrl, ajaxUrl = '', debug = false, config } = {}) {
  if (typeof title === 'undefined' || title === '') { return console.warn('title为必填项') }
  if (typeof desc === 'undefined' || desc === '') { return console.warn('desc为必填项') }
  if (typeof link === 'undefined' || link === '') { return console.warn('link为必填项') }
  if (typeof imgUrl === 'undefined' || imgUrl === '') { return console.warn('imgUrl为必填项') }
  shareConfig.title = title
  shareConfig.summary = desc
  shareConfig.url = link
  shareConfig.pic = imgUrl
  shareConfig.debug = debug
  shareConfig.conf = Object.assign({}, config)
  reqUrl = ajaxUrl
  init(shareConfig)
}
/**
 * 微信分享设置
 * @param {*} wxConfig
 */
function _initWX ({ title, summary, url, pic, debug, conf }) {
  require([wxapi], async function (wx) {
    if (!wx.config) {
      wx = window.wx
    }
    let data
    if (Object.keys(conf).length === 4) {
      data = Object.assign({}, conf)
    } else if (reqUrl && reqUrl !== '') {
      data = await fetchConfig(reqUrl)
    } else {
      console.warn('设置微信分享config或者ajaxUrl必填一项')
    }
    data.debug = debug
    data.jsApiList = [
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'updateAppMessageShareData',
      'updateTimelineShareData',
      'hideAllNonBaseMenuItem',
      'showAllNonBaseMenuItem',
      'hideMenuItems'
    ]
    // 通过config接口注入权限验证配置
    wx.config(data)
    // 通过ready接口处理成功验证
    wx.ready(() => {
      const opts = {
        title: title, // 分享标题
        desc: summary, // 分享描述
        link: url, // 分享链接
        imgUrl: pic // 分享图标
      }
      // 分享给朋友”及“分享到QQ”
      wx.updateAppMessageShareData(opts)
      // “分享到朋友圈”及“分享到QQ空间”
      wx.updateTimelineShareData(opts)
      // 兼容低版本微信
      // 分享到朋友圈
      wx.onMenuShareTimeline(opts)
      // 分享给朋友
      wx.onMenuShareAppMessage(opts)
      //  分享给qq
      wx.onMenuShareQQ(opts)
      // 分享到腾讯微博
      wx.onMenuShareWeibo(opts)
      // 显示按钮
      // 隐藏菜单项 默认全部显示
    })
    wx.error(() => {})
  })
}
function fetchConfig (ajaxUrl) {
  return new Promise((resolve, reject) => {
    let xmlhttp = null
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest()
    }
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        let data
        try {
          data = eval(`(${xmlhttp.responseText})`)
          resolve(data.data)
        } catch (e) {
          data = {}
          reject(xmlhttp)
        }
      }
    }
    xmlhttp.open(
      'GET',
      ajaxUrl,
      true
    )
    xmlhttp.send()
  })
}
/**
 * QQ分享设置
 * @param {*} data
 */
function _initQQ (data) {
  var info = { title: data.title, desc: data.summary, share_url: data.url, image_url: data.pic, imageUrl: data.pic }
  function doQQShare () {
    try {
      if (data.callback) {
        window.mqq.ui.setOnShareHandler(function (type) {
          if (type === 3 && (data.swapTitle || data.WXconfig && data.WXconfig.swapTitleInWX)) {
            info.title = data.summary
          } else {
            info.title = data.title
          }
          info.share_type = type
          info.back = true
          window.mqq.ui.shareMessage(info, function (result) {
            if (result.retCode === 0) {
              data.callback && data.callback.call(this, result)
            }
          })
        })
      } else {
        window.mqq.data.setShareInfo(info)
      }
    } catch (e) {
    }
  }
  if (window.mqq) {
    doQQShare()
  } else {
    require([qqapi], function () {
      doQQShare()
    })
  }
}

module.exports = {
  share: wxqqshare // 暴露分享方法
}
