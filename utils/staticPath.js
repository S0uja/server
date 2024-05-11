const path = require('path')

module.exports = fileName => {
	return path.resolve(__dirname, '..', 'static', fileName)
}
