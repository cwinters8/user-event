import React from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '..'

test.each(['input', 'textarea'])(
  'should fire the correct events for <%s>',
  type => {
    const events = []
    const eventsHandler = jest.fn(evt => events.push(evt.type))
    render(
      React.createElement(type, {
        'data-testid': 'element',
        onMouseOver: eventsHandler,
        onMouseMove: eventsHandler,
        onMouseDown: eventsHandler,
        onFocus: eventsHandler,
        onMouseUp: eventsHandler,
        onClick: eventsHandler,
      }),
    )

    userEvent.click(screen.getByTestId('element'))

    expect(events).toEqual([
      'mouseover',
      'mousemove',
      'mousedown',
      'focus',
      'mouseup',
      'click',
    ])
  },
)

it('should fire the correct events for <input type="checkbox">', () => {
  const events = []
  const eventsHandler = jest.fn(evt => events.push(evt.type))
  render(
    <input
      data-testid="element"
      type="checkbox"
      onMouseOver={eventsHandler}
      onMouseMove={eventsHandler}
      onMouseDown={eventsHandler}
      onFocus={eventsHandler}
      onMouseUp={eventsHandler}
      onClick={eventsHandler}
      onChange={eventsHandler}
    />,
  )

  userEvent.click(screen.getByTestId('element'))

  expect(events).toEqual([
    'mouseover',
    'mousemove',
    'mousedown',
    'focus',
    'mouseup',
    'click',
    'change',
  ])

  expect(screen.getByTestId('element')).toHaveProperty('checked', true)
})

it('should fire the correct events for <input type="checkbox" disabled>', () => {
  const events = []
  const eventsHandler = jest.fn(evt => events.push(evt.type))
  render(
    <input
      data-testid="element"
      type="checkbox"
      onMouseOver={eventsHandler}
      onMouseMove={eventsHandler}
      onMouseDown={eventsHandler}
      onFocus={eventsHandler}
      onMouseUp={eventsHandler}
      onClick={eventsHandler}
      onChange={eventsHandler}
      disabled
    />,
  )

  userEvent.click(screen.getByTestId('element'))

  expect(events).toEqual([])

  expect(screen.getByTestId('element')).toHaveProperty('checked', false)
})

it('should fire the correct events for <input type="radio">', () => {
  const events = []
  const eventsHandler = jest.fn(evt => events.push(evt.type))
  render(
    <input
      data-testid="element"
      type="radio"
      onMouseOver={eventsHandler}
      onMouseMove={eventsHandler}
      onMouseDown={eventsHandler}
      onFocus={eventsHandler}
      onMouseUp={eventsHandler}
      onClick={eventsHandler}
      onChange={eventsHandler}
    />,
  )

  userEvent.click(screen.getByTestId('element'))

  expect(events).toEqual([
    'mouseover',
    'mousemove',
    'mousedown',
    'focus',
    'mouseup',
    'click',
    'change',
  ])

  expect(screen.getByTestId('element')).toHaveProperty('checked', true)
})

it('should fire the correct events for <input type="radio" disabled>', () => {
  const events = []
  const eventsHandler = jest.fn(evt => events.push(evt.type))
  render(
    <input
      data-testid="element"
      type="radio"
      onMouseOver={eventsHandler}
      onMouseMove={eventsHandler}
      onMouseDown={eventsHandler}
      onFocus={eventsHandler}
      onMouseUp={eventsHandler}
      onClick={eventsHandler}
      onChange={eventsHandler}
      disabled
    />,
  )

  userEvent.click(screen.getByTestId('element'))

  expect(events).toEqual([])

  expect(screen.getByTestId('element')).toHaveProperty('checked', false)
})

it('should fire the correct events for <div>', () => {
  const events = []
  const eventsHandler = jest.fn(evt => events.push(evt.type))
  render(
    <div
      data-testid="div"
      onMouseOver={eventsHandler}
      onMouseMove={eventsHandler}
      onMouseDown={eventsHandler}
      onFocus={eventsHandler}
      onMouseUp={eventsHandler}
      onClick={eventsHandler}
    />,
  )

  userEvent.click(screen.getByTestId('div'))
  expect(events).toEqual([
    'mouseover',
    'mousemove',
    'mousedown',
    'mouseup',
    'click',
  ])
})

it('toggles the focus', () => {
  render(
    <React.Fragment>
      <input data-testid="A" />
      <input data-testid="B" />
    </React.Fragment>,
  )

  const a = screen.getByTestId('A')
  const b = screen.getByTestId('B')

  expect(a).not.toHaveFocus()
  expect(b).not.toHaveFocus()

  userEvent.click(a)
  expect(a).toHaveFocus()
  expect(b).not.toHaveFocus()

  userEvent.click(b)
  expect(a).not.toHaveFocus()
  expect(b).toHaveFocus()
})

