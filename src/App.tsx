import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className={'text-5xl'}>
        <button className={'text-amber-800'} onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save fto test HMR
        </p>
      </div>
    </>
  )
}

export default App
