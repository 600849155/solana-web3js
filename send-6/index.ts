import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import fs from "fs";
import bs58 from 'bs58';


// 创建RPC连接
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
// const connection = new Connection("https://mainnet-ams.chainbuff.com", "confirmed");

// 从 JSON 文件中读取钱包信息
const walletData = fs.readFileSync('wallet.json', 'utf8');
const walletArray = JSON.parse(walletData); // 解析 JSON 数组
const secretKeyString = walletArray[0]; // 获取 Base58 编码的私钥字符串

// // 解码 Base58 私钥
const secretKey = bs58.decode(secretKeyString);

// // 使用解码的私钥创建钱包
const fromWallet = Keypair.fromSecretKey(secretKey);

async function main() {

  // 创建交易
  const transaction = new Transaction();

  // 目标地址
  const toAddress = new PublicKey('buffaAJKmNLao65TDTUGq8oB9HgxkfPLGqPMFQapotJ');

  // 添加转账指令
  const instruction = SystemProgram.transfer({
      fromPubkey: fromWallet.publicKey,
      toPubkey: toAddress,
      lamports: 1000, // 1000 lamports
  });
  transaction.add(instruction);

  // 模拟交易
  const simulateResult = await connection.simulateTransaction(transaction, [fromWallet]);
  console.log("模拟交易结果: ", simulateResult);

  // 发送交易
  // const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
  // console.log(`交易已发送: https://solscan.io/tx/${signature}`);

  // 发送交易
  // 1. sendAndConfirmTransaction
  const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet], { 
      skipPreflight: false 
  });
  console.log(`交易已发送: https://solscan.io/tx/${signature}`);

  // const { blockhash } = await connection.getLatestBlockhash();
  // transaction.recentBlockhash = blockhash;
  // transaction.feePayer = fromWallet.publicKey;
  // transaction.sign(fromWallet);
  // const rawTransaction = transaction.serialize();

  // 2. sendRawTransaction
  // const signature = await connection.sendRawTransaction(rawTransaction, { 
  //     skipPreflight: false 
  // })
  // console.log("交易签名：", signature)
  
  // 3. sendEncodedTransaction
  // const base64Transaction = rawTransaction.toString('base64');
  // const signature = await connection.sendEncodedTransaction(base64Transaction, { 
  //     skipPreflight: false 
  // });
  // console.log("交易签名：", signature)
  
}

main();