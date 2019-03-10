## wxqqshare


[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

#### 可用于微信，QQ客户端内容分享 （jsweixin-1.4.0）

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
    title:'', // 标题 (必填)
    desc:'', // 描述 (必填)
    link:'',  // 链接 (必填)
    imgUrl:'', // 分享图 (必填)
    ajaxUrl:''  // 用于获取wx.config认证配置
})
```

## ToDo
- [x] 支持1.4.0
- [ ] 支持分享自有配置
- [ ] 支持更多接口
