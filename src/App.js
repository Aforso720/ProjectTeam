import './App.scss';
import Header from './Component/Header'
import Footer from './Component/Footer'
import Home from './Pages/Home'
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/contests" element={<Home/>} />
        <Route path="/about-us" element={<Home/>} />
        <Route path="/participants" element={<Home/>} />
        <Route path="/ratings" element={<Home/>} />
        <Route path="/profile" element={<Home/>} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
