//Declare constants
const SHA256 = require('crypto-js/sha256')
const LEVEL = require('level')
const CHAINDB = './chaindata'
const DBASE = LEVEL(CHAINDB)

// import block class
const Block = require('./Block')

//Create the blockchain class
class Blockchain {
  constructor () {
    //Maintain the first block
    this.getHeight().then((size) => {
      if (size === -1) this.add(new Block('First block')).then(() => console.log('First block stored!'))
    })
  }

   // Add a new block to the database
  //Use promise variable to detect success or failure
  function addDBData (key, value) {
    return new Promise((resolve, reject) => {
      DBASE.put(key, value, (err) => {
        if (err) {
          console.log('Failed to add ' + key + ' to the blockchain', err)
          reject(err)
        }
        else {
          console.log('Block number: ' + key + ' stored successfuly')
          resolve(value)
        }
      })
    })
  }

    
      // Add new block and store it in database
  async add (toAdd) {
      //Get the previous height to know where to add the next block
    var prev = parseInt(await this.getHeight())
    //Index of the block that is to be added
    toAdd.height = prev + 1
    // Get timestamp
    toAdd.time = new Date().getTime().toString().slice(0, -3)

      //Setup link to the next block from the previous block
      if (toAdd.height > 0) {
      var previousBlock = await this.getBlock(prev)
      toAdd.previousBlockHash = previousBlock.hash
    }
      var stringified = JSON.stringify(toAdd)
    toAdd.hash = SHA256(stringified).toString()

    await this.addDBData(toAdd.height, JSON.stringify(toAdd))
  }
    
  // Get data from DB with key
  //Use promise variable to detect success or failure
  function getDBData (key) {
    return new Promise((resolve, reject) => {
      DBASE.get(key, (err, value) => {
        if (err) {
          console.log('Cannot resolve the value!', err)
          reject(err)
        } else {
          resolve(value)
        }
      })
    })
  }  

  // Get block height of the block chain
  function getHeight () {
      //Promise object to determine whether the height was successfully determined or an error occurred
    return new Promise((resolve, reject) => {
      var height = -1
      DBASE.createReadStream().on('data', (data) => {
        height++
      }).on('error', (err) => {
        console.log('There was an error reading the data!', err)
        reject(err)
      }).on('close', () => {
        resolve(height)
      })
    })
  }

  // get the block at the identified index
  async getBlock (index) {
    // return Block as a JSON object
    return JSON.parse(await this.getDBData(index))
  }

  // Check whether the block at the given index is valid
  async validateBlock (index) {
    // get block object
    var block = await this.getBlock(index)
    var currentHash = block.hash
    block.hash = ''

    // generate block hash
    var stringified = JSON.stringify(block)
    var validHash = SHA256(stringified).toString()

    if (currentHash === validHash) {
      return true
    }
      console.log("Block at index: "+i+" is not valid")
      return false
    
  }

  // Go through the entire blockchain checking each block for validity
  async validateChain () {
      //array to hold the indexes of invalid objects
    var invalids = []
    //Get number of items in the blockchain
    var size = await this.getHeight()

    for (var i = 0; i < size; i++) {

      // Check block at the provided index for validity
      // if invalid store the index in the invalids array
      if (!this.validateBlock(i)) invalids.push(i)

      // compare the hash link of the two blocks if the hashlink is invalid add the block index to the invalids list
      var blockHash = this.getBlock(i).hash
      var previousHash = this.getBlock(i + 1).previousBlockHash
      if (blockHash !== previousHash) {
        invalids.push(i)
      }

    }

      //Print out the invalid indexes if any exist
    if (invalids.length > 0) {
      console.log('Found '+ invalids.length+' errors')
      console.log('The following block indexes have errors: ' + invalids)
    } else {
      console.log('All the blocks are valid')
    }
  }
}


var blockchain = new Blockchain();

//Add 10 blocks to the block chain and test to see if there was an error
for(var i = 0; i < 10; i++){
    setTimeout(() => {
    blockchain.add(new Block(`Block Number ${i}`))
  }, 100)
}

blockchain.validateChain()