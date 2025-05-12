import Room from './Room';
import type { ClientData, Game, Rooms, ServerWebSocket } from './type';

class Playground {
	private rooms: Rooms;

	public constructor() {
		this.rooms = {};
	}

	public initializeRoom(
		room: string,
		ws: ServerWebSocket<ClientData>,
		game: Game,
	) {
		this.rooms[room] = new Room(ws, game);
	}

	private isRoomExist(room: string) {
		return !!this.rooms[room];
	}

	public getRoom(room: string) {
		if (!this.isRoomExist(room)) {
			return null;
		}
		return this.rooms[room];
	}

	public deleteRoom(room: string) {
		delete this.rooms[room];
	}

	public getRooms() {
		const roomNames = Object.keys(this.rooms);
		const data = roomNames.map((name) => {
			return {
				name,
				isFull: this.getRoom(name)?.getMemberCount() === Bun.env.ROOM_LIMIT,
				member: this.getRoom(name)?.getMemberName(),
				game: this.getRoom(name)?.getGameName(),
			};
		});
		return data;
	}
}

export default Playground;
