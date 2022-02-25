function getRandomNumber(minimum, maximum) {
    let random = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
    return random
}

module.exports = {
    getRandomNumber
}