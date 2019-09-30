const { getTimestamp } = require('./utilities');

// Class for a single block within the blockchain
class Block {
	constructor(data) {
		this.hash = '';
		this.height = 0;
		this.body = data;
    this.time = getTimestamp();
    this.previousBlockHash = '';
	}
}


module.exports = Block;
