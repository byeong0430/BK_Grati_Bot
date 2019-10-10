export const checkIfRequiredEnvExists = (): boolean => {
  const requiredEnv = [
    'TELEGRAM_BOT_TOKEN', 
    'GOOGLE_SHEET_SPREADSHEET_ID',
    'NTBA_FIX_319',
    'GOOGLE_SHEET_CREDENTIALS',
    'GOOGLE_SHEET_TOKEN'
  ]

  return requiredEnv.every((varName) => {
    if (!process.env[varName]) {
      console.log(`"${varName}" env variable required`)
    }

    return process.env[varName]
  })
}

export const parseError = (error: any): string | undefined => {
  if (error?.response?.data?.error?.message) {
    return `${error.response.data.error.message}, error code: ${error.response.data.error.code}`
  } else if (error.message) {
    return error.message
  } else {
    return undefined
  }
}

export const generateNumberInRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}
