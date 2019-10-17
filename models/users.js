const mongoose = require('mongoose')

const {Schema,model} = mongoose;

//create a schema
const userSchema = new Schema({
    
    __v:{type:Number,select:false},
    
    name:{type:String,reuqired:true},
    
    password: {type:String,required:true, select:false},
   
    avatar_url:{type:String},
    
    gender:{type:String, enum:['male','female'],default:'male',required:true}, //only can choose male or female
    
    headline:{type:String},
    
    locations:{type:[{type:Schema.Types.ObjectId, ref:'Topic'}],select:false},
    
    business:{type:Schema.Types.ObjectId, ref:'Topic',select:false},
    
    employments:{
        type:[{
            company:{type:Schema.Types.ObjectId, ref:'Topic'},
            job:{type:Schema.Types.ObjectId, ref:'Topic'}
        }],select:false
    },
   
    educations:{
        type: [{
            school: {type:Schema.Types.ObjectId, ref:'Topic'},
            major:{type:Schema.Types.ObjectId, ref:'Topic'},
            diploma:{type:Number, enum:[1,2,3,4,5]},
            enroll_year:{type:Number},
            graduation_year:{type:Number}
            
        }],select:false
    },
    
    following:{
        type:[{type:Schema.Types.ObjectId, ref:'User'}],select:false
    },
    followingTopics:{
        type:[{type:Schema.Types.ObjectId,ref:'Topic',select:false}]
    }



});

//modeling schema 
module.exports=model('User', userSchema)


