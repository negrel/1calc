import '@csstools/normalize.css'
import * as mep from '@negrel/mep'

import './style.css'
import State from './State'
import './prisme-banner.js'

const { compute, TokenType, Lexer } = mep.default

declare global {
  interface Window {
    operator: (op: string) => void
    clearOne: () => void
    clearAll: () => void
    compute: () => void
    lightTheme: () => void
    darkTheme: () => void
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const keys = document.querySelectorAll('.key')
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const expressionElement = document.querySelector('#expression')!
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const resultElement = document.querySelector('#result')!

  const expression = new State({
    initial: '',
    onChange: (_oldValue, newValue) => {
      expressionElement.textContent = newValue.replaceAll('*', '×').replaceAll('/', '÷')
      resultElement.textContent = compute(newValue).toString()
    }
  })

  for (const key of Array.from(keys)) {
    if (key.className !== 'key') continue

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    key.addEventListener('click', () => {
      expression.set(`${expression.get()}${key.textContent ?? ''}`)
    })
  }

  window.operator = (op: string) => {
    const tokens = Lexer.lex(expression.get())
    if (op.length === 0 || (tokens.length > 2 &&
        tokens[tokens.length - 2].type === TokenType.OPERATOR)) {
      return
    }

    expression.set(`${expression.get()}${op}`)
  }

  window.clearOne = () => {
    expression.set(expression.get().slice(0, -1))
  }

  window.clearAll = () => {
    expression.set('')
  }

  window.compute = () => {
    expression.set(resultElement.textContent ?? '')
  }

  // Themes
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const lightThemeContainer = document.querySelector('#theme-light')!
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const darkThemeContainer = document.querySelector('#theme-dark')!
  window.lightTheme = () => {
    document.body.className = ''
    lightThemeContainer.className = 'theme-active'
    darkThemeContainer.className = ''
    localStorage.setItem('theme', 'light')
  }

  window.darkTheme = () => {
    document.body.className = 'dark'
    darkThemeContainer.className = 'theme-active'
    lightThemeContainer.className = ''
    localStorage.setItem('theme', 'dark')
  }

  // Default to browser preference
  const currentTheme = localStorage.getItem('theme') ??
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  switch (currentTheme) {
    case 'dark':
      window.darkTheme()
      break

    case 'light':
    default:
      window.lightTheme()
  }
})
