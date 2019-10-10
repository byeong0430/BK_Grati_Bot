require('dotenv').config()

import { google } from 'googleapis'
import { GoogleSheetCredentials, GoogleSheetToken } from '../models/GoogleSheet/GoogleSheet'

const credentials: GoogleSheetCredentials = JSON.parse(process.env.GOOGLE_SHEET_CREDENTIALS!)

const { client_secret, client_id, redirect_uris } = credentials.installed
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

const token: GoogleSheetToken = JSON.parse(process.env.GOOGLE_SHEET_TOKEN!)

oAuth2Client.setCredentials(token)

export const sheets = google.sheets({
  version: 'v4',
  auth: oAuth2Client
})

