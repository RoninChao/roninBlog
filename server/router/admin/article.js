module.exports = app => {
    const express = require('express')
    const router  = express.Router()
    const articleSchema = require('../../models/articleModel')
    const midAuth = require('../../middleware/auth')
    app.use('/api/admin', router)
    //新增文章
    router.post('/article', midAuth(), async (req, res) =>{
        let {title, category, imgUrl, desc, content} = req.body
        console.log(imgUrl)
        let count = await articleSchema.findOne({title})
        if(count) return res.status(422).send({
            code:-1,
            message:"文章已经存在"
        })
        let time = new Date().getTime()
        let visits = 0
        let comments = 0
        let data = await articleSchema.create({title, category, imgUrl, content, desc, visits, comments, time})
        res.send({
            code:0,
            message:'文章添加成功'
        })
    })
     //删除文章
    router.delete('/article/:id', midAuth(), async (req, res) => {
        await articleSchema.findByIdAndRemove(req.params.id)
        res.send({
            code:0,
            message:"删除成功"
        })
    })
     //修改文章
     router.put('/article/:id', midAuth(), async (req, res) => {
        let {title, category, imgUrl, desc, content} = req.body
        await articleSchema.findByIdAndUpdate(req.params.id,{title, category, imgUrl, desc, content})
        res.send({
            code:0,
            message:"修改成功"
        })
    })
    //获取文章
    router.post('/article/getList', midAuth(), async (req, res) =>{
        let {currentPage, pageSize} = req.body
        //获取数据总数
        let total = await articleSchema.countDocuments()
        //skip表示跳过数据
        let data = await articleSchema.find().populate('category').skip((currentPage-1)*pageSize).limit(pageSize)
        res.send({
            code:0,
            data,
            total
        })
    })
    //模糊查询
    router.post('/article/search', midAuth(), async (req, res) =>{
        let {search, currentPage, pageSize} = req.body
        //获取数据总数
        let total = await articleSchema.countDocuments({title:new RegExp(search)})
        //skip表示跳过数据
        let data = await articleSchema.find({title:new RegExp(search)}).populate('category').skip((currentPage-1)*pageSize).limit(pageSize)
        res.send({
            code:0,
            data,
            total
        })
    })
    //根据ID获取文章
    router.get('/article/:id', midAuth(), async (req, res) =>{
        let data = await articleSchema.findById(req.params.id)
        console.log(data)
        res.send({
            code:0,
            data
        })
    })
}