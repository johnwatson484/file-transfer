const { BlobServiceClient } = require('@azure/storage-blob')
let blobServiceClient
let sourceContainer
let targetContainer

const connect = (connectionStr, sourceContainerName, targetContainerName) => {
  blobServiceClient = BlobServiceClient.fromConnectionString(connectionStr)
  sourceContainer = blobServiceClient.getContainerClient(sourceContainerName)
  targetContainer = blobServiceClient.getContainerClient(targetContainerName)
}

const getBlob = async (container, filename) => {
  return container.getBlockBlobClient(filename)
}

const transferFile = async (sourceFile, targetFolder) => {
  console.log(`Transferring ${sourceFile}`)
  const sourceBlob = await getBlob(sourceContainer, sourceFile)
  const sanitizedFilename = sanitizeFilename(sourceFile)
  const targetFilename = targetFolder ? `${targetFolder}/${sanitizedFilename}` : sanitizedFilename
  console.log(`Target: ${targetFilename}`)
  const destinationBlob = await getBlob(targetContainer, targetFilename)
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
