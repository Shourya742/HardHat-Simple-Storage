// Imports
const { ethers, run, network } = require("hardhat")
require("dotenv").config()

// Async main
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying Contract ... ")
    //console.log(SimpleStorageFactory)
    const simpleStorage = await SimpleStorageFactory.deploy()
    // console.log(simpleStorage)
    await simpleStorage.deployed()
    console.log(`Deployed Contract to ${simpleStorage.address}`)
    //console.log(network.config)
    if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }
    // What happens when we deploy to our hardhat network?

    const currentValue = await simpleStorage.retrieve()
    console.log(`Current Value ${currentValue}`)
    // UPDATE THE CURRENT VALUE
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(2)
    const updateValue = await simpleStorage.retrieve()
    console.log(`Updated Value is: ${updateValue}`)
}

const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

// main
main()
    .then(() => process.exit(0))
    .catch(() => {
        console.log(error)
        process.exit(1)
    })
