import React from "react";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import Confetti from 'react-confetti';

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if(allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    function allNewDice() {
        const newDice = []
        for(let i = 0; i < 10; i++) {
            newDice.push({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid()
            })
        }
        return newDice
    }

    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ?
                die :
                {
                    value: Math.ceil(Math.random() * 6),
                    isHeld: false,
                    id: nanoid()
                }
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
        }
    }

    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ?
            {...die, isHeld: !die.isHeld} :
            die
        }))
    }

    const diceElements = dice.map(die => (
        <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)}/>
    ))

    return (
        <main>
            {tenzies && <Confetti
            drawShape={ctx => {
            ctx.beginPath()
            for(let i = 0; i < 22; i++) {
                const angle = 0.35 * i
                const x = (0.2 + (1.5 * angle)) * Math.cos(angle)
                const y = (0.2 + (1.5 * angle)) * Math.sin(angle)
                ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.closePath()
  }}/>}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at it's current value between rolls.</p>
            <div className="dice-container">
            {diceElements}
            </div>
            <button className="roll-dice" onClick={rollDice}>
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}