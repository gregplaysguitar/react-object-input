import * as React from 'react'
import {useCallback, useState} from 'react'
import {ObjectInput} from '../.'

const initial = {
  a: '123',
  b: '456',
  prop1: '678',
  prop2: '159'
}

export const Simple = () => {
  const [value, setValue] = useState<Record<string, string>>(initial)

  const [renderKey, setRenderKey] = useState(Math.random())
  const reset = useCallback(() => {
    setValue(initial)
    setRenderKey(Math.random)
  }, [])

  return (
    <div style={{display: 'flex'}}>
      <div style={{flex: 1, marginRight: '40px'}}>
        <ObjectInput
          key={renderKey}
          obj={value}
          onChange={setValue}
          renderItem={(key, value, updateKey, updateValue, deleteProperty) => (
            <div style={{display: 'flex', margin: '0 0 10px'}}>
              <input
                style={{width: 80, margin: '0 5px 0 0'}}
                type="text"
                value={key}
                onChange={e => updateKey(e.target.value)}
              />
              :
              <input
                style={{flex: 1, margin: '0 5px'}}
                type="text"
                value={value || ''}
                onChange={e => updateValue(e.target.value)}
              />
              <button onClick={deleteProperty}>x</button>
            </div>
          )}
          renderEmpty={() => <p>No items</p>}
        />
        <button onClick={reset} style={{marginLeft: '10px'}}>
          Reset
        </button>
      </div>
      <div style={{flex: 1}}>
        <textarea
          style={{
            height: 150,
            width: '100%',
            padding: '5px',
            color: '#666'
          }}
          value={JSON.stringify(value, null, 2)}
          onChange={e => setValue(JSON.parse(e.target.value))}
        />
      </div>
    </div>
  )
}
