
const Question = require('../models/questions.js')


const find = async (ctx) =>{
    const questions = await Question.find()
    ctx.body={
        questions
    }
}

const findById = async (ctx) => {
    const {fields = ''}=ctx.query
    const selectFields = fields.split(';').filter(f=>f).map(f=>' +'+f).join('')
    const question = await Question.findById(ctx.params.id).select(selectFields).populate('questioner topics')
    ctx.body={
        question
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
    createQuestion,find,updateQestion,deleteQuestion,findById

}