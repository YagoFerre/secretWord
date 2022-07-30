import './End.css';

const End = ({ retry, score }) => {
  return (
    <div>
        <h1>Acabou, mais sorte da próxima!</h1>
        <h2>A sua pontuação foi: <span>{score}</span> </h2>
        <button onClick={retry}>Resetar jogo</button>
    </div>
  )
}

export default End