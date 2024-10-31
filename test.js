const { getToken }= require("./scripts/interactions/interact.zeroToken");  

async function main() {
    getToken();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});