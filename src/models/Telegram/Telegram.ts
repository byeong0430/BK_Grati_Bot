import { InlineKeyboardMarkup, InlineKeyboardButton } from "./SendText"
import { TelegramAPI } from "../../api/TelegramAPI"
import { parseError, generateNumberInRange } from "../../utils/helpers"
import { GSheetAPI } from "../../api/GoogleSheetAPI"

export type CallbackQueryOptions = 'message' | 'edited_channel_post' | 'callback_query'

type ChatType = 'private' | 'group' | 'supergroup' | 'channel'

interface ChatPhoto {
  small_file_id: string
  big_file_id: string
}

interface ChatPermissions {
  can_send_messages?: boolean
  can_send_media_messages?: boolean
  can_send_polls?: boolean
  can_send_other_messages?: boolean
  can_add_web_page_previews?: boolean
  can_change_info?: boolean
  can_invite_users?: boolean
  can_pin_messages?: boolean
}

interface Chat {
  id: number
  type: ChatType
  title?: string
  username?: string
  first_name?: string
  last_name?: string
  photo?: ChatPhoto
  description?: string
  invite_link?: string
  pinned_message?: Message
  permissions?: ChatPermissions
  sticker_set_name?: string
  can_set_sticker_set?: boolean
}

interface User {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

interface MessageEntity {
  type: string
  offset: number
  length: number
  url?: string
  user?: User
}

interface Message {
  message_id: number
  from?: User
  date: number
  chat: Chat
  text?: string
  reply_markup?: InlineKeyboardMarkup
  entities?: MessageEntity[]
  reply_to_message?: Message
}

interface CallbackQuery {
  id: string
  from: User
  message?: Message
  chat_instance: string
  data: string
}

export interface Update {
  update_id: number
  message?: Message
  callback_query?: CallbackQuery
}

export class TelegramMessage implements Update {
  update_id: number
  message?: Message
  callback_query?: CallbackQuery
  keyboardOptions: InlineKeyboardButton[][] = [
    [
      { text: 'Monday', callback_data: 'monday' },
      { text: 'Tuesday', callback_data: 'tuesday' }
    ],
    [
      { text: 'Wednesday', callback_data: 'wednesday' },
      { text: 'Thursday', callback_data: 'thursday' }
    ],
    [
      { text: 'Friday', callback_data: 'friday' },
      { text: 'Saturday', callback_data: 'saturday' }
    ],
    [
      { text: 'Sunday', callback_data: 'sunday' },
      { text: 'Everyday', callback_data: 'everyday' }
    ]
  ]

  constructor(update: Update) {
    this.update_id = update.update_id
    this.message = update.message
    this.callback_query = update.callback_query
  }

  executeMessageTask = async () => {
    if (!this.message || !this.message.text) { return }
    console.log('ENTITIES', this.message.entities);

    const { text } = this.message

    if (text.match(/\/schedule/)) {
      await this.askSchedule(this.message)
    }

    if (text.match(/\/record/)) {
      await this.record(this.message)
    }
  }

  askSchedule = async (message: Message) => {
    const { from, chat } = message
    const text = `Hi ${from && from.first_name}! When would you like to receive a question?`

    try {
      await TelegramAPI.sendText(chat.id, text, { inline_keyboard: this.keyboardOptions })
    } catch (error) {
      console.log(parseError(error))
    }
  }

  record = async (message: Message) => {
    const { from, chat } = message
    const text = `Hi ${from && from.first_name}! What are you most grateful for recently?`

    try {
      await TelegramAPI.sendText(chat.id, text, { force_reply: true })
    } catch (error) {
      console.log(parseError(error))
    }
  }

  reply = async () => {
    if (this.message?.reply_to_message) {
      return this.replyToRecordMessage()
    }

    if (!this.callback_query || !this.callback_query.message) { return }

    const { message, data } = this.callback_query

    let text = `Done! I will remind you of what you're grateful for `
    text = data === 'everyday' ? text + data : text + `on every ${data}`

    try {
      await this.updateSchedule(this.callback_query.from, data)

      console.log('REPLY ADDED')
      
      await TelegramAPI.sendText(message.chat.id, text)
    } catch (error) {
      console.log(parseError(error))
    }
  }

  replyToRecordMessage = async () => {
    if (!this.message) { return }
    const { from, text } = this.message
    if (!from || !text) { return }

    await this.appendMessage(from, text)
  }

  appendMessage = async (from: User, text: string): Promise<void> => {
    const { id, first_name } = from
    const sheetTitle = `${id}_${first_name}`
    const sheetExists = await GSheetAPI.checkSheetExists(sheetTitle)
    const timestamp = new Date().toDateString()

    if (!sheetExists) {
      await GSheetAPI.createSheet(sheetTitle)
    }

    await GSheetAPI.appendToSheet(sheetTitle, 'A:B', [
      [timestamp, text]
    ])
  }

  updateSchedule = async (from: User, data: string): Promise<void> => {
    const { id, first_name } = from
    const sheetTitle = `${id}_${first_name}`
    const scheduleHour = Math.floor(generateNumberInRange(9, 23))
    const sheetExists = await GSheetAPI.checkSheetExists(sheetTitle)

    if (!sheetExists) {
      await GSheetAPI.createSheet(sheetTitle)
    }

    await GSheetAPI.update(sheetTitle, 'A1:C1', [
      ['Reminder at', data, `${scheduleHour}h`]
    ])
    
  }
}
