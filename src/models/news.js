const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true, 
        required:true
    },
    description:{
        type:String,
        trim:true,
        required:true
    },
    image:{
        type:Buffer
    },
    reporter:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Reporter'
    }
},{timestamps: true})
newsSchema.methods.toJSON = function (){
    const news = this
    const newsObject = news.toObject()

    return newsObject
}
const News = mongoose.model('News',newsSchema)
module.exports = News