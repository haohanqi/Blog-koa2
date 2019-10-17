
const path = require('path')

const upload = async (ctx)=>{
    const file= ctx.request.files.file
    const basename = path.basename(file.path) // get file name+extension aa.png
    const url = `${ctx.origin}/uploads/${basename}`
    return url
}

module.exports={
    upload
}