import { TelegramAPI } from "./api/TelegramAPI"
import { Update, TelegramMessage } from "./models/Telegram/Telegram"
import { checkIfRequiredEnvExists } from "./utils/helpers"
import { GSheetAPI } from "./api/GoogleSheetAPI"

exports.handler = async (event: any): Promise<{ statusCode: number }> => {
  console.log('START OF CYCLE')

  console.log(`ALL ENV VARS EXIST: ${checkIfRequiredEnvExists()}`)
  console.log(`EVENT OBJECT HAS PROPERTY OF 'body': ${event.hasOwnProperty('body')}`)

  if (!checkIfRequiredEnvExists() || !event.hasOwnProperty('body')) {
    return { statusCode: 200 }
  }

  const update: Update = JSON.parse(event.body)
  console.log('EVENT BODY', update)
  
  const telegramMessage = new TelegramMessage(update)

  const sheetName = `${telegramMessage.message?.from?.id}_${telegramMessage.message?.from?.first_name}`
  const sheetExists = await GSheetAPI.checkSheetExists(sheetName)

  if (!sheetExists) {
    // Allow callback_query
    await TelegramAPI.getUpdates(['message', 'callback_query'])
  }

  await telegramMessage.executeMessageTask()

  await telegramMessage.reply()

  console.log('END OF CYCLE WITH STATUS 200')
  return { statusCode: 200 }
};
