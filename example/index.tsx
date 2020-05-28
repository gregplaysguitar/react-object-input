import {createBrowserHistory} from 'history'
import * as React from 'react'
import 'react-app-polyfill/ie11'
import * as ReactDOM from 'react-dom'
import {Simple} from './simple'
import {Advanced} from './advanced'
import 'style.css'

const history = createBrowserHistory()

const A = ({
  to,
  ...props
}: {to: string} & React.HTMLProps<HTMLAnchorElement>) => (
  <a
    {...props}
    href={to}
    onClick={e => {
      e.preventDefault()
      history.push(to)
    }}
  />
)

export const App = () => {
  const [path, setPath] = React.useState(window.location.pathname)
  React.useEffect(() => history.listen(e => setPath(e.pathname)))

  return (
    <div style={{padding: '0 20px', maxWidth: '960px', margin: 'auto'}}>
      <h2>Object Input Demo</h2>
      <nav style={{display: 'flex', margin: '0 0 20px'}}>
        {[
          ['/', 'Simple'],
          ['/advanced', 'Advanced']
        ].map(([to, name]) => (
          <A
            style={{
              marginRight: '10px',
              fontWeight: path === to ? 'bold' : 'normal'
            }}
            to={to}
          >
            {name}
          </A>
        ))}
      </nav>

      {{
        '/': <Simple />,
        '/advanced': <Advanced />
      }[path] || <p>Not found</p>}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
