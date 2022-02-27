module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.')

  const sourceFile = (req.query.sourceFile || (req.body && req.body.sourceFile))
  const responseMessage = sourceFile
    ? `Successfully transferred ${sourceFile}`
    : 'No file provided'

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage
  }
}
