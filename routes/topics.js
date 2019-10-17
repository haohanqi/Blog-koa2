const router = require('koa-router')()
const { find, createNewTopic, findById, updateTopicById, getTopicfollower } = require('../controllers/topics.js')
const jwt = require('koa-jwt')
const { secret } = require('../conf/db')
//middleware
const auth = jwt({ secret })
const checkTopicsExist = async (ctx, next) => {
    let id = ctx.params.id
    const result = await Topic.findById(id)
    if (!result) {
      ctx.throw(404, 'topic does not exist')
    }
    await next()
  }

router.prefix('/topics')

router.get('/list', find)

router.get('/:id', findById)

router.get('/:id/follower',checkTopicsExist, getTopicfollower)

router.post('/create', auth, createNewTopic)

router.patch('/update/:id', auth,checkTopicsExist, updateTopicById)

module.exports = router
