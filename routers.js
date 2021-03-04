const express = require('express')
const userRouter = require('./routers/user.js')
const songRouter = require('./routers/song')
const searchRouter = require('./routers/search')
const adminRouter = require('./routers/admin')

const router = express.Router() // 实例化一个路由

// 挂载基本路由
router.get('/',(req,res)=>{
    if(req.session.user){
        if(req.session.jurisdiction === 'user'){
            res.render('index.html',{
                userId:req.session.userId
            })
        }else if(req.session.jurisdiction === 'admin'){
            res.render('admin_index.html',{
                userName:req.session.user
            })
        }
    }else{
        res.render('login.html',{
            message:'先进行登录才能操作'
        })
    }
})

userRouter(router) //用户操作路由
songRouter(router) //歌单路由
searchRouter(router) //搜索路由
adminRouter(router) //后台操作路由

module.exports = router