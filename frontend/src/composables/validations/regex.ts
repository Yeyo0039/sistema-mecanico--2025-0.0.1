export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/

export const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/

export const DOCUMENT_REGEX = /^[0-9]{7,15}$/

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/
