const jwt = require('jsonwebtoken')

module.exports = (id,fio,role,number,birthdate) => {
    return (
        jwt.sign({
            id:id,
            fio:fio,
            role:role,
            number:number,
            birthdate:birthdate
        },
        process.env.SECRET_KEY,
        {
            expiresIn:'24h'
        })
    )
}