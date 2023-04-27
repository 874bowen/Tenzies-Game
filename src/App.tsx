import { useEffect, useState } from "react";
import "./App.css";
import Die from "./assets/components/Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

type Die = {
	id: string;
	value: number;
	isHeld: boolean;
};

const allNewDice = (): Die[] => {
	const newDice: Die[] = [];

	for (let i = 0; i < 10; i++) {
		newDice.push(generateNewDie());
	}
	return newDice;
};

const generateNewDie = (): Die => {
	const val: number = Math.ceil(Math.random() * 6);
	return { id: nanoid(), value: val, isHeld: false };
};
function App() {
	const [dice, setDice] = useState(allNewDice());
	const [tenzies, setTenzies] = useState(false);

	useEffect(() => {
		console.log("Dice state changed!");
		const allHeld: any = dice.every((die) => {
			return die.isHeld === true;
		});
		const firstValue = dice[0].value;
		const allSameValue: any = dice.every((die) => {
			return die.value === firstValue;
		});
		if (allHeld && allSameValue) {
			setTenzies(true);
			console.log(tenzies);
			console.log("You won");
		}
	}, [dice]);

	function holdDice(id: string): void {
		setDice((oldDice): Die[] => {
			return oldDice.map((die) => {
				return die.id == id ? { ...die, isHeld: !die.isHeld } : die;
			});
		});
	}

	const diceElements = dice.map((die: Die) => {
		return (
			<Die
				key={die.id}
				number={die.value}
				isHeld={die.isHeld}
				holdDice={() => holdDice(die.id)}
			/>
		);
	});

	function rollDice() {
		if (tenzies) {
			setDice(allNewDice());
			setTenzies(false)
		}
		setDice((oldDice): Die[] => {
			return oldDice.map((die) => {
				return die.isHeld ? die : generateNewDie();
			});
		});
	}

	return (
		<section className="wrapper-section">
			{tenzies && <Confetti />}
			<h1>Tenzies</h1>
			<p className="instructions center">
				Roll until all dice are the same.
				<br /> Click each die to freeze it at its current value between rolls.
			</p>
			<div className="game-div">{diceElements}</div>
			<button onClick={rollDice} >{tenzies ? "New Game": "Roll"}</button>
		</section>
	);
}

export default App;
