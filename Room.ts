import type { ServerWebSocket } from 'bun';
import Constant from './Constant';
import NumberGuesser from './games/NumberGuesser';
import RockPaperScissor from './games/RockPaperScissor';
import type { ClientData, Game, Message, ResultMessage } from './type';

const {
	GAMES: { NUMBER_GUESSER },
	ROOM_OPERATION: { OPPONENT_LEFT },
} = Constant;

class Room {
	private members: ServerWebSocket<ClientData>[];
	private game?: NumberGuesser | RockPaperScissor;
	private genre: Game;

	constructor(ws: ServerWebSocket<ClientData>, genre: Game) {
		this.members = [ws];
		this.game = undefined;
		this.genre = genre;
	}

	public getMemberCount() {
		return this.members.length;
	}

	public getMemberName() {
		return this.members.map((ws) => ws.data.username);
	}

	public getMembers() {
		return this.members;
	}

  public getMember(identifier: number) {
    return this.members[identifier];
  }

	public getGameName() {
		return this.game?.getGameName();
	}

	public isUserInRoom(username: string) {
		const existingUsername = this.members.find(
			(member) => member.data.username === username,
		);
		return !!existingUsername;
	}

	public addMember(ws: ServerWebSocket<ClientData>) {
		this.members.push(ws);
		if (this.members.length === 2) {
			this.game =
				this.genre === NUMBER_GUESSER
					? new NumberGuesser(this)
					: new RockPaperScissor(this);
		}
	}

	public broadcastMessage(message: Message | ResultMessage) {
		for (const member of this.members) {
			member.send(JSON.stringify(message));
		}
	}

	public sendMessage(ws: ServerWebSocket<ClientData>, message: Message) {
		ws.send(JSON.stringify(message));
	}

	public handleGamePlay(ws: ServerWebSocket<ClientData>, message: Message) {
		this.game?.playerTurn(ws, message);
	}

	public handleReplay(ws: ServerWebSocket<ClientData>) {
		this.game?.handleReplay(ws);
	}

	public handleLeave(ws: ServerWebSocket<ClientData>) {
		const { username } = ws.data;
		this.members = this.members.filter((client) => client !== ws);

		if (this.members.length === 0) {
			return;
		}

		const msg: Message = {
			type: OPPONENT_LEFT,
			text: `${username} has left the room`,
		};
		this.broadcastMessage(msg);

		this.game?.handlePlayerLeave(username);
	}
}

export default Room;
