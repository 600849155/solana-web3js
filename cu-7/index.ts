import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction, ComputeBudgetProgram } from '@solana/web3.js';
import bs58 from 'bs58';
import fs from "fs";
import { get } from 'http';

// 创建RPC连接
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
// const connection = new Connection("https://mainnet-ams.chainbuff.com", "confirmed");

// 从 JSON 文件中读取钱包信息
const fromWallet = getWallet();

// // 输出钱包信息
console.log("钱包公钥:", fromWallet.publicKey.toString());


function getWallet() {
    const walletData = fs.readFileSync('wallet.json', 'utf8');
    const walletArray = JSON.parse(walletData); // 解析 JSON 数组
    const secretKeyString = walletArray[0]; // 获取 Base58 编码的私钥字符串


    // // 解码 Base58 私钥
    const secretKey = bs58.decode(secretKeyString);

    // // 使用解码的私钥创建钱包
    const fromWallet = Keypair.fromSecretKey(secretKey);
    return fromWallet;
}

async function main() {

    // 创建交易
    const transaction = new Transaction();

    // CU价格
    const computeUnitPriceInstruction = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 300
    });
    transaction.add(computeUnitPriceInstruction);

    // CU数量
    const computeUnitLimitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
        units: 50000,
    });
    transaction.add(computeUnitLimitInstruction);

    // 目标地址
    const toAddress = new PublicKey('Kc4GyBPhqGHtTVjN7ftqHjPvupehYGf46Ki4ABESR65');

    // 添加转账指令
    const instruction1 = SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: toAddress,
        lamports: 1000, // 1000 lamports
    });
    transaction.add(instruction1);

    // // 添加转账指令
    // const instruction2 = SystemProgram.transfer({
    //     fromPubkey: fromWallet.publicKey,
    //     toPubkey: toAddress,
    //     lamports: 1000, // 1000 lamports
    // });
    // transaction.add(instruction2);

    // 模拟交易
    const simulateResult = await connection.simulateTransaction(transaction, [fromWallet]);
    console.log("模拟交易结果: ", simulateResult);

    // 发送交易
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
    console.log(`交易已发送: https://solscan.io/tx/${signature}`);
}

main();