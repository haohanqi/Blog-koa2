const Topic = require('../models/topics.js')
const User =require('../models/users')
const Question = require ('../models/questions')



const find = async (ctx) => {
    const {keyword=''}=ctx.query
    const perPage = 5;
    let {page} = ctx.query
    
    //make sure page num is liegal 
    if(page<=0){
        page=1
    }
    
    if(keyword === ''){
        const result =await Topic.find().limit(perPage).skip((page-1)*5)
       ctx.body={result}
    }else{
        const result =await Topic.find({name:new RegExp(`${keyword.toLowerCase()}|${keyword.toUpperCase()}`)}).limit(perPage).skip((page-1)*5)
        ctx.body={result} 
    }
}

const findById = async (ctx) => {
    const { id } = ctx.params
    const { fields='' } = ctx.query
    const selectedFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const topic = await Topic.findById(id).select(selectedFields)
    ctx.body = topic
}

const createNewTopic = async (ctx) => {
    const topic = ctx.request.body
    //check post info
    ctx.verifyParams({
        name: { type: 'string', required: true },
        avatar_url: { type: 'string', required: false },
        introduction: { type: 'string', required: false }
    })
    const result = await new Topic(topic).save()

    ctx.body = result
}

const updateTopicById = async (ctx) => {
    const { id } = ctx.params;
    const info = ctx.request.body;
    console.log(id, info)
    ctx.verifyParams({
        name: { type: 'string', required: false },
        avatar_url: { type: 'string', required: false },
        introduction: { type: 'string', required: false }
    })

    const newTopic = await Topic.findByIdAndUpdate(id, info)
    ctx.body = newTopic

}

const getTopicfollower = async (ctx) => {
    const topicId = ctx.params.id
    const follower = await User.find({followingTopics:topicId})
    const total =follower.length
    ctx.body={
        follower,
        total
    }
}

const listQuestions = async (ctx) =>{
    const questions = await Qurstion.find({topics:ctx.params.id})
    ctx.body={
        questions 
    }

}
module.exports = {
    find, createNewTopic, findById, updateTopicById,getTopicfollower,listQuestions
}