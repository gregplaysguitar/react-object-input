import React from 'react'
import {fireEvent, screen, render} from '@testing-library/react'
import {ObjectInput} from '../src/.'

export const Wrapper = ({
  initialValue
}: {
  initialValue: {[text: string]: string}
}) => {
  const [value, setValue] = React.useState<{
    [name: string]: string
  }>(initialValue)
  return (
    <div>
      <ObjectInput
        obj={value}
        onChange={setValue}
        renderItem={(key, value, updateKey, updateValue, deleteProperty) => (
          <div>
            <input
              role="name"
              data-testid={`name-${key || 'blank'}`}
              type="text"
              value={key}
              onChange={e => updateKey(e.target.value)}
            />
            :
            <input
              role="value"
              data-testid={`value-${key || 'blank'}`}
              type="text"
              value={value || ''}
              onChange={e => updateValue(e.target.value)}
            />
            <button
              role="delete"
              data-testid={`delete-${key || 'blank'}`}
              onClick={deleteProperty}
            >
              x
            </button>
          </div>
        )}
        renderAdd={add => (
          <a data-testid="add" onClick={add}>
            Add
          </a>
        )}
      />
      <textarea
        data-testid="raw"
        value={JSON.stringify(value)}
        onChange={e => setValue(JSON.parse(e.target.value))}
      />
    </div>
  )
}

const getInputs = (role: 'name' | 'value') =>
  screen.queryAllByRole(role) as HTMLInputElement[]
const getInputValues = (role: 'name' | 'value'): string[] =>
  getInputs(role).map(i => i.value)

const getRawInput = () => screen.getByTestId('raw') as HTMLTextAreaElement
const getRaw = (): string[] => JSON.parse(getRawInput().value)

test('Allows a parameter value to be updated', async () => {
  render(<Wrapper initialValue={{a: '1', b: '2'}} />)

  const input = screen.getByTestId('value-a')
  fireEvent.change(input, {
    target: {value: 'foo'}
  })
  expect(getRaw()).toMatchObject({a: 'foo', b: '2'})
})

test('Allows a parameter name to be updated', async () => {
  render(<Wrapper initialValue={{a: '1', b: '2'}} />)

  const input = screen.getByTestId('name-a')
  fireEvent.change(input, {
    target: {value: 'foo'}
  })
  expect(getRaw()).toMatchObject({foo: '1', b: '2'})
})

test('Allows a parameter to be deleted', async () => {
  render(<Wrapper initialValue={{a: '1', b: '2'}} />)

  const input = screen.getByTestId('delete-a')
  fireEvent.click(input)
  expect(getRaw()).toMatchObject({b: '2'})
})

test('Allows a parameter to be added', async () => {
  render(<Wrapper initialValue={{a: '1', b: '2'}} />)

  fireEvent.click(screen.getByTestId('add'))
  expect(getInputValues('name')).toStrictEqual(['a', 'b', ''])
  expect(getInputValues('value')).toStrictEqual(['1', '2', ''])

  fireEvent.change(screen.getByTestId('name-blank'), {
    target: {value: 'foo'}
  })
  expect(getInputValues('name')).toStrictEqual(['a', 'b', 'foo'])
  expect(getInputValues('value')).toStrictEqual(['1', '2', ''])

  fireEvent.change(screen.getByTestId('value-foo'), {
    target: {value: 'bar'}
  })
  expect(getInputValues('name')).toStrictEqual(['a', 'b', 'foo'])
  expect(getInputValues('value')).toStrictEqual(['1', '2', 'bar'])

  expect(getRaw()).toMatchObject({a: '1', b: '2'})
})

test('Allows two parameters to be added, with the second edited first', async () => {
  render(<Wrapper initialValue={{a: '1'}} />)

  fireEvent.click(screen.getByTestId('add'))
  fireEvent.click(screen.getByTestId('add'))
  expect(getInputValues('name')).toStrictEqual(['a', '', ''])
  expect(getInputValues('value')).toStrictEqual(['1', '', ''])
  expect(getRaw()).toMatchObject({a: '1'})

  fireEvent.change(getInputs('name')[2], {
    target: {value: 'foo'}
  })
  expect(getInputValues('name')).toStrictEqual(['a', '', 'foo'])
  expect(getInputValues('value')).toStrictEqual(['1', '', ''])
  expect(getRaw()).toMatchObject({a: '1'})

  fireEvent.change(getInputs('value')[2], {
    target: {value: 'bar'}
  })
  expect(getInputValues('name')).toStrictEqual(['a', '', 'foo'])
  expect(getInputValues('value')).toStrictEqual(['1', '', 'bar'])

  expect(getRaw()).toMatchObject({a: '1', foo: 'bar'})
})

