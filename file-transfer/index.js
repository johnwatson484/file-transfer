const storage = require('./storage')

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.')
  const sourceFile = (req.query.sourceFile || (req.body && req.body.sourceFile))

  if (!sourceFile) {
    context.res = {
      body: 'Source file not provided, no action taken'
    }
  } else {
    storage.connect(process.env.BATCH_STORAGE)
    await storage.transferFile(decodeURI(sourceFile))

    context.res = {
      body: `Successfully transferred ${sourceFile}`
    }
  }
}
