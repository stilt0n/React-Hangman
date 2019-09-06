import React, { Component } from "react";
import { randomWord } from './words';
import "./Hangman.css";
import img0 from "./0.jpg";
import img1 from "./1.jpg";
import img2 from "./2.jpg";
import img3 from "./3.jpg";
import img4 from "./4.jpg";
import img5 from "./5.jpg";
import img6 from "./6.jpg";

class Hangman extends Component {

  static defaultProps = {
    maxWrong: 6,
    images: [img0, img1, img2, img3, img4, img5, img6]
  };

  constructor(props) {
    super(props);
    this.state = { nWrong: 0, guessed: new Set(), answer: randomWord(), won: false, wins: 0, losses: 0};
    this.handleGuess = this.handleGuess.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }


  guessedWord() {
    return this.state.answer
      .split("")
      .map(ltr => (this.state.guessed.has(ltr) ? ltr : "_"));
  }


  checkWin(set) {
    let win = true;
    for(let l of this.state.answer) {
      if(!set.has(l)) {
        win = false;
        break;
      }
    }
    return win;
  }

  handleGuess(evt) {
    let ltr = evt.target.value;
    let guesses = new Set(ltr);
    this.state.guessed.forEach(e => guesses.add(e));
    let newWon = this.checkWin(guesses);
    this.setState(st => ({
      guessed: st.guessed.add(ltr),
      nWrong: st.nWrong + (st.answer.includes(ltr) ? 0 : 1),
      won: newWon
    }));
  }

  generateButtons() {
    return "abcdefghijklmnopqrstuvwxyz".split("").map(ltr => (
      <button
        value={ltr}
        key={ltr}
        onClick={this.handleGuess}
        disabled={this.state.guessed.has(ltr)}
      >
        {ltr}
      </button>
    ));
  }

  resetWinner() {
    this.setState(st => ({
      nWrong : 0,
      guessed : new Set(),
      answer : randomWord(),
      wins : st.wins + 1,
      won: false
    }));
  }

  resetLoser() {
    this.setState(st => ({
      nWrong : 0,
      guessed : new Set(),
      answer : randomWord(),
      losses : st.losses + 1,
      won : false
    }));
  }

  handleReset() {
    this.state.won ? this.resetWinner() : this.resetLoser()
  }

  render() {
    const { nWrong, answer, won, wins, losses } = this.state;
    const { maxWrong } = this.props;
    const altText = `${maxWrong - nWrong} guesses left`;
    return (
      <div className='Hangman'>
        { maxWrong - nWrong > 0 && !won ?
        <div>
        <div className='game'>
          <h1>Hangman</h1>
          <img src={this.props.images[nWrong]} alt={altText}/>
          <p className='Hangman-word'>{this.guessedWord()}</p>
          <p className='Hangman-guesses'>{altText}</p>
          <p className='Hangman-record'>Wins: {wins} Losses: {losses}</p>
          <p className='Hangman-btns'>{this.generateButtons()}</p>
        </div>
        <button className='reset' onClick={this.handleReset}>new word</button>
        </div>
        : won ?
        <div className='win'>
          <h1>You win</h1>
          <p>The Answer Was: {answer}</p>
          <button className='reset' onClick={this.handleReset}>new word</button>
        </div>
        :
        <div className='gameOver'>
          <h1> Game Over</h1>
          <p>The Answer Was: {answer}</p>
          <button className='reset' onClick={this.handleReset}>new word</button>
        </div>
        }
      </div>
    );
  }
}

export default Hangman;
