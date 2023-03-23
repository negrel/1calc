import '@csstools/normalize.css'
import { compute } from 'mep'

import './style.css'
import State from './State'

declare global {
  interface Window {
    operator: (op: string) => void
    clear: () => void
    clearAll: () => void
    compute: () => void
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
      expressionElement.textContent = newValue
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
    expression.set(`${expression.get()}${op}`)
  }

  window.clear = () => {
    expression.set(expression.get().slice(0, -1))
  }

  window.clearAll = () => {
    expression.set('')
  }

  window.compute = () => {
    expression.set(resultElement.textContent ?? '')
  }
})
