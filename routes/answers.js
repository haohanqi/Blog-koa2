const router = require('koa-router')()
const {find,createNewAnswer,updateAnswer}=require('../controllers/answers')
const Answer = require('../models/answers')
const { secret } = require('../conf/db')
const jwt = require('koa-jwt')


const auth = jwt({ secret })
const checkAnswerExist = async (ctx,next)=>{
    const result = await Answer.findById(ctx.params.id)
    if(!result){
        ctx.throw(409,'answer does not exist')
    } 
    
}
const checkIdentity = async (ctx,next)=>{

}


router.prefix('/questions/:questionId/answer')

router.get('/list',find)

router.post('/createAnswer',auth,createNewAnswer)

router.patch('/update/:id',auth,updateAnswer)



module.exports=router
