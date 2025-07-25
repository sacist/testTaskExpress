import express from 'express';
import dotenv from 'dotenv';
import { router } from './routers';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/',router)

export default app;