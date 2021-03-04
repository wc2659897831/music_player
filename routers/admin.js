const Song = require('../modules/song')
const User = require('../modules/user')
const CreateSong = require('../modules/createSong')
const LikeSong = require('../modules/likeSong')

module.exports = function(router){
    router.post('/addSong',async (req,res,next)=>{
        const body = req.body
        try {
            const findResult = await Song.findOne({ src:body.src })
            if(findResult){
                return res.status(200).json({
                    errCode:1,
                    message:'文件路径冲突!'
                })
            }
            await new Song(body).save()
            return res.status(200).json({
                errCode:0,
                message:'添加音乐成功!'
            })
        } catch (error) { return next(error) }
    })
    router.get('/getUserList',async (req,res,next)=>{
        try {
            const findResult = await User.find()
            return res.status(200).json({
                errCode:0,
                message:'成功获取用户列表!',
                userList:findResult
            })
        } catch (error) { return next(error) }
    })
    router.get('/delUser',async (req,res,next)=>{
        try {
            await User.remove({'_id':req.query.userId})
            await CreateSong.remove({'userId':req.query.userId})
            await LikeSong.remove({'userId':req.query.userId})
            return res.status(200).json({
                errCode:0,
                message:'删除用户成功!'
            })
        } catch (error) { return next(error) }
    })
    
    router.get('/getAllSong',async (req,res,next)=>{
        try {
            const findResult = await Song.find()
            return res.status(200).json({
                errCode:0,
                message:'成功获取歌曲列表!',
                songList:findResult
            })
        } catch (error) { return next(error) }
    })
    router.post('/updateSong',async (req,res,next)=>{
        try {
            await Song.updateOne({'_id':req.body.songId},req.body)
            return res.status(200).json({
                errCode:0,
                message:'修改歌曲成功!'
            })
        } catch (error) { return next(error) }
    })
    router.post('/updateUser',async (req,res,next)=>{
        try {
            console.log(req.body)
            await User.updateOne({'_id':req.body.userId},{$set:req.body})
            return res.status(200).json({
                errCode:0,
                message:'修改用户成功!'
            })
        } catch (error) { return next(error) }
    })
    router.get('/delSong',async (req,res,next)=>{
        try {
            await Song.remove({'_id':req.query.songId})
            return res.status(200).json({
                errCode:0,
                message:'删除歌曲成功!'
            })
        } catch (error) { return next(error) }
    })
}