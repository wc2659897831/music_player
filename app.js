const express = require('express')
const router = require('./routers')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')

const app = express()

// 配置静态访问路径
app.use('/public',express.static(path.join(__dirname,'./public')))
app.use('/static',express.static(path.join(__dirname,'./static')))
app.use('/node_modules',express.static(path.join(__dirname,'./node_modules')))

// 模板引擎
app.engine('html',require('express-art-template'))
// 重写views路径
app.set('views',path.join(__dirname,'./views'))

//解析form数据的插件
app.use(bodyParser.urlencoded({ express:false }))
app.use(bodyParser.json())

//session
app.use(session({
    //数据加密字符串
    secret:' itcast',
    resave:false,
    // 使用时分配钥匙(false)还是一直分配钥匙(true)
    saveUninitialized:true
}))

// 使用路由
app.use(router)

//错误处理中间件  用来处理全部服务器错误
app.use(function (err, req, res, next) {
    return res.status(500).send(err.message)
})

// 接口监听
app.listen(3000,()=>{ console.log('http://127.0.0.1:3000') })