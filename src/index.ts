import { Queue, Worker, Job } from 'bullmq';
import type WorkerOptions from 'bullmq';
import IORedis from 'ioredis';
import JobSleep from './jobsleep.ts';

const myQueue = new Queue('foo');

const optWorker: WorkerOptions = {
  connection: new IORedis({ maxRetriesPerRequest: null }),
  lockDuration: 1000,
  stalledInterval: 1000,
  runRetryDelay: 1000,
  lockRenewTime: 1000 * 30,
  maxStalledCount: 2,
}

const functionWorker = async (job: Job) => { 
  const data = job.data;
  console.log(data)
  switch(data.type) {
    case "log": console.log(data); break;
    case "sleep": await new JobSleep(data.time, false).getSleepPromisse().then(_ => "success"); break;
    case "lock": await new JobSleep(1000, true).getSleepPromisse().then(_ => "success"); break;
  }
}

const myWorker = new Worker('foo', functionWorker, optWorker);

myWorker.on('completed', (job: Job) => {
  console.log(`${job.id} has completed!`);
});

myWorker.on('stalled', jobId => {
  console.log(`${jobId} has stalled!`);
});

myWorker.on('failed', (job: Job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

myQueue.add('job1', {type: "log", name: "job1"});
myQueue.add('job2', {type: "log", name: "job2"});
myQueue.add('job3', {type: "sleep", time: 1000 * 10});
// myQueue.add('job4', {type: "lock"});

