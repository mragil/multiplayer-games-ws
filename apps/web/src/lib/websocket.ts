'use client';

import { env } from '@/config/env';

export const initializeWebsocket = (name: string, room: string) => {
	const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
	const game = window.location.pathname;

	const client = new WebSocket(
		`${protocol}://${env.NEXT_PUBLIC_WS_HOST}${game}?userName=${name}&roomName=${room}`,
	);

	return client;
};
