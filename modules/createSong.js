const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/musicPlayer')

const CreateSong = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    songList:{
        type:Array,
        default:[]
    },
    like:{
        type:Number,
    },
    coverImg:{
        type:String,
        default:'/static/imgs/musicCoverImg/default_cover.jpg'
    }
})

module.exports = mongoose.model('CreateSong',CreateSong)
