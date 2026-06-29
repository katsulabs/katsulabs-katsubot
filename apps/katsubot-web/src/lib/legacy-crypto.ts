import { sha256 } from 'js-sha256'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error legacy vendor (GibberishAES IIFE)
import GibberishAES from './vendor/gibberish-aes.js'

GibberishAES.size(256)

/** 레거시 login010.js — xui.util.encryptAES(plain, otpKey) */
export function encryptLegacyField(value: string, encryptKey: string): string {
  return GibberishAES.aesEncrypt(value, encryptKey)
}

/** 레거시 login010.js — AES(SHA256(password), otpKey) */
export function encryptLegacyPassword(password: string, encryptKey: string): string {
  return GibberishAES.aesEncrypt(sha256(password), encryptKey)
}
