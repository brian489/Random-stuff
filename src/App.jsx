import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Dasboard from './pages/Dasboard'
import Page1 from './pages/Page1'
import Page2 from './pages/Page2'
import Page3 from './pages/Page3'
import NaughtsAndCrosses from './pages/NaughtsAndCrosses'
import Worm from './pages/Worm'
import ImageToUrl from './pages/ConvertToURL'
import WTFIsThat from './pages/WTFIsThat'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dasboard />} />
        <Route path="/p1" element={<Page1 />} />
        <Route path="/p2" element={<Page2 />} />
        <Route path="/p3" element={<Page3 />} />
        <Route path="/game1" element= {<NaughtsAndCrosses />} />
        <Route path="/game2" element= {<Worm />} />
        <Route path="/game3" element= {<WTFIsThat />} />
        <Route path="/Image-Converter" element= {<ImageToUrl />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
