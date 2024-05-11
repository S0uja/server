const fs = require('fs')
const staticPath = require('./staticPath')

module.exports = array => {
	try {
		for (const item of array) {
			fs.unlinkSync(staticPath(item.filename))
		}
	} catch (e) {
		console.log(e)
	}
}
