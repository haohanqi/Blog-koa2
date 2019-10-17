const router = require('koa-router')()
const {upload} = require('../controllers/home')

router.post('/uploads',async function(ctx,next){
   const url = await upload(ctx)
   ctx.body={
       url: url
   }
})

module.exports=router