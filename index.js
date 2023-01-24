// in nodejs
// require()

// in front-end javascript you cant use require
//import
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"


const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund 
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw 

console.log(ethers)


async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try{
        await window.ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected!"
    } else {
        connectButton.innerHTML = "Please install metamask!"
    }
}

async function getBalance(){
    if(typeof window.ethereum != "undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(ethers.utils.formatEther(balance))
}
}
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
        const transactionResponse = await contract.fund({
            value: ethers.utils.parseEther(ethAmount)
        })
        // hey, wait for this TX to finish
        await listenForTransactionMine(transactionResponse, provider)
        console.log("Done!")
    } catch(error) {
        console.log(error)
    }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)     
    // listen for this transaction to finish
    return new Promise((resolve, reject) => {
        try {
            provider.once(transactionResponse.hash, (getTransactionReceipt) => {
            console.log(
            `Completed with ${getTransactionReceipt.confirmations} confirmations`
        )
        resolve()
    })
} catch (error) {
    reject(error)
}
    })
}


async function withdraw() {
    if(typeof window.ethereum != "undefined"){
        console.log("Withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try{
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
            }catch(error) {
            console.log(error)
        }

    }

}