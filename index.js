function createElement(tag, attributes = {}, textContent = '') {
  const element = document.createElement(tag)

  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value
    } else if (key === 'textContent') {
      element.textContent = value
    } else {
      element.setAttribute(key, value)
    }
  })

  if (textContent) {
    element.textContent = textContent
  }

  return element
}

function addElementToDOM(containerId, text) {
  const container = document.getElementById(containerId)
  if (!container) {
    throw new Error(`Container with id '${containerId}' not found`)
  }

  const newElement = createElement('div', { className: 'dynamic-item' }, text)
  container.appendChild(newElement)
  return newElement
}

function removeElementFromDOM(elementId) {
  const element = document.getElementById(elementId)
  if (!element) {
    return false
  }

  element.remove()
  return true
}

function displayError(message, errorElementId = 'error-message') {
  const errorElement = document.getElementById(errorElementId)
  if (!errorElement) {
    throw new Error(`Error element with id '${errorElementId}' not found`)
  }

  errorElement.textContent = message
  errorElement.classList.remove('hidden')
  return errorElement
}

function clearError(errorElementId = 'error-message') {
  const errorElement = document.getElementById(errorElementId)
  if (!errorElement) {
    return false
  }

  errorElement.textContent = ''
  errorElement.classList.add('hidden')
  return true
}

function submitForm(formId, targetId) {
  const form = document.getElementById(formId)
  const target = document.getElementById(targetId)
  const errorElement = document.getElementById('error-message')
  if (!form || !target) {
    throw new Error('Form or target container not found')
  }

  const input = form.querySelector('input[type="text"]')
  const value = input ? input.value.trim() : ''

  if (!value) {
    displayError('Input cannot be empty')
    return false
  }

  clearError()
  addElementToDOM(targetId, value)
  return true
}

function handleFormSubmit(formId, targetId) {
  const form = document.getElementById(formId)
  if (!form) {
    throw new Error(`Form with id '${formId}' not found`)
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    submitForm(formId, targetId)
  })

  return form
}

function simulateClick(targetId, message, buttonId = 'simulate-click') {
  const button = document.getElementById(buttonId)
  if (!button) {
    throw new Error(`Button with id '${buttonId}' not found`)
  }

  const handler = () => addElementToDOM(targetId, message)
  button.addEventListener('click', handler)
  button.click()
  button.removeEventListener('click', handler)
  return true
}

function initApp() {
  const form = document.getElementById('user-form')
  const button = document.getElementById('simulate-click')

  if (form) {
    handleFormSubmit('user-form', 'dynamic-content')
  }

  if (button) {
    button.addEventListener('click', () => addElementToDOM('dynamic-content', 'Button Clicked!'))
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initApp)
}

module.exports = {
  createElement,
  addElementToDOM,
  removeElementFromDOM,
  displayError,
  clearError,
  submitForm,
  handleFormSubmit,
  simulateClick,
  initApp,
}
