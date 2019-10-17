const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
//const bodyparser = require('koa-bodyparser')
const koaBody=require('koa-body')
const logger = require('koa-logger')
const error =require('koa-json-error')
const users = require('./routes/users')
const home = require('./routes/home')
const topics = require('./routes/topics')
const questions = require('./routes/questions')
const parameter =require('koa-parameter')
const mongoose =require('mongoose')
const {mongodb}=require('./conf/db.js')
const path = require('path')
const koaStatic = require('koa-static')
//connect mongo db 
mongoose.connect(mongodb,{ useUnifiedTopology: true,useNewUrlParser: true },()=>console.log('connect successfully'))
mongoose.connection.on('error',console.error)

// error handler
//onerror(app)


app.use(koaStatic(path.join(__dirname,'public')));

app.use(error(
  {
     postFormat:(e,{stack, ...rest})=>{
     return  process.env.NODE_ENV ==='production' ? rest : {stack, ...rest}
     }  
 }
))
// middlewares
/* app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
})) */ 

//koa-body supports file format
app.use(koaBody({
  multipart: true, //file format 
  formidable:{
    uploadDir:path.join(__dirname,'/public/uploads'), 
    keepExtensions:true
  }
}))

app.use(parameter(app))//test parameters
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(users.routes(), users.allowedMethods())
app.use(home.routes(),home.allowedMethods())
app.use(topics.routes(),topics.allowedMethods())
app.use(questions.routes(),questions.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
