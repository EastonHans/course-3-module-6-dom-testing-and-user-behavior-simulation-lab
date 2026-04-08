/**
 * @jest-environment jsdom
 */

const fs = require('fs')
const path = require('path')
const {
  createElement,
  addElementToDOM,
  removeElementFromDOM,
  displayError,
  clearError,
  submitForm,
  handleFormSubmit,
  simulateClick,
} = require('../index')

describe('DOM Testing and User Behavior Simulation', () => {
  beforeEach(() => {
    const htmlPath = path.resolve(__dirname, '../index.html')
    const html = fs.readFileSync(htmlPath, 'utf8')
    document.documentElement.innerHTML = html
  })

  it('loads the HTML template and contains the form, button, and dynamic content container', () => {
    expect(document.getElementById('user-form')).not.toBeNull()
    expect(document.getElementById('user-input')).not.toBeNull()
    expect(document.getElementById('simulate-click')).not.toBeNull()
    expect(document.getElementById('dynamic-content')).not.toBeNull()
    expect(document.getElementById('error-message')).not.toBeNull()
  })

  it('should add an element to the DOM', () => {
    addElementToDOM('dynamic-content', 'Hello, World!')
    expect(document.getElementById('dynamic-content').textContent).toContain('Hello, World!')
  })

  it('should remove an element from the DOM', () => {
    const element = document.createElement('div')
    element.id = 'test-element'
    document.body.appendChild(element)

    expect(removeElementFromDOM('test-element')).toBe(true)
    expect(document.getElementById('test-element')).toBeNull()
  })

  it('should display and clear error messages', () => {
    displayError('Input cannot be empty')
    const errorElement = document.getElementById('error-message')
    expect(errorElement.textContent).toBe('Input cannot be empty')
    expect(errorElement.classList.contains('hidden')).toBe(false)

    expect(clearError()).toBe(true)
    expect(errorElement.textContent).toBe('')
    expect(errorElement.classList.contains('hidden')).toBe(true)
  })

  it('should submit the form and update the DOM with user input', () => {
    const input = document.getElementById('user-input')
    input.value = 'Test Input'

    expect(submitForm('user-form', 'dynamic-content')).toBe(true)
    expect(document.getElementById('dynamic-content').textContent).toContain('Test Input')
    expect(document.getElementById('error-message').classList.contains('hidden')).toBe(true)
  })

  it('should show an error for empty form submission', () => {
    expect(submitForm('user-form', 'dynamic-content')).toBe(false)
    const errorElement = document.getElementById('error-message')
    expect(errorElement.textContent).toBe('Input cannot be empty')
    expect(errorElement.classList.contains('hidden')).toBe(false)
  })

  it('should simulate a button click and update the DOM', () => {
    simulateClick('dynamic-content', 'Button Clicked!')
    expect(document.getElementById('dynamic-content').textContent).toContain('Button Clicked!')
  })

  it('should create dynamic elements with the expected class and text', () => {
    addElementToDOM('dynamic-content', 'New Item')
    const dynamicItem = document.querySelector('#dynamic-content .dynamic-item')

    expect(dynamicItem).not.toBeNull()
    expect(dynamicItem.textContent).toBe('New Item')
    expect(dynamicItem.classList.contains('dynamic-item')).toBe(true)
  })

  it('should update input value and submit the form correctly', () => {
    const input = document.getElementById('user-input')
    input.value = 'User change'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    expect(input.value).toBe('User change')
    expect(submitForm('user-form', 'dynamic-content')).toBe(true)
    expect(document.getElementById('dynamic-content').textContent).toContain('User change')
  })

  it('should handle form submission directly and update the DOM via an event', () => {
    const input = document.getElementById('user-input')
    input.value = 'Direct submit'
    handleFormSubmit('user-form', 'dynamic-content')

    const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
    document.getElementById('user-form').dispatchEvent(submitEvent)

    expect(document.getElementById('dynamic-content').textContent).toContain('Direct submit')
  })

  it('should return false when removing a missing element', () => {
    expect(removeElementFromDOM('missing-element')).toBe(false)
  })

  it('should throw an error when adding an element to a missing container', () => {
    expect(() => addElementToDOM('missing-container', 'Text')).toThrow("Container with id 'missing-container' not found")
  })

  it('should throw an error when simulating a click with a missing button', () => {
    expect(() => simulateClick('dynamic-content', 'Text', 'missing-button')).toThrow("Button with id 'missing-button' not found")
  })

  it('should throw when submitForm is called with a missing form or target', () => {
    expect(() => submitForm('missing-form', 'dynamic-content')).toThrow('Form or target container not found')
    expect(() => submitForm('user-form', 'missing-target')).toThrow('Form or target container not found')
  })

  it('should attach event listeners and process a live form submit', () => {
    handleFormSubmit('user-form', 'dynamic-content')
    const input = document.getElementById('user-input')
    input.value = 'Live Submit'
    document.getElementById('user-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

    expect(document.getElementById('dynamic-content').textContent).toContain('Live Submit')
  })
})
