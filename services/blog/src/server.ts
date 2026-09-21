import express from 'express';
import dotenv from 'dotenv'
const app = express();
import blogRoutes from './routes/blog.js'
import {createClient} from 'redis'
import { startCacheConsumer } from './utils/consumer.js';
import cors from "cors"
dotenv.config();

app.use(express.json());

app.use(cors());

await startCacheConsumer();


export const redisClient = createClient({
    url:process.env.REDIS_URL,
    socket: {
    host: "improved-buzzard-8214.upstash.io", // extract from your URL
    tls: true,
  },
});

redisClient.connect().then(()=>{
    console.log("connected to redis")
}).catch(console.error);

app.use("/api/v1",blogRoutes);
const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log("This is to test github-jenkins webhook and gitSCM trigger")
    console.log(`Listening on port ${PORT}`);
})
