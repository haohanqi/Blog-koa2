const mongoose = require('mongoose')

const {Schema,model} =  mongoose

const answersSchema = {
  __v:{type:Number,select:false},
  content:{type:String,required:true},
  answerser:{type:Schema.Types.ObjectId,ref:'User',required:true,select:false},
  questionId:{type:String,required:true}
}

module.exports=model('Answer',answersSchema)