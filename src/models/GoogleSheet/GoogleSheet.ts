import { IsString, IsDefined, IsBoolean, IsEnum, ValidateNested } from 'class-validator'
import { validateWithThrow } from '../Validation'

interface Installed {
  client_id: string
  proejct_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_secret: string
  redirect_uris: string
}

export interface GoogleSheetCredentials {
  installed: Installed
}

export interface GoogleSheetToken {
  access_token: string
  refresh_token: string
  scope: string
  token_type: string
  expiry_date: number
}

interface ValueRange {
  range: string
  majorDimension: Dimension
  values: number[][] | string[][]
}

export enum Dimension {
  DIMENSION_UNSPECIFIED = 'DIMENSION_UNSPECIFIED',
  ROWS = 'ROWS',
  COLUMNS = 'COLUMNS'
}

export enum ValueInputOption {
  INPUT_VALUE_OPTION_UNSPECIFIED = 'INPUT_VALUE_OPTION_UNSPECIFIED', // default
  RAW = 'RAW',
  USER_ENTERED = 'USER_ENTERED'
}

export enum InsertDataOption {
  OVERWRITE = 'OVERWRITE',
  INSERT_ROWS = 'INSERT_ROWS'
}

export enum ValueRenderOption {
  FORMATTED_VALUE = 'FORMATTED_VALUE', // default
  UNFORMATTED_VALUE = 'UNFORMATTED_VALUE',
  FORMULA = 'FORMULA'
}

export enum DateTimeRenderOption {
  SERIAL_NUMBER = 'SERIAL_NUMBER', // default
  FORMATTED_STRING = 'FORMATTED_STRING'
}

interface GoogleSheetUpdateQueryParams {
  spreadsheetId: string
  range: string
  valueInputOption?: ValueInputOption
  resource: ValueRange
  includeValuesInResponse?: boolean
  responseValueRenderOption?: ValueRenderOption
  responseDateTimeRenderOption?: DateTimeRenderOption
}

export class CreateUpdateQueryParams implements GoogleSheetUpdateQueryParams {
  @IsDefined()
  @IsString()
  spreadsheetId: string

  @IsDefined()
  @IsString()
  range: string

  @IsDefined()
  @IsEnum(ValueInputOption)
  valueInputOption: ValueInputOption

  @IsDefined()
  @ValidateNested()
  resource: ValueRange

  @IsDefined()
  @IsBoolean()
  includeValuesInResponse: boolean

  @IsDefined()
  @IsEnum(ValueRenderOption)
  responseValueRenderOption: ValueRenderOption

  @IsDefined()
  @IsEnum(DateTimeRenderOption)
  responseDateTimeRenderOption: DateTimeRenderOption

  constructor(params: GoogleSheetUpdateQueryParams) {
    this.spreadsheetId = params.spreadsheetId

    this.range = params.range

    this.valueInputOption = params.valueInputOption || ValueInputOption.RAW

    this.resource = params.resource

    this.includeValuesInResponse = params.includeValuesInResponse || true

    this.responseValueRenderOption = params.responseValueRenderOption || ValueRenderOption.FORMATTED_VALUE

    this.responseDateTimeRenderOption = params.responseDateTimeRenderOption || DateTimeRenderOption.FORMATTED_STRING

    validateWithThrow(this)
  }
}

interface GoogleSheetAppendQueryParams extends GoogleSheetUpdateQueryParams {
  insertDataOption: InsertDataOption
}

export class CreateAppendQueryParams extends CreateUpdateQueryParams {
  @IsEnum(InsertDataOption)
  insertDataOption: InsertDataOption

  constructor(params: GoogleSheetAppendQueryParams) {
    super(params)
    
    this.insertDataOption = params.insertDataOption
    
    validateWithThrow(this)
  }
}
