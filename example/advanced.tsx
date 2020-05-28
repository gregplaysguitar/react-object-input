import * as React from 'react'
import {useCallback, useState} from 'react'
import {ObjectInput} from '../.'

interface Animal {
  type: 'dog' | 'cat'
  breed: string
  age?: number
}

const initial: Record<string, Animal> = {
  fido: {type: 'dog', breed: 'Crossbreed', age: 79},
  felix: {type: 'cat', breed: 'Tuxedo', age: 97}
}

export const Advanced = () => {
  const [value, setValue] = useState<Record<string, Animal>>(initial)

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
          renderItem={(key, value, updateKey, updateValue, deleteProperty) => {
            return (
              <div style={{display: 'flex', margin: '0 0 10px'}}>
                <input
                  style={{width: 80, margin: '0 5px 0 0'}}
                  type="text"
                  value={key}
                  onChange={e => updateKey(e.target.value)}
                  placeholder="Name"
                />
                :
                <AnimalEditor value={value} updateValue={updateValue} />
                <button onClick={deleteProperty}>x</button>
              </div>
            )
          }}
          renderEmpty={() => <p>No items</p>}
        />
        <button onClick={reset} style={{marginLeft: '10px'}}>
          Reset
        </button>
      </div>
      <div style={{flex: 1}}>
        <textarea
          style={{
            height: 300,
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

const AnimalEditor = ({
  value,
  updateValue
}: {
  value?: Animal
  updateValue: (a: Animal) => void
}) => {
  const defaultValue: Animal = {
    type: 'dog',
    breed: '',
    age: undefined,
    ...value
  }
  return (
    <>
      <select
        style={{flex: 1, margin: '0 0 0 5px'}}
        value={defaultValue.type}
        onChange={e =>
          updateValue({...defaultValue, type: e.target.value as Animal['type']})
        }
      >
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
      </select>
      <input
        style={{flex: 1, margin: '0 5px'}}
        type="text"
        placeholder="Breed"
        value={defaultValue.breed}
        onChange={e => updateValue({...defaultValue, breed: e.target.value})}
      />
      <input
        style={{flex: 1, margin: '0 5px'}}
        type="number"
        placeholder="Age"
        value={defaultValue.age}
        onChange={e =>
          updateValue({...defaultValue, age: parseInt(e.target.value)})
        }
      />
    </>
  )
}
