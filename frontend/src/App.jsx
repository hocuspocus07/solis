import { useState } from 'react'
import './App.css'
import Home from './pages/Home.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className=''>
      <div><Home/></div>
    </div>
  )
}

export default App
