const router = require('koa-router')()
const {find,createNewAnswer,updateAnswer,deleteAnswer}=require('../controllers/answers')
const Answer = require('../models/answers')
const { secret } = require('../conf/db')
const jwt = require('koa-jwt')


const auth = jwt({ secret })
const checkAnswerExist = async (ctx,next)=>{
    const result = await Answer.findById(ctx.params.id)
    if(!result){
        ctx.throw(404,'answer does not exist')
    } 
    if(result.questionId !== ctx.params.questionId){
        ctx.throw(404,`can not find the answer under ${result.questionId} question `)
    }
    await next()

}
const checkAnswersner = async (ctx,next)=>{
   const me = await Answer.findById(ctx.params.id).select('+answerser') 
   const answerserId = me.answerser.toString()
   const userId = ctx.state.user.id
   if(userId !== answerserId){
       ctx.throw(409,'can not do')
   }
   await next()
   
}


router.prefix('/questions/:questionId/answer')

router.get('/list',find)

router.post('/createAnswer',auth,createNewAnswer)

router.patch('/update/:id',auth,checkAnswerExist,checkAnswersner,updateAnswer)

router.delete('/delete/:id',auth,checkAnswerExist,checkAnswersner,deleteAnswer)



module.exports=router