test('Keeps existing parameter when a new one clashes', async () => {
  render(<Wrapper initialValue={{a: '1'}} />)

  fireEvent.click(screen.getByTestId('add'))

  fireEvent.change(getInputs('name')[1], {
    target: {value: 'a'}
  })
  expect(getRaw()).toMatchObject({a: '1'})

  fireEvent.change(getInputs('name')[1], {
    target: {value: 'b'}
  })
  expect(getRaw()).toMatchObject({a: '1'})
})

test('Prevents parameter name clashes', async () => {
  render(<Wrapper initialValue={{a: '1', b: '1'}} />)

  fireEvent.change(getInputs('name')[1], {
    target: {value: 'a'}
  })
  expect(getRaw()).toMatchObject({a: '1', b: '1'})
  expect(getInputs('name').length).toBe(2)
  expect(getInputValues('name')[0]).toBe('a')
  expect(getInputValues('name')[1]).toBe('b')
})

test('Accepts value changes when name not set', async () => {
  render(<Wrapper initialValue={{a: '1'}} />)

  fireEvent.click(screen.getByTestId('add'))

  fireEvent.change(getInputs('value')[1], {
    target: {value: '2'}
  })
  expect(getRaw()).toMatchObject({a: '1'})
  expect(getInputs('name').length).toBe(2)
  expect(getInputValues('name')[0]).toBe('a')
  expect(getInputValues('value')[0]).toBe('1')
  expect(getInputValues('name')[1]).toBe('')
  expect(getInputValues('value')[1]).toBe('2')
})

test('Handles an added parameter with the same name as an existing one', async () => {
  render(<Wrapper initialValue={{a: '1'}} />)

  fireEvent.click(screen.getByTestId('add'))

  fireEvent.change(getInputs('name')[1], {
    target: {value: 'a'}
  })
  fireEvent.change(getInputs('value')[1], {
    target: {value: '2'}
  })
  expect(getRaw()).toMatchObject({a: '1'})

  fireEvent.change(getInputs('name')[1], {
    target: {value: 'b'}
  })
  expect(getRaw()).toMatchObject({a: '1'})

  fireEvent.change(getInputs('value')[1], {
    target: {value: '2'}
  })
  expect(getRaw()).toMatchObject({a: '1', b: '2'})
})

test('When multiple parameters added with same name, and second value edited first, the first remains blank', async () => {
  render(<Wrapper initialValue={{}} />)

  fireEvent.click(screen.getByTestId('add'))
  fireEvent.click(screen.getByTestId('add'))
  expect(getRaw()).toMatchObject({})

  fireEvent.change(getInputs('name')[1], {
    target: {value: 'a'}
  })
  fireEvent.change(getInputs('value')[1], {
    target: {value: '1'}
  })
  expect(getRaw()).toMatchObject({a: '1'})

  fireEvent.change(getInputs('name')[0], {
    target: {value: 'a'}
  })
  expect(getRaw()).toMatchObject({a: '1'})
  expect(getInputValues('value')[0]).toBe('')
  expect(getInputValues('value')[1]).toBe('1')
})

test('Reflects external parameter name changes', async () => {
  render(<Wrapper initialValue={{a: '1'}} />)

  fireEvent.change(getRawInput(), {
    target: {value: '{"aa": "1"}'}
  })
  expect(getInputs('name').length).toBe(1)
  expect(getInputValues('name')[0]).toBe('aa')
  expect(getInputValues('value')[0]).toBe('1')
})

test('Reflects external parameter value changes', async () => {
  render(<Wrapper initialValue={{a: '1'}} />)

  fireEvent.change(getRawInput(), {
    target: {value: '{"a": "2"}'}
  })
  expect(getInputs('name').length).toBe(1)
  expect(getInputValues('name')[0]).toBe('a')
  expect(getInputValues('value')[0]).toBe('2')
})

test('Reflects external parameter addition', async () => {
  render(<Wrapper initialValue={{a: '1'}} />)

  fireEvent.change(getRawInput(), {
    target: {value: '{"a": "1", "b": "2"}'}
  })
  expect(getInputs('name').length).toBe(2)
  expect(getInputValues('name')[0]).toBe('a')
  expect(getInputValues('value')[0]).toBe('1')
  expect(getInputValues('name')[1]).toBe('b')
  expect(getInputValues('value')[1]).toBe('2')
})
