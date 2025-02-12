const crypto = require('crypto');

// Block class representing a single block in the blockchain
class Block {
    constructor(index, timestamp, transactions, previousHash = '') {
        this.index = index; // Block number
        this.timestamp = timestamp; // Timestamp of block creation
        this.transactions = transactions; // List of transactions
        this.previousHash = previousHash; // Hash of the previous block
        this.nonce = 0; // Nonce for proof-of-work
        this.hash = this.calculateHash(); // Current block hash
    }

    // Function to calculate the hash of the block
    calculateHash() {
        return crypto.createHash('sha256').update(
            this.index + this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce
        ).digest('hex');
    }

    // Proof-of-work algorithm to add computational difficulty
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block mined: ${this.hash}`);
    }
}

// Blockchain class to manage the chain of blocks
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]; // Initialize with the genesis block
        this.difficulty = 2; // Difficulty level for proof-of-work
    }

    // Create the first block (Genesis block)
    createGenesisBlock() {
        return new Block(0, "01/01/2024", "Genesis Block", "0");
    }

    // Get the latest block in the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Add a new block to the blockchain
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash; // Link to previous block
        newBlock.mineBlock(this.difficulty); // Perform proof-of-work
        this.chain.push(newBlock); // Add block to the chain
    }

    // Validate the blockchain integrity
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Check if the hash of the block is still valid
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // Check if the previous hash matches
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

// Simulating the Blockchain
let myBlockchain = new Blockchain();
console.log("Mining block 1...");
myBlockchain.addBlock(new Block(1, "02/01/2024", [{ from: "Alice", to: "Bob", amount: 100 }]));

console.log("Mining block 2...");
myBlockchain.addBlock(new Block(2, "03/01/2024", [{ from: "Bob", to: "Charlie", amount: 50 }]));

// Display the blockchain
console.log(JSON.stringify(myBlockchain, null, 4));

// Tampering and validation test
console.log("Is blockchain valid?", myBlockchain.isChainValid());

// Tamper with a block
myBlockchain.chain[1].transactions = [{ from: "Alice", to: "Eve", amount: 1000 }];
console.log("After tampering: Is blockchain valid?", myBlockchain.isChainValid());
