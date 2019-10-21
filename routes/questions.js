const router = require('koa-router')()
const {find,createQuestion,updateQestion,deleteQuestion,findById} =require('../controllers/questions')
const Question = require('../models/questions')
const jwt = require('koa-jwt')
const { secret } = require('../conf/db')

//middleware
const auth = jwt({ secret })
const checkQuestionerIdentity=async(ctx,next) =>{
    const me = await Question.findById(ctx.params.id).select('+questioner')
    const questionId = me.questioner.toString()
    const userId = ctx.state.user.id
    console.log(questionId,userId)

    if(questionId !== userId ){
        ctx.throw(403,'identity check failed' )
    }
    await next()
}
const checkQuestionExist = async (ctx,next) =>{
    const result = await Question.findById(ctx.params.id)
    if(!result){
        ctx.throw(404, 'Question does not exist')
    }
    await next()
}

router.prefix('/questions')

router.get('/list',find)

router.get('/:id',findById)

router.post('/createQuestion',auth,createQuestion)

router.patch('/updateQuestion/:id',auth,checkQuestionerIdentity,updateQestion)

router.delete('/deleteQuestion/:id',auth,checkQuestionExist,checkQuestionerIdentity,deleteQuestion)

module.exports=router