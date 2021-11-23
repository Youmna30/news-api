const multer = require('multer')

const uploads = multer({
    limits:{
        fileSize:1000000 
    },

    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
            cb(new Error('Sorry you must upload image'))
        }
        cb(null,true)
    }
})

module.exports = uploads