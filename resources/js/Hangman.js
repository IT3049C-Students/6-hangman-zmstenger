class Hangman {
  constructor(_canvas) {
    if (!_canvas) {
      throw new Error(`invalid canvas provided`);
    }

    this.canvas = _canvas;
    this.ctx = this.canvas.getContext(`2d`);
  }

  /**
   * This function takes a difficulty string as a patameter
   * would use the Fetch API to get a random word from the Hangman
   * To get an easy word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=easy
   * To get an medium word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=medium
   * To get an hard word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=hard
   * The results is a json object that looks like this:
   *    { word: "book" }
   * */
  getRandomWord(difficulty) {
      return fetch(
        `https://hangman-micro-service.herokuapp.com/?difficulty=${difficulty}`
      )
        .then((r) => r.json())
        .then((r) => this.word = r.word)
  }

  /**
   *
   * @param {string} difficulty a difficulty string to be passed to the getRandomWord Function
   * @param {function} next callback function to be called after a word is reveived from the API.
   */
  start(difficulty, next) {
    
    this.word = this.getRandomWord(difficulty);
    this.clearCanvas();
    this.drawBase();
    this.guesses = [];
    this.isOver = false;
    this.didWin = false;
    next()
    
   
    
    // get word and set it to the class's this.word
    // clear canvas
    // draw base
    // reset this.guesses to empty array
    // reset this.isOver to false
    // reset this.didWin to false
  }

  /**
   *
   * @param {string} letter the guessed letter.
   */
  guess(letter) {
    var myLetter = letter.toLowerCase();
    if (myLetter == undefined){
        alert('No input')
        throw(Error)
      }
    else if (!/^[a-zA-Z]+$/.test(myLetter)){
      alert(myLetter+' is not a letter')
      throw(Error)
    }
    else if(myLetter.length !== 1){
      alert(myLetter+' is more than 1 character')
      throw(Error)
    }
    else if(this.guesses.includes(myLetter))
     {
      alert('You have already guessed the letter '+myLetter)
      throw Error;
    }
    else{
      this.guesses.push(myLetter)
      if (this.word.toString().includes(myLetter)) {
        this.checkWin()
      }
      else {
        this.onWrongGuess() 
    }
  }
    // Check if nothing was provided and throw an error if so
    // Check for invalid cases (numbers, symbols, ...) throw an error if it is
    // Check if more than one letter was provided. throw an error if it is.
    // if it's a letter, convert it to lower case for consistency.
    // check if this.guesses includes the letter. Throw an error if it has been guessed already.
    // add the new letter to the guesses array.
    // check if the word includes the guessed letter:
    //    if it's is call checkWin()
    //    if it's not call onWrongGuess()
  }

  checkWin() {
    var remainingUnknowns = this.word.length
        this.guesses.forEach(guess => {
      if(this.word.toString().includes(guess))
      {
        remainingUnknowns -= 1
      }
    });
    this.isOver = (remainingUnknowns == 0) ? true : false
    this.didWin = (remainingUnknowns == 0) ? true : false
    // using the word and the guesses array, figure out how many remaining unknowns.
    // if zero, set both didWin, and isOver to true
  }

  /**
   * Based on the number of wrong guesses, this function would determine and call the appropriate drawing function
   * drawHead, drawBody, drawRightArm, drawLeftArm, drawRightLeg, or drawLeftLeg.
   * if the number wrong guesses is 6, then also set isOver to true and didWin to false.
   */
  onWrongGuess() { 
    var lettersInWord = this.word.split('')
    var wrongGuesses = 0
    this.guesses.forEach(guess => {
      var included = false
      lettersInWord.forEach(letter => {
        letter == guess ? included=true : ''
      });
      if(included==false)
      {
        wrongGuesses++
      }
    });
    switch(wrongGuesses) {
      case 1:
        this.drawHead()
        break;
      case 2:
        this.drawBody()
        break;
      case 3:
        this.drawRightArm()
        break;
      case 4:
        this.drawLeftArm()
        break;
      case 5:
        this.drawRightLeg()
        break;
      case 6:
        this.drawLeftLeg()
        this.isOver=true
        this.didWin=false
        break;  
    } 

  }

  /**
   * This function will return a string of the word placeholder
   * It will have underscores in the correct number and places of the unguessed letters.
   * i.e.: if the word is BOOK, and the letter O has been guessed, this would return _ O O _
   */
  getWordHolderText() {
    var lettersInWord = this.word.split('')
    var placeholder = ''
    lettersInWord.forEach(letter => {
      this.guesses.includes(letter) ? placeholder += (letter+' ') : placeholder += '_ '
    });
    return placeholder;
  }

  /**
   * This function returns a string of all the previous guesses, seperated by a comma
   * This would return something that looks like
   * (Guesses: A, B, C)
   * Hint: use the Array.prototype.join method.
   */
  getGuessesText() {
    var text = this.guesses.join(", ");
    return "Previous Guesses: "+text
  }

  /**
   * Clears the canvas
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws the hangman base
   */
  drawBase() {
    this.ctx.fillRect(95, 10, 150, 10); // Top
    this.ctx.fillRect(245, 10, 10, 50); // Noose
    this.ctx.fillRect(95, 10, 10, 400); // Main beam
    this.ctx.fillRect(10, 410, 175, 10); // Base
  }

  drawHead() { 
    this.ctx.beginPath()
    this.ctx.arc(250, 110, 50, 0, 2 * Math.PI);
    this.ctx.stroke()
  }

  drawBody() {
    this.ctx.beginPath();
    this.ctx.moveTo(250, 160);
    this.ctx.lineTo(250, 300);
    this.ctx.stroke(); 
  }

  drawLeftArm() { 
    this.ctx.beginPath();
    this.ctx.moveTo(250, 225);
    this.ctx.lineTo(175, 150);
    this.ctx.stroke(); 
  }

  drawRightArm() { 
    this.ctx.beginPath();
    this.ctx.moveTo(250, 225);
    this.ctx.lineTo(325, 150);
    this.ctx.stroke(); 
  }

  drawLeftLeg() { 
    this.ctx.beginPath();
    this.ctx.moveTo(250, 300);
    this.ctx.lineTo(175, 375);
    this.ctx.stroke(); 
  }

  drawRightLeg() { 
    this.ctx.beginPath();
    this.ctx.moveTo(250, 300);
    this.ctx.lineTo(325, 375);
    this.ctx.stroke(); 
  }
}
