const User = require('../modules/user')
const LikeSong = require('../modules/likeSong')
const multiparty = require('multiparty')
const fs = require('fs')

module.exports = function (router) {
    router.get('/login', (req, res, next) => { res.render('login.html') })
    router.get('/register', (req, res, next) => { res.render('login.html') })
    router.post('/login', async (req, res, next) => {
        const body = req.body
        try {
            const findResult = await User.findOne({ username: body.username, password: body.password })
            if (findResult) {
                req.session.user = findResult.username //写入session
                req.session.userId = findResult._id
                req.session.jurisdiction = findResult.jurisdiction
                res.status(200).json({
                    errCode: 0,
                    message: '登录成功'
                })
            } else {
                res.status(200).json({
                    errCode: 1,
                    message: '用户名或者密码错误'
                })
            }
        } catch (error) { next(error) }
    })
    router.get('/loginOut', (req, res, next) => {
        delete req.session.user
        delete req.session.userId
        delete req.session.jurisdiction
        res.redirect('/')
    })
    router.post('/register', async (req, res, next) => {
        const body = req.body
        try {
            let findResult = await User.findOne({ username: body.username }) //查找是否存在该用户名
            if (findResult) {
                res.status(200).json({
                    errCode: 1,
                    message: '用户名已经存在'
                })
            } else {
                req.session.user = body.username //写入session
                await new User(body).save() //保存用户数据
                findResult = await User.findOne({ username: body.username }) //根据用户名找到用户id
                await new LikeSong({ userId: findResult._id }).save() // 根据用户id生成我喜欢的歌单
                res.status(200).json({
                    errCode: 0,
                    message: '注册成功'
                })
            }
        } catch (error) { next(error) }
    })
    router.get('/getUserData', async (req, res, next) => {
        try {
            const findResult = await User.findById(req.query.userId)
            if (findResult) {
                res.status(200).json({
                    errCode: 0,
                    message: '查找成功',
                    data: findResult
                })
            }
        } catch (err) { next(error) }
    })
    router.post('/upLoadImg', async (req, res, next) => {
        let form = new multiparty.Form()
        form.encoding = 'utf-8'
        form.uploadDir = './static/imgs/'
        form.parse(req,async (err,fields,files)=>{
            try {
                if(err){ console.log(err) }
                console.log(fields)
                console.log(files)
                const uploadType = fields.uploadType[0]
                const userId = fields.userId[0]
                const houzui = files.File[0].originalFilename.split('.')[1] //获取后缀
                let path = ''
                if(uploadType === 'avatar'){
                    path = './static/imgs/avatar/'
                }else if(uploadType === 'cover'){
                    path = './static/imgs/userCover/'
                }
                fs.renameSync(files.File[0].path,`${path}${userId}.${houzui}`) //移动文件到指定文件并重命名
                await User.updateOne({'_id':userId},{$set:{[uploadType]:`${path}${userId}.${houzui}`}}) //更改数据库
                res.status(200).json({
                    errCode: 0,
                    message: '更换成功'
                })
            } catch (error) { next(error) }
        })
    })
}
