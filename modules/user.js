const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/musicPlayer') // 连接数据库

// 实例化一个模板进行设置
const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String
    },
    createTime:{
        type:Date,
        default: Date.now
    },
    avatar:{
        type:String,
        default:'/static/imgs/avatar/avatar_default.jpg'
    },
    cover:{
        type:String,
        default:'/static/imgs/userCover/user_cover_default.jpg'
    },
    level:{
        type:Number,
        default: 1
    },
    jurisdiction:{
        type:String,
        default:'user'
    },
    specialInfo:{
        type:Number,
        default:0
    }
})

// 根据模板生成集合
module.exports = mongoose.model('User',UserSchema)
// db.users.update({username:'234'},{$set:{jurisdiction:'admin'}})