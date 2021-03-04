const fs = require('fs')
const LikeSong = require('../modules/likeSong')
const Song = require('../modules/song')
const CreateSong = require('../modules/createSong')
const song = require('../modules/song')

module.exports = function (router) {
  router.get('/getUserLikeSongList', async (req, res, next) => {
    try {
      const findResult = await LikeSong.findOne({ userId: req.query.userId })
      res.status(200).json({
        errCode: 0,
        message: '获取用户喜欢歌单数据成功',
        songList: findResult.songList,
        coverImg: findResult.coverImg
      })
    } catch (error) { next(error) }
  })
  router.get('/getUserCreateSongList', async (req, res, next) => {
    console.log(req.query)
    try {
      const findResult = await CreateSong.findById(req.query.songListId)
      res.status(200).json({
        errCode: 0,
        message: '获取用户创建歌单数据成功',
        songList: findResult.songList,
        coverImg: findResult.coverImg
      })
    } catch (error) { next(error) }
  })
  router.get('/getSong', async (req, res, next) => {
    try {
      const findResult = await Song.findById(req.query.songId)
      const newFindResult = {} //复制一个新的对象 因为原本mongo查找返回的数据对象是不能添加属性的
      for (const key in findResult) {
        newFindResult[key] = findResult[key]
      }
      // 判断是否有lrc文件
      if (findResult.lrcSrc) {
        newFindResult._doc.lrcData = fs.readFileSync(`.${findResult.lrcSrc}`).toString() //读取歌词文件并赋值
      }
      const user_id = req.query.userId || false
      if (user_id) {
        const findLikeSongResult = await LikeSong.findOne({ userId: user_id })
        let isLikeMusic = false
        for (const obj of findLikeSongResult.songList) {
          //验证当前的歌是否是我喜欢的歌曲
          if (obj.songId === req.query.songId) {
            isLikeMusic = true
            break
          }
        }
        newFindResult._doc.isLikeMusic = isLikeMusic
      }
      res.status(200).json({
        errCode: 0,
        message: '获取歌曲数据成功',
        songData: newFindResult
      })
    } catch (error) { next(error) }

  })
  router.get('/addSongToSongList', async (req, res, next) => {
    try {
      const song_id = req.query.songId
      const user_id = req.query.userId
      const type = req.query.type
      const songListId = req.query.songListId

      let ifExist = false //是否存在
      let songIndex = 0 // 存在的话 歌曲索引
      let flag = true //是否添加还是取消
      let table = {}
      let findResult = null //查找的值
      if (type === 'likeSongList') {
        table = LikeSong
        findResult = await table.findOne({ userId: user_id })
      } else if (type === 'createSongList') {
        table = CreateSong
        findResult = await table.findById(songListId)
      }
      let songList = findResult.songList
      console.log(findResult)
      for (const i in songList) {
        if (songList[i].songId === song_id) {
          ifExist = true
          songIndex = i
          break
        }
      }

      // 判断是否存在
      if (!ifExist) {
        songList = findResult.songList //修改songList 增加id
        songList.push({
          songId: song_id,
          addTime: +new Date()
        })
        if (type === 'likeSongList') {
          await table.updateOne({ userId: user_id }, { songList: songList })
        } else if (type === 'createSongList') {
          await table.update({ "_id": songListId }, { $set: { songList: songList } })
        }
        flag = true
      } else {
        if (type === 'createSongList') {
          res.status(200).json({
            errCode: 1,
            message: '歌曲已经存在'
          })
          return
        } else {
          songList.splice(songIndex, 1) //删除数组元素
          await table.updateOne({ userId: user_id }, { songList: songList })
          flag = false
        }
      }
      if (songList.length) {
        const sortList = songList.sort((a, b) => b.addTime - a.addTime) //排序 
        findResult = await song.findById(sortList[0].songId) // 查找排序为第一首歌的数据
        if (type === 'likeSongList') {
          await table.updateOne({ userId: user_id }, { coverImg: findResult.musicCoverImg }) //将第一首歌的封面作为本歌单的封面
        } else if (type === 'createSongList') {
          await table.updateOne({ "_id": songListId }, { $set: { coverImg: findResult.musicCoverImg } })
        }
      }
      if (flag) {
        res.status(200).json({
          errCode: 0,
          message: '添加到歌单成功'
        })
      } else {
        res.status(200).json({
          errCode: 1,
          message: '成功取消到我的歌单'
        })
      }
    } catch (error) { next(error) }
  })
  router.get('/createSongList', async (req, res, next) => {
    try {
      await new CreateSong(req.query).save()
      res.status(200).json({
        errCode: 0,
        message: '创建歌单成功'
      })
    } catch (error) { next(error) }
  })
  router.get('/getCreateSongList', async (req, res, next) => {
    try {
      const findResult = await CreateSong.find({ userId: req.query.userId })
      res.status(200).json({
        errCode: 0,
        message: '获取用户创建的歌单数据成功',
        songList: findResult
      })
    } catch (error) { next(error) }
  })
  router.get('/delCreateSongList', async (req, res, next) => {
    try {
      await CreateSong.remove({ '_id': req.query.songListId })
      res.status(200).json({
        errCode: 0,
        message: '删除歌单成功'
      })
    } catch (error) { next(error) }
  })
}
