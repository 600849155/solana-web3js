
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import fs from 'fs';
import bs58 from 'bs58';

// 创建 RPC 连接
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

// 从 JSON 文件中读取钱包信息
const walletData = fs.readFileSync('wallet.json', 'utf8');
const walletArray = JSON.parse(walletData); // 解析 JSON 数组
const secretKeyString = walletArray[0]; // 获取 Base58 编码的私钥字符串

// // 解码 Base58 私钥
const secretKey = bs58.decode(secretKeyString);

// // 使用解码的私钥创建钱包
const fromWallet = Keypair.fromSecretKey(secretKey);

// // 输出钱包信息
console.log("钱包公钥:", fromWallet.publicKey.toString());
// console.log("钱包私钥:", fromWallet.secretKey);

async function main() {

  // 创建交易
  const transaction = new Transaction();

  // 目标地址
  const toAddress = new PublicKey('Kc4GyBPhqGHtTVjN7ftqHjPvupehYGf46Ki4ABESR65');

  // 添加转账指令
  const instruction = SystemProgram.transfer({
      fromPubkey: fromWallet.publicKey,
      toPubkey: toAddress,
      lamports: 1000, 
  });
  // 1 SOL 等于 1,000,000,000 lamports
  transaction.add(instruction);
  
  // 模拟交易
  const simulateResult = await connection.simulateTransaction(transaction, [fromWallet]);
  console.log("模拟交易结果: ", simulateResult);

  // 发送交易
  const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
  console.log(`交易已发送: https://solscan.io/tx/${signature}`);
}

main();
 