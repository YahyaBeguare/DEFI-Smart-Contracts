import fs from "fs";
import FormData from "form-data";
import rfs from "recursive-fs";
import basePathConverter from "base-path-converter";
import got from "got";
import dotenv from "dotenv";

dotenv.config();

const PINATA_JWT = process.env.PINATA_JWT;
const PinataGateway = process.env.GATEWAY_URL;

export const pinDirectoryToPinata = async (folderPath) => {
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
    const folderLength = files.length;
    console.log(`Number of files in the folder: ${folderLength}`);


    const response = await got(url, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${PINATA_JWT}`,
      },
      body: data,
    }).on('uploadProgress', progress => {
      console.log(progress);
    });

    console.log(JSON.parse(response.body));
    return {
      ipfsHash: JSON.parse(response.body).IpfsHash,
      folderLength: folderLength
    };
  } catch (error) {
    console.log(error);
  }
};