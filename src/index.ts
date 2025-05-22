import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const myQueue = new Queue('foo');

const connection = new IORedis({ maxRetriesPerRequest: null });
const myWorker = new Worker('foo', async job => console.log(job.data), { connection });

myWorker.on('completed', job => {
  console.log(`${job.id} has completed!`);
});

myWorker.on('failed', (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

myQueue.add('job1', {name: "job1"});
myQueue.add('job2', {name: "job2"});

