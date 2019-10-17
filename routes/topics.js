const router = require('koa-router')()
const { find, createNewTopic, findById, updateTopicById } = require('../controllers/topics.js')
const jwt =require('koa-jwt')
const {secret} = require('../conf/db')
//middleware
const auth = jwt({secret})

router.prefix('/topics')

router.get('/list', find)

router.get('/:id', findById)

router.post('/create', auth, createNewTopic)

router.patch('/update/:id', auth, updateTopicById)

module.exports = router
