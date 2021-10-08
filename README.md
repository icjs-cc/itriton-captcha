# itriton-captcha

### 介绍
生成滑动验证码拼图图片和背景图片

### 安装
`npm i @itriton/captcha`

### 使用方法
```
const captcha = require('@itriton/captcha')

captcha.create().then(res=>{
    console.log(res)
})
```

### 安装sharp失败的解决方案  

切换成淘宝镜像再执行`npm install sharp`命令
```
npm config set sharp_binary_host "https://npm.taobao.org/mirrors/sharp"

npm config set sharp_libvips_binary_host "https://npm.taobao.org/mirrors/sharp-libvips"

npm install sharp
```