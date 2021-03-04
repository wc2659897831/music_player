
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/musicPlayer')

const LikeSong = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    songList:{
        type:Array,
        default:[]
    },
    like:{
        type:Number,
        default:0
    },
    coverImg:{
        type:String,
        default:'/static/imgs/musicCoverImg/default_cover.jpg'
    }
})

module.exports = mongoose.model('LikeSong',LikeSong)