it('should not blur when mousedown prevents default', () => {
  let events = []
  const eventsHandler = jest.fn(evt => events.push(evt.type))
  const commonEvents = {
    onBlur: eventsHandler,
    onMouseOver: eventsHandler,
    onMouseMove: eventsHandler,
    onMouseDown: eventsHandler,
    onFocus: eventsHandler,
    onMouseUp: eventsHandler,
    onClick: eventsHandler,
    onChange: eventsHandler,
  }

  render(
    <React.Fragment>
      <input data-testid="A" {...commonEvents} />
      <input
        data-testid="B"
        {...commonEvents}
        onMouseDown={e => {
          e.preventDefault()
          eventsHandler(e)
        }}
      />
      <input data-testid="C" {...commonEvents} />
    </React.Fragment>,
  )

  const a = screen.getByTestId('A')
  const b = screen.getByTestId('B')
  const c = screen.getByTestId('C')

  expect(a).not.toHaveFocus()
  expect(b).not.toHaveFocus()
  expect(c).not.toHaveFocus()

  userEvent.click(a)
  expect(a).toHaveFocus()
  expect(b).not.toHaveFocus()
  expect(c).not.toHaveFocus()

  expect(events).toEqual([
    'mouseover',
    'mousemove',
    'mousedown',
    'focus',
    'mouseup',
    'click',
  ])

  events = []

  userEvent.click(b)
  expect(a).toHaveFocus()
  expect(b).not.toHaveFocus()
  expect(c).not.toHaveFocus()

  expect(events).toEqual([
    'mousemove',
    'mouseover',
    'mousemove',
    'mousedown',
    'mouseup',
    'click',
  ])

  events = []

  userEvent.click(c)
  expect(a).not.toHaveFocus()
  expect(b).not.toHaveFocus()
  expect(c).toHaveFocus()

  expect(events).toEqual([
    'mousemove',
    'mouseover',
    'mousemove',
    'mousedown',
    'blur',
    'focus',
    'mouseup',
    'click',
  ])
})

it('does not lose focus when click updates focus', () => {
  const FocusComponent = () => {
    const inputRef = React.useRef()
    const focusInput = () => inputRef.current.focus()

    return (
      <React.Fragment>
        <input data-testid="input" ref={inputRef} />
        <button onClick={focusInput}>Update Focus</button>
      </React.Fragment>
    )
  }
  render(<FocusComponent />)

  const input = screen.getByTestId('input')
  const button = screen.getByText('Update Focus')

  expect(input).not.toHaveFocus()

  userEvent.click(button)
  expect(input).toHaveFocus()

  userEvent.click(button)
  expect(input).toHaveFocus()
})

test.each(['input', 'textarea'])(
  'gives focus to <%s> when clicking a <label> with htmlFor',
  type => {
    render(
      <React.Fragment>
        <label htmlFor="input" data-testid="label">
          Label
        </label>
        {React.createElement(type, {id: 'input', 'data-testid': 'input'})}
      </React.Fragment>,
    )
    userEvent.click(screen.getByTestId('label'))
    expect(screen.getByTestId('input')).toHaveFocus()
  },
)

test.each(['input', 'textarea'])(
  'gives focus to <%s> when clicking a <label> without htmlFor',
  type => {
    render(
      <div>
        <label data-testid="label">
          Label
          {React.createElement(type, {'data-testid': 'input'})}
        </label>
      </div>,
    )
    userEvent.click(screen.getByTestId('label'))
    expect(screen.getByTestId('input')).toHaveFocus()
  },
)

test.each(['input', 'textarea'])(
  'gives focus to <%s> when clicking on an element contained within a <label>',
  type => {
    render(
      <React.Fragment>
        <label htmlFor="input" data-testid="label">
          <span>Label</span>
        </label>
        {React.createElement(type, {id: 'input', 'data-testid': 'input'})}
      </React.Fragment>,
    )
    userEvent.click(screen.getByText('Label'))
    expect(screen.getByTestId('input')).toHaveFocus()
  },
)

it('checks <input type="checkbox"> when clicking a <label> with htmlFor', () => {
  render(
    <React.Fragment>
      <label htmlFor="input" data-testid="label">
        Label
      </label>
      <input id="input" data-testid="input" type="checkbox" />
    </React.Fragment>,
  )
  expect(screen.getByTestId('input')).toHaveProperty('checked', false)
  userEvent.click(screen.getByTestId('label'))
  expect(screen.getByTestId('input')).toHaveProperty('checked', true)
})

it('checks <input type="checkbox"> when clicking a <label> without htmlFor', () => {
  render(
    <div>
      <label data-testid="label">
        Label
        <input id="input" data-testid="input" type="checkbox" />
      </label>
    </div>,
  )
  expect(screen.getByTestId('input')).toHaveProperty('checked', false)
  userEvent.click(screen.getByTestId('label'))
  expect(screen.getByTestId('input')).toHaveProperty('checked', true)
})

it('should submit a form when clicking on a <button>', () => {
  const onSubmit = jest.fn(e => e.preventDefault())
  const {getByText} = render(
    <form onSubmit={onSubmit}>
      <button>Submit</button>
    </form>,
  )
  userEvent.click(getByText('Submit'))
  expect(onSubmit).toHaveBeenCalledTimes(1)
})

it('should not submit a form when clicking on a <button type="button">', () => {
  const onSubmit = jest.fn(e => e.preventDefault())
  const {getByText} = render(
    <form onSubmit={onSubmit}>
      <button type="button">Submit</button>
    </form>,
  )
  userEvent.click(getByText('Submit'))
  expect(onSubmit).not.toHaveBeenCalled()
})

it('should not fire blur on current element if is the same as previous', () => {
  const onBlur = jest.fn()
  const {getByText} = render(<button onBlur={onBlur}>Blur</button>)
  userEvent.click(getByText('Blur'))
  expect(onBlur).not.toHaveBeenCalled()
  userEvent.click(getByText('Blur'))
  expect(onBlur).not.toHaveBeenCalled()
})

test.each(['input', 'textarea'])(
  'should not give focus for <%s> when mouseDown is prevented',
  type => {
    render(
      React.createElement(type, {
        'data-testid': 'element',
        onMouseDown: evt => {
          evt.preventDefault()
        },
      }),
    )

    userEvent.click(screen.getByTestId('element'))

    expect(screen.getByTestId('element')).not.toHaveFocus()
  },
)