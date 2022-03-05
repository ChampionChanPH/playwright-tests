function getRandomNumber(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
}

function getRandomCharacters(length) {
    let result              = ``
    let lower               = `abcdefghijklmnopqrstuvwxyz`
    let upper               = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`
    let number              = `0123456789`
    let allCharacters       = lower + upper + number
    let charactersLength    = allCharacters.length

    for (let i = 0; i < length; i++) {
      result += allCharacters.charAt(getRandomNumber(0, charactersLength - 1));
   }

   return result
}

module.exports = {
    getRandomNumber,
    getRandomCharacters
}