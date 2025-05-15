import { z } from 'zod';
import { createEnv } from '@t3-oss/env-core';

export const env = createEnv({
	client: {
		NEXT_PUBLIC_WS_HOST: z.string(),
	},
	clientPrefix: 'NEXT_PUBLIC',
	runtimeEnv: {
		NEXT_PUBLIC_WS_HOST: process.env.NEXT_PUBLIC_WS_HOST,
	},
});
