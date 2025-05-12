import type { ClientData, Message } from './type';

import Constant from './Constant';
import Playground from './Playground';

const { GAME_URL_MAP } = Constant;

const getDataFromQuery = (req: Request, key: string) => {
	return new URL(req.url).searchParams.get(key);
};

const PlaygroundNG = new Playground();

const server = Bun.serve<ClientData, null>({
	fetch(req, server) {
		const url = new URL(req.url);
		if (url.pathname === '/')
			return Response.json({
				hai: 'Hello',
			});
		if (
			url.pathname === '/number-guesser' ||
			url.pathname === '/rock-paper-scissor'
		) {
			const genre = GAME_URL_MAP[url.pathname];
			const username = getDataFromQuery(req, 'userName');
			const room = getDataFromQuery(req, 'roomName');

			if (
				room === null ||
				username === null ||
				room === '' ||
				username === ''
			) {
				return new Response('Room Name or User Name Cannot Be Empty');
			}

			const existingRoom = PlaygroundNG.getRoom(room);
			if (existingRoom) {
				if (
					existingRoom.getMemberCount() ===
					(Bun.env.ROOM_LIMIT as unknown as number)
				) {
					return new Response(`Sudah LIMIT 2 ORANG DI ROOM ${room}`, {
						status: 400,
					});
				}

				const isUsernameExist = existingRoom.isUserInRoom(username);

				if (isUsernameExist) {
					return new Response(
						`Username: ${username} already exist in the room`,
						{ status: 400 },
					);
				}
			}

			const success = server.upgrade(req, { data: { username, room, genre } });
			return success
				? undefined
				: new Response('WebSocket upgrade error', { status: 400 });
		}

		if (url.pathname === '/list') {
			return Response.json(PlaygroundNG.getRooms());
		}

		return new Response('Hello world');
	},
	port: Bun.env.PORT,
	websocket: {
		open(ws) {			
			const { room, username, genre } = ws.data;
			console.log('WS OPEN', { room, username });
			const existingRoom = PlaygroundNG.getRoom(room);

			if (!existingRoom) {
				PlaygroundNG.initializeRoom(room, ws, genre);
			} else {
				existingRoom.addMember(ws);
			}
		},
		message(ws, message) {
			const { room, username } = ws.data;
			console.log('MESSAGE', { room, username, message });

			const parsedMessage: Message = JSON.parse(message.toString());
			const existingRoom = PlaygroundNG.getRoom(room);
			if (!existingRoom) {
				console.error('ERROR NO ROOM');
				return;
			}

			switch (parsedMessage.type) {
				case 'PLAYER_TURN': {
					existingRoom.handleGamePlay(ws, parsedMessage);
					break;
				}
				case 'RESET': {
					existingRoom.handleLeave(ws);
					break;
				}
				case 'REPLAY': {
					existingRoom.handleReplay(ws);
					break;
				}
				default: {
					console.error('NOTHING MASE');
				}
			}
		},
		close(ws) {
			const { room, username } = ws.data;
			console.log('CLOSE', { room, username });

			const existingRoom = PlaygroundNG.getRoom(room);
			if (!existingRoom) {
				console.error('ERROR NO ROOM');
				return;
			}
			existingRoom.handleLeave(ws);

			if (existingRoom.getMemberCount() === 0) {
				PlaygroundNG.deleteRoom(room);
			}
		},
	},
});

console.log(`Listening on ${server.hostname}:${server.port}`);
