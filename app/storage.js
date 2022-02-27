const { BlobServiceClient } = require('@azure/storage-blob')
const sourceContainerName = 'batch'
const targetContainerName = 'target'
let blobServiceClient
let sourceContainer
let targetContainer

const connect = (connectionStr) => {
  blobServiceClient = BlobServiceClient.fromConnectionString(connectionStr)
  sourceContainer = blobServiceClient.getContainerClient(sourceContainerName)
  targetContainer = blobServiceClient.getContainerClient(targetContainerName)
}

const getBlob = async (container, filename) => {
  return container.getBlockBlobClient(filename)
}

const transferFile = async (sourceFile) => {
  console.log(`Transferring ${sourceFile}`)
  const sourceBlob = await getBlob(sourceContainer, sourceFile)
  const destinationBlob = await getBlob(targetContainer, sanitizeFilename(sourceFile))
  const copyResult = await (await destinationBlob.beginCopyFromURL(sourceBlob.url)).pollUntilDone()

  if (copyResult.copyStatus === 'success') {
    await sourceBlob.delete()
    console.log(`Successfully transferred ${sourceFile}`)
  }
}

const sanitizeFilename = (filename) => {
  const fileInfo = filename.split('/')
  return fileInfo[fileInfo.length - 1]
}

module.exports = {
  connect,
  transferFile
}
