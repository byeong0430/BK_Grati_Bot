export interface SendMessageParam {
  chat_id: number | string
  text: string
  parse_mode?: string
  disable_web_page_preview?: boolean
  disable_notification?: boolean
  reply_to_message_id?: number
  reply_markup?: InlineKeyboardMarkup | ForceReply
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][]
}

export interface ForceReply {
  force_reply: true
  selective?: boolean
}

export interface InlineKeyboardButton {
  text: string
  url?: string
  login_url?: LoginUrl
  callback_data?: string
  switch_inline_query?: string
  switch_inline_query_current_chat?: string
  callback_game?: CallbackGame
  pay?: boolean
}

interface LoginUrl {
  url: string
  forward_text?: string
  bot_username?: string
  request_write_access?: boolean
}

interface CallbackGame {

}
