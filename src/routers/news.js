const express = require('express')
const News = require('../models/news')
const router =new express.Router()
const auth = require('../middelware/auth')
const uploads = require('../multer/multer-image')

router.post('/news',auth,uploads.single('image'),async(req,res)=>{
    try{
        if(req.file != undefined){
            req.body.image = req.file.buffer

        }
        req.body.reporter = req.reporter._id
        const news = new News(req.body)
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.get('/news',auth,async(req,res)=>{
    try{
        await req.reporter.populate('news')
        res.status(200).send(req.reporter.news)
    }
    catch(e){
        res.status(400).send('e'+e)
    }
})

router.get('/news/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await News.findOne({_id,reporter:req.reporter._id})
        if(!news){
            return res.status(404).send('No News is found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.patch('/news/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const updates = Object.keys(req.body)
        const news = await News.findOne({_id,reporter:req.reporter._id})
      
        if(!news){
            return res.status(404).send('No News is found')
        }
        updates.forEach((el)=>news[el]=req.body[el])
        await news.save()
        res.send(news)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.delete('/news/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await News.findOneAndDelete({_id,reporter:req.reporter._id})
        if(!news){
        return  res.status(404).send('No News is found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send('e'+e)
    }
})


module.exports = router