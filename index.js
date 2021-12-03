const { Pool, poolList } = require("@tracer-protocol/pools-js");
const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(
    "https://arb1.arbitrum.io/rpc"
);

(async () => {
    // get the address for each pool from the data lookup
    let addresses = poolList["42161"].map((pool) => {
        return pool.address;
    });

    // create a pool object for each pool using the pools-js SDK
    let promises = addresses.map((address) => {
        return Pool.Create({
            address: address,
            provider,
        });
    });

    // wait for all pools to be initialised
    const pools = await Promise.all(promises);

    // get info about each pool if it were to be updated at the current price
    pools.forEach((pool) => {
        let nextState = pool.getNextPoolState()
        // log the pool name and state
        console.log(pool.name)
        console.log(`Long Balance: ${nextState.expectedLongBalance}`)
        console.log(`Short Balance: ${nextState.expectedShortBalance}`)
        console.log(`Skew: ${nextState.expectedSkew}\n`)
    })
})();
