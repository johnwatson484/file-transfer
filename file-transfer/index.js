const storage = require('./storage')
const retry = require('./retry')

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.')
  const { sourceFile, sourceContainer, targetContainer, targetFolder } = req.body

  if (!sourceFile) {
    context.res = {
      body: 'Source file not provided, no action taken'
    }
  } else {
    storage.connect(process.env.BATCH_STORAGE, sourceContainer, targetContainer)
    await retry(() => storage.transferFile(decodeURI(sourceFile), targetFolder))

    context.res = {
      body: `Successfully transferred ${sourceFile}`
    }
  }
}
