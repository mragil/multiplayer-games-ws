import type { ServerWebSocket } from 'bun';
import type Room from './Room';
import Constant from './Constant';

const { ROOM_OPERATION } = Constant;

interface ClientData {
	username: string;
	room: string;
	genre: Genre;
}

type Pick = 'Rock' | 'Paper' | 'Scissor';

interface GameRPS {
	[key: string]: Pick;
}

interface NGList {
	[key: string]: number[];
}

interface GameNG {
	player: NGList;
	targetNumber: number;
}

interface Score {
	[key: string]: number;
}

interface Result {
	score: Score;
	game?: GameRPS | GameNG;
}

interface Rooms {
	[key: string | number]: Room;
}

type Message = {
	type: typeof ROOM_OPERATION[keyof typeof ROOM_OPERATION];
	text: string | Buffer;
};

type ResultMessage = {
	type: 'RESULT';
	text: string | Buffer;
	data: Result;
};

type Game = 'ROCK_PAPER_SCISSOR' | 'NUMBER_GUESSER';

export type {
	ClientData,
	GameNG,
	GameRPS,
	Game,
	Message,
	Pick,
	ResultMessage,
	Rooms,
	Score,
	ServerWebSocket,
	NGList
};
