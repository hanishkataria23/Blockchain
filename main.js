const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transactions, previousHash){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.CalculateHash();
        this.nonce = 0
    }

    CalculateHash(){
        return SHA256(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce).toString();
    }

    MineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.CalculateHash();
        }
        console.log('Block mined: ' + this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.CreateGenesisBlock()];
        this.pendingTransactions = [];
        this.difficulty = 2;
        this.minerReward = 100;
    }

    CreateGenesisBlock(){
        return new Block(Date.now(), 'Genesis Block', '0');
    }

    GetLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    CreateTransaction(transaction){
            this.pendingTransactions.push(transaction);
    }

    MinePendingTransaction(minerAddress){
       let newBlock = new Block(Date.now(), this.pendingTransactions, this.GetLatestBlock().hash); 
       newBlock.MineBlock(this.difficulty);
       this.chain.push(newBlock);

       this.pendingTransactions = [new Transaction(null, minerAddress, this.minerReward)];
    }

    GetBalanceofAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions)
            {
                if(trans.fromAddress == address)
                {
                    balance =- trans.amount;
                }
                if(trans.toAddress == address)
                {
                    balance =+ trans.amount;
                }
            }
        }
        return balance;
    }

    IsChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if((currentBlock.hash !== currentBlock.CalculateHash()) || (previousBlock.hash !== currentBlock.previousHash)){
                return false;
            }
        }
        return true;
    }
}


let HanishNewCoin = new Blockchain();

HanishNewCoin.CreateTransaction(new Transaction('Hanish1', 'Hanish2', '50'));
HanishNewCoin.MinePendingTransaction('Jadmeet');
HanishNewCoin.GetBalanceofAddress('Hanish2');
console.log("Balance is " + HanishNewCoin.GetBalanceofAddress('Hanish2'));

//HanishNewCoin.AddBlock(new Block(Date.now(), 'abc'));
//console.log(HanishNewCoin, 4, null);