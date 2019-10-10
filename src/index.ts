import { TelegramAPI } from "./api/TelegramAPI"
import { Update, TelegramMessage } from "./models/Telegram/Telegram"
import { checkIfRequiredEnvExists } from "./utils/helpers"

exports.handler = async (event: any): Promise<{ statusCode: number }> => {
  if (!checkIfRequiredEnvExists() || !event.hasOwnProperty('body')) {
    return { statusCode: 200 }
  }
    
  // Allow callback_query
  await TelegramAPI.getUpdates(['message', 'callback_query'])

  const update: Update = JSON.parse(event.body)
  console.log('EVENT BODY', update)

  const telegramMessage = new TelegramMessage(update)

  await telegramMessage.executeMessageTask()

  await telegramMessage.reply()

  return { statusCode: 200 }
};
