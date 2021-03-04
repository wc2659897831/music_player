const Song = require('../modules/song')
const User = require('../modules/user')

module.exports = function(router){
    router.get('/globalSearch',async (req,res,next)=>{
        const searchValue = req.query.value
        let userList = [] //搜索到的用户列表
        let songList = [] //搜索到的歌曲列表
        // 查找歌曲名
        try {
            const songFindResult = await Song.find({name:new RegExp(searchValue)}) // 查找歌曲
            for(const obj of songFindResult){
                songList.push({
                    id:obj._id,
                    name:obj.name,
                    singer:obj.singer,
                    src:obj.src,
                })
            }
            const UserFindResult = await User.find({username:new RegExp(searchValue)}) //查找用户
            for(const obj of UserFindResult){
                userList.push({
                    id:obj._id,
                    username:obj.username,
                    avatar:obj.avatar
                })
            }
            res.status(200).json({
                errCode:0,
                message:'获取数据成功',
                data:{userList,songList}
            })
        } catch (error) { next(error) }
    })
}