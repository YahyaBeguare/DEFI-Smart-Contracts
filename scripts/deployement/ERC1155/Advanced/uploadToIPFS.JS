const fs = require("fs");
const FormData = require( "form-data");
const rfs = require("recursive-fs");
const basePathConverter = require("base-path-converter");
const got = require("got");


const PINATA_JWT = process.env.PINATA_JWT;
const PinataGateway= process.env.GATEWAY_URL ;ç
const folderPath = "../../../../ressources/ERC1155/Advanced/TokensPictures";


const pinDirectoryToPinata = async () => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const src = folderPath;
  var status = 0;
  try {

    const { dirs, files } = await rfs.read(src);

    let data = new FormData();

    for (const file of files) {
      data.append(`file`, fs.createReadStream(file), {
        filepath: basePathConverter(src, file),
      });
    }

    const response = await got(url, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${PINATA_JWT}`,
      },
      body: data
  })
		.on('uploadProgress', progress => {
			console.log(progress);
		});

	console.log(JSON.parse(response.body));
  } catch (error) {
    console.log(error);
  }
};

pinDirectoryToPinata()





// // Example usage: Upload the folder './metadata'
// uploadFolderToPinata(path.resolve(__dirname, ''))
//   .then((cid) => {
//     // Use a public gateway to construct the base URI. The {id} placeholder is kept for client-side substitution.
//     const baseURI = `https://gateway.pinata.cloud/ipfs/${cid}/{id}.json`;
//     console.log('Use this base URI in your ERC1155 contract:', baseURI);
//   })
//   .catch(console.error);
