const express = require('express')
const router = new express.Router()
const Reporter = require('../models/reporter')
const auth = require('../middelware/auth')
const uploads = require('../multer/multer-image')

router.post('/reporter',uploads.single('avatar'),async(req,res)=>{
   
    try{
        console.log(req.file);

        req.body.avatar = req.file.buffer
        const reporter = new Reporter(req.body)
        const token = await reporter.generateToken()
        await reporter.save()
        res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})


router.post('/reporter/login',async(req,res)=>{
    try{
        const reporter = await Reporter.findByCredentials(req.body.email,req.body.password)
        const token = await reporter.generateToken()
        res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(400).send('Error'+e)
    }
})

router.get('/reporters',auth,(req,res)=>{
    Reporter.find({}).then((reporters)=>{
        res.status(200).send(reporters)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})


router.get('/profile',auth,async(req,res)=>{
    res.send(req.reporter)
})

router.get('/reporter/:id',auth,(req,res)=>{
    const _id = req.params.id
    Reporter.findById(_id).then((reporter)=>{
        if(!reporter){
          return  res.status(404).send('Unable to find reporter')
        }
        res.status(200).send(reporter)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})


router.patch('/reporter/:id',auth,async(req,res)=>{
    try{
    const updates = Object.keys(req.body) 
    const allowedUpdates = ["phoneNumber","age","name","password"]
    var isValid = updates.every((update)=> allowedUpdates.includes(update))
    if(!isValid){
        return res.status(400).send('Cannot update')
    }
    const _id = req.params.id
        const reporter = await Reporter.findById(_id)  
        if(!reporter){
            return res.status(404).send('No reporter is found')
        }
        updates.forEach((update)=> reporter[update] = req.body[update])
        await reporter.save() 
        res.status(200).send(reporter)
    }
catch(e){
    res.status(400).send('error'+e)
}
})


router.delete('/reporter/:id',auth,async (req,res)=>{
    try{
        const _id = req.params.id
        const reporter = await Reporter.findByIdAndDelete(_id)
        if(!reporter){
            return res.status(404).send('Unable to find reporter')
        }
        res.status(200).send(reporter)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.delete('/logout',auth,async(req,res)=>{
    try{
        req.reporter.tokens = req.reporter.tokens.filter((el)=>{
            return el.token !== req.token
        })
        await req.reporter.save()
        res.send('Logout Success')
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.post('/profile/avatar',auth,uploads.single('avatar'),async(req,res)=>{
   try{
       req.reporter.avatar = req.file.buffer
       await req.reporter.save()
       res.send()
   }
   catch(e){
       res.status(500).send(e)
   }
})

module.exports = router