import Image from 'next/image';
import Link from 'next/link';

const gamesData = [
	{
		id: 'rock-paper-scissor',
		name: 'Rock Paper Scissor',
		description: 'Classic rock paper scissor game that we all know and love',
		image: '/rock-paper-scissor.webp',
		altImage: 'Rock paper scissor game picture',
		link: '/rock-paper-scissor',
	},
	{
		id: 'number-guesser',
		name: 'Number Guesser',
		description:
			'Guess a number between 1 - 100 with each turn the number will get smaller!',
		image: '/question-mark.png',
		altImage: 'Question mark picture',
		link: '/number-guesser',
	},
];

export default function Home() {
	return (
		<div className=" h-dvh flex flex-col items-center justify-center">
			<h1>Welcome to Multiplayer Games</h1>
			<p>Choose a game to play</p>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
				{gamesData.map((game) => (
					<div
						className="border-1 rounded-2xl flex flex-col justify-end items-center"
						key={game.id}
					>
						<Image
							src={game.image}
							alt={game.altImage}
							width={250}
							height={250}
						/>
						<p className="mt-5">{game.name}</p>
						<Link className="mt-5" href={game.link}>
							Play
						</Link>
					</div>
				))}
			</div>
		</div>
	);
}
