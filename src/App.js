import React from "react";
import "./App.scss";
import Header from "./Component/Header";
import HeaderAdmin from "./Component/admin/Header";
import Footer from "./Component/Footer";
import Home from "./Pages/Home";
import {Route, Routes} from "react-router-dom";
import Contests from "./Pages/Contests";
import Account from "./Pages/Account"
import About from "./Pages/about/AboutUs";
import Members from "./Pages/Members"
import usePosts from "./API/usePosts";
import usePerson from './API/usePerson';
import Table from "./Pages/tables/Table";
import Journals from "./Pages/journals/Journals";
import useManager from "./API/useManager";

export const MyContext = React.createContext([]);

// userId не работает , может надо исправить проверку , позже разобраться

function App() {
    const { events , loading : loadingMyEvent } = usePosts()
    const { person: topPerson , isloading : isloadingTop} = usePerson();
    const { person: homePerson, isloading : isloadingPersHome}  = usePerson({amount: 3})
    const {manager , isloading : isloadingMng} = useManager()
    const [userId,setUserId] = React.useState(1)

    const [ userActive , setUserActive ] = React.useState(true)

    return (
        <MyContext.Provider value={{events, userId , topPerson, manager , homePerson , loadingMyEvent , isloadingPersHome ,  isloadingTop , isloadingMng, userActive}}>
            <div className="App">

                {/*<Header/>*/}
                <HeaderAdmin/>
                <Header setUserActive={setUserActive}/>
                <div className="Content">
                    <Routes>
                        <Route path={"/admin/journal"} element={<Table/>}/>
                        <Route path={"/admin/journals"} element={<Journals/>}/>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/contests" element={<Contests/>}/>
                        <Route path="/about-us" element={<About/>}/>
                        <Route path="/participants" element={<Participants/>}/>
                        <Route path="/profile" element={<Account/>}/>
                        {/*<Route path="/" element={<HeaderAdmin/>}/>*/}
                        <Route path="/members" element={<Members/>}/>
                        <Route path="/profile" element={<Account setUserActive={setUserActive} setUserId = {setUserId}/>}/>
                    </Routes>
                </div>
                <Footer/>
            </div>
        </MyContext.Provider>
    );
}

export default App;
