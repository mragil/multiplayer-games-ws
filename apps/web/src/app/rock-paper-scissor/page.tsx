'use client';

import { initializeWebsocket } from '@/lib/websocket';
import * as React from 'react';

export default function Page() {
	const [isOnline, setIsOnline] = React.useState(false);
	const [name, setName] = React.useState('');

	const connect = () => {
		const client = initializeWebsocket(name, 'gil');
		client.onopen = () => {
			if (client.OPEN) {
				setIsOnline(true);
			}
		};

		client.onclose = () => {
			if (client.CLOSED) {
				setIsOnline(false);
			}
		};

		client.onmessage = (message) => {
			console.log(message);
		}
	};
	return (
		<div>
			<h1>Rock Paper Scissor</h1>
			<p>You are {isOnline ? 'CONNECTED' : 'DISCONNECTED'}</p>
			<input
				type="text"
				name="name"
				placeholder='Enter your name'
				onChange={(e) => {
					setName(e.target.value);
				}}
			/>
			<button className='border-1 rounded-3xl p-2' onClick={connect} type="button">
				Connect
			</button>
		</div>
	);
}
