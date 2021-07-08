const connectionString = process.env.CONNECTION_STRING
const { BlobServiceClient } = require("@azure/storage-blob");
const fetch = require('node-fetch');

module.exports = async function (context, myTimer) {
    
    const resp = await fetch("https://cataas.com/cat")
    let data = await resp.arrayBuffer();
    let name = await getName();

    context.log(data)
    let funcRes = await uploadFile(data, "png", name)

    context.log(funcRes)
};

async function uploadFile(binaryData, ext, filename) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerName = "cats";
    const containerClient = blobServiceClient.getContainerClient(containerName);    // Get a reference to a container
    const blobName = `${filename}.${ext}`;    // Create the container
    const blockBlobClient = containerClient.getBlockBlobClient(blobName); // Get a block blob client
    const uploadBlobResponse = await blockBlobClient.upload(binaryData, binaryData.byteLength);
    return uploadBlobResponse
}

async function getName() {
    let respName = await fetch("https://random-word-api.herokuapp.com/all")
        .then(data => data.json())
        .then(names => {
            let length = names.length;
            console.log(Math.floor(Math.random() * length))
            return names[Math.floor(Math.random() * length)]
        })
    return respName;
}