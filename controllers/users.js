//const parameter = require('koa-parameter')
//const db =[{name:"haohanqi",age:25},{name:"chuting",age:26}]
const jsonwebtoken = require('jsonwebtoken')

const { secret } = require('../conf/db')

const User = require('../models/users')

const find = async (ctx) => {
    let { page } = ctx.query
    const { keyword = '' } = ctx.query
    const perPage = 5

    if (keyword === '') {
        const result = await User.find().limit(perPage).skip((page - 1) * 5)
        return result
    } else {
        const result = await User.find({ name: new RegExp(`${keyword.toLowerCase()}|${keyword.toUpperCase()}`) }).limit(perPage).skip((page - 1) * 5)
        return result
    }
}

const findUserById = async (ctx) => {
    const id = ctx.params.id

    //analyzing fields query
    const { fields = '' } = ctx.query

    const selectFields = fields.split(';').filter(field => field.length > 0).map(field => ' +' + field).join('');

    const user = await User.findById(id).select(selectFields).populate('following locations employments.company employments.job educations.shcool education.major followingTopics')

    if (!user) {
        ctx.throw(404, 'user not found')
    }
    return user
}

const getUserFollowing = async (ctx) => {
    const { id } = ctx.params
    const user = await User.findById(id).select('+following').populate('following')
    if (!user) {
        ctx.throw(404, 'user not found')
    }
    return user

}

const getUserFollowers = async (ctx) => {
    const { id } = ctx.params
    const user = await User.find({ following: id })
    return user
}

const followUp = async (ctx) => {
    const myId = ctx.state.user.id
    console.log(myId)

    // find "my" identity(since following is select:false, therefore need add it)
    const me = await User.findById(myId).select("+following")

    //the id which user wants to follow up 
    const followingId = ctx.params.id

    //follow
    if (!me.following.map(id => id.toString()).includes(followingId)) {
        me.following.push(followingId)
        me.save()
        ctx.status = 204
    }

    ctx.throw(409, 'already followed')


}

const unfollow = async (ctx) => {
    const myId = ctx.state.user.id
    const unfollowId = ctx.params.id

    const me = await User.findById(myId).select('+following')

    const result = me.following.map(id => id.toString()).indexOf(unfollowId)
    if (result >= 0) {
        me.following.splice(result, 1)
        me.save()
        ctx.status = 204
    }
    ctx.throw(409, 'id does not exists')

}

const followingTopics = async (ctx) => {
    const me = await User.findById(ctx.state.user.id).select('+followingTopics')
    console.log(me)
    //if user has followed this topic
    const topicId = ctx.params.id
    if (!me.followingTopics.map(id => id.toString()).includes(topicId)) {
        me.followingTopics.push(topicId)
        me.save()
        ctx.body = {
            id: topicId
        }
        ctx.status = 204

    } else {
        ctx.throw(409, 'already followed')
    }

}

const unfollowingTopics = async (ctx) => {
    const me = await User.findById(ctx.state.user.id).select('+followingTopics')
    const topicId = ctx.params.id
    //if user does not follow this topic
    const index = me.followingTopics.map(id => id.toString()).indexOf(topicId)
    if (index < 0) {
        ctx.throw(409, 'topic does not exist')
    }
    me.followingTopics.splice(index, 1)
    me.save()
    ctx.body = {
        topicId,
    }

}

const postUser = async (ctx) => {
    ctx.verifyParams({
        name: { type: 'string', required: true },
        password: { type: 'password', required: true, max: 12, min: 8 }
    })
    const user = ctx.request.body
    const name = user.name

    //check username, make sure it is unique
    const repeatedUser = await User.findOne({ name })
    if (repeatedUser) {
        ctx.throw(409, 'username has existed')
    }

    //create new user 
    const userNew = await new User(user).save()
    return userNew
}

const deleteUser = async (ctx) => {
    //check id, make sure id exists 
    const id = ctx.params.id
    const result = await User.findByIdAndDelete(id)
    if (!result) {
        ctx.throw(404, 'id does not exist')
    }

    return result
}

const updateUserById = async (ctx) => {
    ctx.verifyParams({
        name: { type: 'string', required: false },
        password: { type: 'string', required: false },
        avatar_url: { type: 'string', requied: false },
        gender: { type: 'string', required: false },
        headline: { type: 'string', required: false },
        locations: { type: 'array', itemType: 'string', required: false },
        business: { type: 'string', required: false },
        employments: { type: 'array', itemType: 'object', required: false },
        educations: { type: 'array', itemType: 'object', required: false }
    })
    const id = ctx.params.id
    const user = ctx.request.body
    const result = User.findByIdAndUpdate(id, user)
    if (!result) {
        ctx.throw(404, 'id does not exits')
    }
    //db[id]=user
    return result
}

const login = async (ctx) => {

    ctx.verifyParams({
        name: { type: 'string', required: true },
        password: { type: 'string', required: true }

    })

    // check username and pasword
    const result = await User.findOne(ctx.request.body)
    if (!result) {
        ctx.throw(401, 'username or password is not correct')
    }

    // if success, sign token
    const { id, name } = result
    const token = jsonwebtoken.sign({ id, name }, secret, { expiresIn: '1d' })
    return token
}


module.exports = {
    find, postUser, deleteUser, updateUserById,
    login, findUserById, getUserFollowing, followUp, unfollow, getUserFollowers,
    followingTopics, unfollowingTopics
}