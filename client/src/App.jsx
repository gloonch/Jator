import './App.css'
import {Route, Routes} from "react-router-dom";
import IndexPage from "./pages/IndexPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Layout from "./Layout.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import axios from "axios";
import {UserContextProvide} from "./UserContext.jsx";
import AccountPage from "./pages/AccountPage.jsx";

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {

  return (
      <UserContextProvide>
          <Routes>
              <Route path={'/'} element={<Layout />} >
                  <Route index element={<IndexPage />} />
                  <Route path='/login' element={<LoginPage />} />
                  <Route path='/register' element={<RegisterPage />} />
                  <Route path='/account/:subpage?' element={<AccountPage />} />

              </Route>
          </Routes>
      </UserContextProvide>
  )
}

export default App
