import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const myQueue = new Queue('foo');

const connection = new IORedis({ maxRetriesPerRequest: null });
const myWorker = new Worker('foo', async job => console.log(job.data), { connection });

myQueue.add('job1', {name: "job1"});
myQueue.add('job2', {name: "job2"});

