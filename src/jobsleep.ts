export class JobSleep {

	constructor(timeSleep, isLock) {
		this.timeSleep = timeSleep;
		this.isLock = isLock;
	}

	getSleepPromisse() {
  		return new Promise(resolve => {
			let c = 0;
			while(this.isLock) c++;
			setTimeout(resolve, this.timeSleep);
		});
	}
}

export default JobSleep;
