const router = require('koa-router')()
const {
  find,postUser,
  deleteUser,
  updateUserById,login,
  findUserById,
  getUserFollowing,
  followUp,unfollow,getUserFollowers,
  followingTopics,unfollowingTopics
} = require('../controllers/users')
const User = require('../models/users')
const Topic = require('../models/topics')
const jsonwebtoken = require('jsonwebtoken')
const jwt = require('koa-jwt')
const {secret} = require('../conf/db')

//authorization
  /* const auth = async (ctx,next)=>{
  const {authorization = ''}=ctx.request.header // if not authorized, set it to ''
  const token = authorization.replace('Bearer ','')// get token
  try{
    const user = jsonwebtoken.verify(token,secret)
    ctx.state.user=user
    console.log(ctx.state.user)
  } catch(err){
    ctx.throw(401,err.message)
  }
   await next()
}  */


//middleware-------------------------------------------------------------------
const auth=jwt({secret})
const checkUserExist=async(ctx,next)=>{
  const id = ctx.params.id
  const user = await User.findById(id)
  if(!user){
    ctx.throw(404,'user id does not exist')
  }
  await next()
}
const checkTopicsExist=async(ctx,next)=>{
  let id = ctx.params.id
  const result = await Topic.findById(id)
  if(!result){
    ctx.throw(404,'topic does not exist')
  }
    await next()
}
const checkIdentity=async(ctx,next)=>{
  console.log(ctx.state.user.id)
  if(ctx.params.id !== ctx.state.user.id){
    ctx.throw(403,'identity check failed')
  }
  await next();
}  
  

//router------------------------------------------------------------------------

router.prefix('/users')

//get user list
router.get('/list', async function (ctx, next) {
  const db=await find(ctx)
  ctx.body = db
})

//get specific user by id (get more info using query: fileds=business;locations )
router.get('/:id',async function(ctx,next){
  const user = await findUserById(ctx)
  ctx.body={user}
})

//get specific user's followings by id 
router.get('/:id/following',async function(ctx,next){
  const user = await getUserFollowing(ctx)
  ctx.body={
    user
  }
})

//get specific user's followers by id 
router.get('/:id/followers',async function(ctx,next){
     const userList = await getUserFollowers(ctx)
     ctx.body={
       totalFollower:userList.length,
       userList,
     }
})

//user followup some user by id 
router.put('/following/:id',auth,checkUserExist,followUp)

//user unfollow some user by id 
router.delete('/following/:id',auth,checkUserExist,unfollow)

//user followup some topics by id 
router.put('/followingTopics/:id',auth,checkTopicsExist,followingTopics)

//user unfollow some topics by id 
router.delete('/followingTopics/:id',auth,checkTopicsExist,unfollowingTopics)

//create a new user (register)
router.post('/createUser', async function (ctx, next) {
  const user =await postUser(ctx)
  ctx.body = {user:user.id,name:user.name}
})

router.delete('/delete/:id',auth,checkIdentity, async function(ctx,next){
  const result = await deleteUser(ctx)
  ctx.body={
    message:`delete user--${result.id} successfully`
  }
})

//update user info by id 
router.patch('/update/:id',auth, checkIdentity, async function (ctx,next){
  const result = await updateUserById(ctx)
  ctx.body={
    message:`update user--${result.id} successfully  `
  }

})

//login
router.post('/login', async function(ctx,next){
     const token = await login(ctx)
     ctx.body={
        token,
        message:'login successed'
     }
})

module.exports = router
