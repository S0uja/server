module.exports = () => {
    const min = Math.pow(10, 8); // Минимальное значение (100 000 000)
    const max = Math.pow(10, 9) - 1; // Максимальное значение (999 999 999)
    
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}