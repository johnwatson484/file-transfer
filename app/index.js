const storage = require('./storage')

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.')
  const sourceFile = (req.query.sourceFile || (req.body && req.body.sourceFile))

  if (!sourceFile) {
    context.res = {
      body: 'Source file not provided, no action taken'
    }
  }

  storage.connect(process.env.BATCH_STORAGE)
  storage.transferFile(sourceFile)

  context.res = {
    body: `Successfully transferred ${sourceFile}`
  }
}
