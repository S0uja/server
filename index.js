require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express()
const jwt = require('jsonwebtoken')
const fs = require('fs')

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))

app.use((req, res, next) => {
    res.on('finish', () => {
      const token = req.headers.authorization
      if (token) {
        try{
          
          const info = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY)
          req.user = info
        }catch(e){}
      }
      
      const logData = `${new Date().toISOString()}|${req.user.id || 'GUEST'}|${req.user.role || 'none'}|${req.method}|'${req._parsedOriginalUrl.path}'|${req.ip}\n`;

      fs.appendFile('logs.log', logData, (err) => {
        if (err) {
          console.error('Ошибка при записи в лог файл:', err);
        }
      })

    })
  
    next();
})

app.use('/api', router)
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}


start()
