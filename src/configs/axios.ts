import Axios from "axios"

require('dotenv').config()

export const telegramAxios = Axios.create({
  baseURL: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`
})
