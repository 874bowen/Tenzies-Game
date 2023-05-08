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
	const [isStarted, setIsStarted] = useState(false);
	const [elapsedTime, setElapsedTime] = useState<number>(0);

	const [rolls, setRolls] = useState(0);

	const [count, setCount] = useState<number>(0);

	const [bestScore, setBestScore] = useState<any>(
		localStorage.getItem("bestScore") ? localStorage.getItem("bestScore") : null
	);

	useEffect(() => {
		let intervalId: number;
		if (isStarted) {
			intervalId = setInterval(() => {
				setCount((count) => count + 1);
			}, 1000);
		}
		return () => clearInterval(intervalId);
	}, [isStarted]);

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
			setElapsedTime(count);
			setTenzies(true);
			console.log(tenzies);
			console.log("You won");
			if (bestScore === "null") {
				console.log("this is ", bestScore);
				localStorage.setItem("bestScore", JSON.stringify({bestTime: elapsedTime, bestRolls: rolls}))
				setBestScore(JSON.stringify({bestTime: elapsedTime, bestRolls: rolls}))
			} else if (bestScore) {
				console.log(bestScore);
				const {bestTime, bestRolls} = JSON.parse(bestScore)
				const  result = {
					bestTime: count < bestTime && bestTime !== 0 ? count : bestTime,
					bestRolls: rolls < bestRolls ? rolls : bestRolls
				}
				localStorage.setItem("bestScore", JSON.stringify(result))
				setBestScore(JSON.stringify(result))
			} else {
				console.log(bestScore);
				localStorage.setItem("bestScore", JSON.stringify({bestTime: elapsedTime, bestRolls: rolls}))
			}
		}
		
	}, [dice]);

	function holdDice(id: string): void {
		setIsStarted(true);
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
			setTenzies(false);
			setRolls(-1);
			setIsStarted(false);
			setCount(0);
			setElapsedTime(0);
			setDice(allNewDice());
		}
		setIsStarted(true);
		setRolls((prevRolls) => prevRolls + 1);
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
			{bestScore && <h5 style={{color: "green"}}>Best Rolls: {JSON.parse(bestScore).bestRolls}, Best Time: {JSON.parse(bestScore).bestTime}</h5>}
			<h4>
				Rolls: {rolls} Time: {elapsedTime > 0 ? elapsedTime : count}
			</h4>
			<p className="instructions center">
				Roll until all dice are the same.
				<br /> Click each die to freeze it at its current value between rolls.
			</p>
			<div className="game-div">{diceElements}</div>
			<button onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
		</section>
	);
}

export default App;
