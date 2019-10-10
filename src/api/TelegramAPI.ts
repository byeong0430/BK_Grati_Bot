import { telegramAxios } from "../configs/axios"
import { telegramRoutes } from "../constants/Routes"
import { parseError } from "../utils/helpers"
import { CallbackQueryOptions } from "../models/Telegram/Telegram"
import { InlineKeyboardMarkup, SendMessageParam, ForceReply } from "../models/Telegram/SendText"
import { GetUpdatesParams } from "../models/Telegram/GetUpdates"


export const TelegramAPI = {
  getUpdates: async (allowedUpdates: CallbackQueryOptions[]) => {
    const params: GetUpdatesParams = {
      allowed_updates: allowedUpdates
    }

    try {
      return await telegramAxios.get(telegramRoutes.GET_UPDATES, { params })
    } catch (error) {
      const parsedError = parseError(error)
      console.log(parsedError)
      return parsedError
    }
  },

  sendText: async (chatId: number, text: string, replyMarkup?: InlineKeyboardMarkup | ForceReply) => {
    const params: SendMessageParam = {
      chat_id: chatId,
      text,
      reply_markup: replyMarkup
    }

    try {
      return await telegramAxios.get(telegramRoutes.SEND_MESSAGE, { params })
    } catch (error) {
      const parsedError = parseError(error)
      console.log(parsedError)
      return parsedError
    }
  }
}
