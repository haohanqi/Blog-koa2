const Answer = require('../models/answers.js')

const find = async (ctx) =>{
    const answer = await Answer.find()
    ctx.body = {answer}
}

const createNewAnswer = async (ctx) =>{
    ctx.verifyParams({
        content:{type:'string',required:true}
    })
     
    const {questionId} = ctx.params
    console.log(ctx.state)
    const userId = ctx.state.user.id
    const answer = await new Answer({...ctx.request.body,questionId:questionId,answerser:userId}).save()
    ctx.body={answer}

}

const updateAnswer = async (ctx) =>{
    ctx.verifyParams({
        content:{type:'string',required:true}
    })
    const id = ctx.params.id
    const answer = await Answer.findByIdAndUpdate(id,ctx.request.body)
    ctx.body={answer}
}


module.exports={find,createNewAnswer,updateAnswer}

