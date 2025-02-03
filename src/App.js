import './App.scss';
import Header from './Component/Header'
import Footer from './Component/Footer'
import Home from './Pages/Home'
import { Routes, Route } from 'react-router-dom';
import Contests from './Pages/Contests';


function App() {
  return (
    <div className="App">
      <Header/>
      <div className='Content'>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/contests" element={<Contests/>} />
        <Route path="/about-us" element={<Home/>} />
        <Route path="/participants" element={<Home/>} />
        <Route path="/ratings" element={<Home/>} />
        <Route path="/profile" element={<Home/>} />
      </Routes>
      </div>
      <Footer/>
    </div>
  );
}

export default App;
