import { sheets } from '../configs/googleSheet'
import { parseError } from "../utils/helpers"
import { CreateAppendQueryParams, InsertDataOption, Dimension, CreateUpdateQueryParams } from '../models/GoogleSheet/GoogleSheet'
import { sheets_v4 } from 'googleapis'

/**
 * Google Sheet API Doc: https://developers.google.com/sheets/api/reference/rest/
 */

export const GSheetAPI = {
  createSheet: async (title: string) => {
    try {
      const res = await sheets.spreadsheets.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SHEET_SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: { title }
              }
            }
          ]
        }
      })

      console.log(`STATUS: ${res.status}, DATA: ${JSON.stringify(res.data)}`)
      return res.data
    } catch (error) {
      const parsedError = `FUNCTION: createSheet, ${parseError(error)}`
      console.log(parsedError)
    }
  },

  getSheetInfo: async (): Promise<sheets_v4.Schema$Sheet[] | undefined> => {
    try {
      const res = await sheets.spreadsheets.get({
        spreadsheetId: process.env.GOOGLE_SHEET_SPREADSHEET_ID,
        includeGridData: false,
        fields: 'sheets.properties'
      })

      return res.data.sheets
    } catch (error) {
      const parsedError = `FUNCTION: getSheetInfo, ${parseError(error)}`
      console.log(parsedError)
    }
  },

  checkSheetExists: async (title: string) => {
    const sheetInfo = await GSheetAPI.getSheetInfo()
    
    if (!sheetInfo) return false

    return sheetInfo.some((sheet) => sheet.properties?.title === title)
  },

  readSheet: async () => {
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_SPREADSHEET_ID,
        range: 'Byeong!A1:B2',
      })

      const rows = res.data.values

      if (!rows || rows && rows.length === 0) {
        return console.log('No data found!')
      }

      // Print columns A and E, which correspond to indices 0 and 4.
      const rowdata = rows.map((row: any) => `${row[0]}, ${row[1]}`)
      console.log({ rowdata })
    } catch (error) {
      const parsedError = `FUNCTION: readSheet, ${parseError(error)}`
      console.log(parsedError)
    }
  },

  update: async (sheetTitle: string, cellRange: string, values: string[][] | number[][]) => {
    try {
      const range = `${sheetTitle}!${cellRange}`
      const request = new CreateUpdateQueryParams({
        spreadsheetId: process.env.GOOGLE_SHEET_SPREADSHEET_ID!,
        range: range,
        resource: {
          range: range,
          majorDimension: Dimension.ROWS,
          values: values
        }
      })

      const res = await sheets.spreadsheets.values.update(request)
      console.log(`STATUS: ${res.status}, DATA: ${JSON.stringify(res.data)}`)
      return res.data
    } catch (error) {
      const parsedError = `FUNCTION: update, ${parseError(error)}`
      console.log(parsedError)
      return parsedError
    }
  },

  appendToSheet: async (sheetTitle: string, cellRange: string, values: string[][] | number[][]) => {
    try {
      const range = `${sheetTitle}!${cellRange}`
      const request = new CreateAppendQueryParams({
        spreadsheetId: process.env.GOOGLE_SHEET_SPREADSHEET_ID!,
        range: range,
        resource: {
          range: range,
          majorDimension: Dimension.ROWS,
          values: values
        },
        insertDataOption: InsertDataOption.INSERT_ROWS
      })

      const res = await sheets.spreadsheets.values.append(request)
      console.log(`STATUS: ${res.status}, DATA: ${JSON.stringify(res.data)}`)
      return res.data
    } catch (error) {
      const parsedError = `FUNCTION: appendToSheet, ${parseError(error)}`
      console.log(parsedError)
      return parsedError
    }
  }
}
