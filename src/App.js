// CSS
import './App.css';

// React
import { useCallback, useState, useEffect } from 'react';

// Data
import { wordslist } from './data/words';

// Componentes
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import End from './components/End';

const stages = [
  {id: 1, name:'start'},
  {id: 2, name:'game'},
  {id: 3, name:'end'},
]

 const guessesQty = 3

function App() {
const [gameStage, setGameStage] = useState(stages[0].name);

const [words] = useState(wordslist);

const [pickedWord, setPickedWord] = useState("");
const [pickedCategory, setPickedCategory] = useState("");
const [letters, setLetters] = useState([]);

const [guessedLetters, setGuessedLetters] = useState([]);
const [wrongLetters, setWrongLetters] = useState([]);
const [guesses, setGuesses] = useState(guessesQty);
const [score, setScore] = useState(0);


const pickWordAndCategory = useCallback(() => {
  const categories = Object.keys(words);

  const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];
  console.log(category);

  const word = words[category][Math.floor(Math.random() * words[category].length)] ;
  console.log(word);

  return {word, category};
}, [words]);

// Start the secrets word game
const startGame = useCallback(() => {
  //clear all letters
clearLetterStates();

// Pick word and pick category
const {word, category} = pickWordAndCategory();
let wordLetters = word.split("");
wordLetters = wordLetters.map((l) => l.toLowerCase());

console.log(word, category);
console.log(wordLetters);

setPickedWord(word);
setPickedCategory(category);
setLetters(wordLetters);

setGameStage(stages[1].name);
}, [pickWordAndCategory]);

// Process the letters input
const verifyLetter = (letter) => {
  const normalizedLetter = letter.toLowerCase();

  if (
    guessedLetters.includes(normalizedLetter) || 
    wrongLetters.includes(normalizedLetter)
  ) {
    return;
  }

  if (letters.includes(normalizedLetter)) {
    setGuessedLetters((actualGuessedLetters) => [
      ...actualGuessedLetters,
      normalizedLetter
    ])
  } else {
    setWrongLetters((actualWrongLetters) => [
      ...actualWrongLetters,
      normalizedLetter
    ]);
    setGuesses((actualGuesses) => actualGuesses - 1);

  }
};

const clearLetterStates = (state) => {
  setGuessedLetters([]);
  setWrongLetters([]);
};

//check if guesses end
useEffect(() => {
if (guesses <= 0) {
  // Reset all states
  clearLetterStates();

  setGameStage(stages[2].name);
}
}, [guesses]);

//check win condition
useEffect(() => {
  const uniqueLetters = [...new Set(letters)];

  //win condition
  if(guessedLetters.length === uniqueLetters.length) {
    //add score
    setScore((actualScore) => actualScore += 100)

    //restart game with new word
  startGame();
  }
}, [guessedLetters, letters, startGame]);

// Retry the game
const retry = () => {
  setScore(0);
  setGuesses(guessesQty);

  setGameStage(stages[0].name)
};

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' && <Game verifyLetter={verifyLetter} 
      pickedWord={pickedWord} 
      pickedCategory={pickedCategory} 
      letters={letters} 
      guessedLetters={guessedLetters} 
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score} />}
      {gameStage === 'end' && <End retry={retry} score={score}/>}
    </div>
  );
}

export default App;
