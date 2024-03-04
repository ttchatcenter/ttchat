import { useState } from 'react'
import Main from './main'
import Close from './close'
import Reject from './reject'

const Setting = (props) => {
  const [state, setState] = useState('main')

  return (
    <div className="flex flex-col w-full">
      {
        state === 'main' ? (
          <Main
            {...props}
            setState={setState}
          />
        ) : undefined
      }
      {
        state === 'close' ? (
          <Close
            {...props}
            setState={setState}
          />
        ) : undefined
      }
            {
        state === 'reject' ? (
          <Reject
            {...props}
            setState={setState}
          />
        ) : undefined
      }
    </div>
  )
}

export default Setting