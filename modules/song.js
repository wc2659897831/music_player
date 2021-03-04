const mongoose = require('mongoose')
const { db } = require('./user')

mongoose.connect('mongodb://localhost/musicPlayer')

const Song = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    singer:{
        type:String,
        required:true
    },
    src:{
        type:String,
        required:true
    },
    lrcSrc:{
        type:String
    },
    musicCoverImg:{
        type:String,
        default:'/static/imgs/musicCoverImg/default_cover.jpg'
    }
})

module.exports = mongoose.model('Song',Song)
