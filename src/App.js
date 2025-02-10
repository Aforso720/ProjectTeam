import React from "react";
import "./App.scss";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import Home from "./Pages/Home";
import { Routes, Route } from "react-router-dom";
import Contests from "./Pages/Contests";
import Account from "./Pages/Account"
import Participants from "./Pages/Participants"
import usePosts from "./API/usePosts";
import usePerson from './API/usePerson';

export const MyContext = React.createContext([]);

function App() {
  const events = usePosts()
  const person = usePerson()

  return (
    <MyContext.Provider value={{events,person}}>
      <div className="App">
        <Header />
        <div className="Content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contests" element={<Contests />} />
            <Route path="/about-us" element={<Home />} />
            <Route path="/participants" element={<Participants/>}/>
            <Route path="/profile" element={<Account/>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </MyContext.Provider>
  );
}

export default App;
