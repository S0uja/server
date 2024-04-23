const uuid = require('uuid')
const staticPath = require('../utils/staticPath')

module.exports = (img) => {
    const fileName = uuid.v4() + ".jpg"
    img.mv(staticPath(fileName))
    return fileName
}