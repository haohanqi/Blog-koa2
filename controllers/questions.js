
const Question = require('../models/questions.js')


const find = async (ctx) =>{
    const questions = await Question.find()
    ctx.body={
        questions
    }
}

const createQuestion = async (ctx) =>{
    ctx.verifyParams={
        title:{type:'string',required:true},
        description:{type:'string',required:false}
     }
    const newQuestion = await new Question({...ctx.request.body, questioner:ctx.state.user.id}).save()
    ctx.body={
        newQuestion
    }
}

const updateQestion = async (ctx) =>{
    ctx.verifyParams={
        title:{type:'string',required:false},
        description:{type:'string',required:false}
    }
    const question = await Question.findByIdAndUpdate(ctx.params.id,ctx.request.body)
    ctx.body={
        question
    }
}

const deleteQuestion = async (ctx) =>{
    const id = ctx.params.id
    const result = await Question.findByIdAndDelete(id)
    if(result){
        ctx.body={
            id
        }
    }
}

module.exports={
    createQuestion,find,updateQestion,deleteQuestion
}