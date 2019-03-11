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
  desc: '', // 分享描述
  url: '', // 分享链接
  link: '', // 分享链接
  pic: '', // 分享图标
  imgUrl: '', // 分享图标
  hideAll: false
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
function wxqqshare ({ title, desc, link, imgUrl, ajaxUrl = '' } = {}) {
  if (typeof title === 'undefined' || title === '') { return console.warn('title为必填项') }
  if (typeof desc === 'undefined' || desc === '') { return console.warn('desc为必填项') }
  if (typeof link === 'undefined' || link === '') { return console.warn('link为必填项') }
  if (typeof imgUrl === 'undefined' || imgUrl === '') { return console.warn('imgUrl为必填项') }

  shareConfig.title = title
  shareConfig.summary = desc
  shareConfig.desc = desc
  shareConfig.url = link
  shareConfig.link = link
  shareConfig.pic = imgUrl
  shareConfig.imgUrl = imgUrl
  reqUrl = ajaxUrl
  init(shareConfig)
}
/**
 * 微信分享设置
 * @param {*} wxConfig
 */
function _initWX (wxConfig) {
  require([wxapi], function (wx) {
    if (!wx.config) {
      wx = window.wx
    }
    let xmlhttp
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest()
    }
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        let data
        try {
          data = eval(`(${xmlhttp.responseText})`)
        } catch (e) {
          data = {}
        }
        data = data.data
        data.jsApiList = [
          'onMenuShareTimeline',
          'closeWindow',
          'onMenuShareAppMessage',
          'hideAllNonBaseMenuItem',
          'showMenuItems',
          'showAllNonBaseMenuItem',
          'hideMenuItems'
        ]
        // 通过config接口注入权限验证配置
        wx.config(data)
        // 通过ready接口处理成功验证
        wx.ready(() => {
          const opts = {
            title: wxConfig.title, // 分享标题
            desc: wxConfig.summary, // 分享描述
            link: wxConfig.link, // 分享链接
            imgUrl: wxConfig.imgUrl // 分享图标
          }
          if (wxConfig.hideAll) {
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
            wx.showMenuItems({
              menuList: [
                'menuItem:share:appMessage',
                'menuItem:share:timeline',
                'menuItem:favorite'
              ] // 要显示的菜单项
            })
          } else {
            console.log('opts', opts)
            wx.showAllNonBaseMenuItem()
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
            wx.hideMenuItems({
              menuList: ['menuItem:openWithQQBrowser'] // 要屏蔽的菜单项
            })
          }
        })
        wx.error(() => {})
      }
    }
    xmlhttp.open(
      'GET',
      reqUrl,
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
  var info = { title: data.title, desc: data.summary, share_url: data.url, image_url: data.pic }
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
