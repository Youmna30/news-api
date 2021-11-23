const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const reporterSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age:{
        type:Number,
        default:30,
        validate(value){
            if(value<0){
                throw new Error('Age must be positive number')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:6
    },
    phoneNumber:{
        type:String,
        default:30,
        validate(value){
            if(!validator.isMobilePhone(value,'ar-EG')){
                throw new Error('Please enter a valid mobile number')
            }
        }
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    avatar:{
        type:Buffer
    }
},{timestamps:true})

reporterSchema.virtual('news',{
    ref:'News',
    localField:'_id',
    foreignField:'reporter'
})

reporterSchema.pre('save',async function(next){
    const reporter = this
    if(reporter.isModified('password'))
   { 
    reporter.password = await bcrypt.hash(reporter.password,8)
    }

    next()
})

reporterSchema.statics.findByCredentials = async (email,password) =>{
    const reporter = await Reporter.findOne({email:email})
    if(!reporter){
        throw new Error('Please Sign up')
    }
    const isMatch = await bcrypt.compare(password,reporter.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return reporter
}

reporterSchema.methods.generateToken = async function (){
    const reporter = this
    const token = jwt.sign({_id:reporter._id.toString()},'new-api')
    reporter.tokens = reporter.tokens.concat({token})  
    await reporter.save() 
    return token
}

reporterSchema.methods.toJSON = function (){
    const reporter = this
    const reporterObject = reporter.toObject()

    delete reporterObject.password
    delete reporterObject.tokens

    return reporterObject
}

const Reporter = mongoose.model('Reporter',reporterSchema)
module.exports = Reporter