const { PinataSDK } = require("pinata-web3")
const fs = require("fs")
const { Blob } = require("buffer")
require("dotenv").config()
const PinataJwt= process.env.PINATA_JWT ;
const PinataGateway= process.env.GATEWAY_URL ;

const pinata = new PinataSDK({
  pinataJwt: PinataJwt,
  pinataGateway: PinataGateway
})

async function upload(_filePath){
  try {
    const blob = new Blob([fs.readFileSync(_filePath)]);
    const upload = await pinata.upload.file(blob);
    console.log(upload) ;
    const url= "https://"+PinataGateway+ "/ipfs/"+ upload.IpfsHash ;
    console.log("here's the CID:", url);
    return url ;
  } catch (error) {
    console.log(error)
  }
}

module.exports= {upload};
