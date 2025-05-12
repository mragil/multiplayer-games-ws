import { z } from 'zod';
import type { Pick } from './type';

export const gamePickSchema = z.custom<Pick>();
