## wxqqshare


[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

#### 可用于微信，QQ客户端内容分享 （jsweixin-1.4.0）
##### [问题反馈](https://github.com/Halokitiboy/wxqqshare/issues)

## 安装
```
npm install wxqqshare --save-dev

or

yarn add wxqqshare

```
## 用法
```
import {share} from 'wxqqshare'

share({
    debug: false // 开启调试模式,调用的所有api的返回值会在客户端alert出来 默认为false
    title:'', // 标题 (必填)
    desc:'', // 描述 (必填)
    link:'',  // 链接 (必填)
    imgUrl:'', // 分享图 (必填)
    config:{
        appId: '', // 必填，公众号的唯一标识
        timestamp: '', // 必填，生成签名的时间戳
        nonceStr: '', // 必填，生成签名的随机串
        signature: '',// 必填，签名
    }
    //ajaxUrl:''   用于获取wx.config认证配置（{appId,timestamp,nonceStr,signature}）的接口请求地址 
})
```
##### 微信分享config与ajaxUrl二者配置其一即可 ，若只做QQ客户端分享两者可忽略

##### 分享到朋友圈
![分享到朋友圈](https://github.com/Halokitiboy/wxqqshare/blob/master/01.jpeg =300)
##### 分享到QQ空间
![分享到QQ空间](https://github.com/Halokitiboy/wxqqshare/blob/master/02.jpeg =300)
##### 分享到QQ
![分享到QQ](https://github.com/Halokitiboy/wxqqshare/blob/master/03.jpeg =300)
##### 分享到微信朋友
![分享到微信朋友](https://github.com/Halokitiboy/wxqqshare/blob/master/04.jpeg =300)

## ToDo
- [x] 支持1.4.0
- [ ] 支持分享自由配置
- [ ] 支持更多接口
