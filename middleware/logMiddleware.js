module.exports = function (req, res, next) {
    console.log(2);
    const logData = `${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip}\n`;

    fs.appendFile('../logs.log', logData, (err) => {
        if (err) {
            console.error('Ошибка при записи в лог файл:', err);
        }
    })

    console.log(3);
    next()
}
