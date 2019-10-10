// BEFORE RUNNING:
// ---------------
// 1. If not already done, enable the Google Sheets API
//    and check the quota for your project at
//    https://console.developers.google.com/apis/api/sheets
// 2. Install the Node.js client library by running
//    `npm install googleapis --save`

// If modifying these scopes, delete token.json.

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

const fs = require('fs')
const readline = require('readline')
const { google } = require('googleapis')

const CREDENTIALS_PATH = `${__dirname}/credentials/credentials.json`
const TOKEN_PATH = `${__dirname}/credentials/token.json`
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

readCredentials(CREDENTIALS_PATH)
  .then(credentials => {
    const { client_secret, client_id, redirect_uris } = credentials.installed
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

    getNewToken(TOKEN_PATH, oAuth2Client)
  })
  .catch(error => {
    console.error(error)
  })

function readCredentials(credentialPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(credentialPath, (error, content) => {
      if (error) reject(error)

      resolve(JSON.parse(content))
    })
  })
}

function askQuestion(tokenPath, oAuth2Client) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.question('Enter the code from that page here: ', (code) => {
      rl.close()

      oAuth2Client.getToken(code, (error, token) => {
        if (error) reject(error)

        // Store the token to disk for later program executions
        writeToken(tokenPath, JSON.stringify(token))
          .then((token) => resolve(token))
          .catch((error) => reject(error))
      })
    })
  })
}

function getNewToken(tokenPath, oAuth2Client) {
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    })

    console.log('Authorize this app by visiting this url:', authUrl)

    askQuestion(tokenPath, oAuth2Client)
      .then((token) => resolve(token))
      .catch((error) => reject(error))
  })
}

function writeToken(tokenPath, stringifiedToken) {
  return new Promise((resolve, reject) => {
    fs.writeFile(tokenPath, stringifiedToken, (error) => {
      if (error) reject(error)

      console.log('Token stored to', tokenPath)
      console.log('Make sure to add your token to .env and set it to "GOOGLE_SHEET_TOKEN"')
    })
  })
}
