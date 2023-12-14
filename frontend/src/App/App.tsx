import './App.scss'
import Accueil from '../Pages/Accueil/Accueil'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Import from '../Pages/Import/Import';
import Statistics from '../Pages/Statistics/Statistics';
import Tools from '../Pages/Tools/Tools';
import History from '../Pages/History/History';
import Login from '../Pages/Login/Login';
import Parameters from '../Pages/Parameters/Parameters';
import { Toast } from "primereact/toast";
import { useEffect, useRef } from 'react';
import { UPDATE_AUTH } from '../Store/Reducers/authReducer';
import ImportManuel from '../Components/CImport/ImportManuel/ImportManuel';
import ImportCSV from '../Components/CImport/ImportCSV/ImportCSV';
import CreateType from '../Components/CImport/CreateType/CreateType';

function App() {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const updateAuth = (value: Partial<AuthState>) => {
    dispatch({ type: UPDATE_AUTH, value });
  };
  const toast = useRef(null);

  useEffect(() => {
    updateAuth({
      toast: toast,
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div className='app' id='app'>
      <BrowserRouter>
        <Toast ref={toast}></Toast>
        <Routes>
          <Route path="/" element={auth.isConnected ? <Accueil /> : <Login />}></Route>
          {auth.isConnected && (
            <>
              <Route path="/import" element={<Import />}></Route>
              <Route path="/import/manual" element={<ImportManuel />}></Route>
              <Route path="/import/csv" element={<ImportCSV />}></Route>
              <Route path="/import/type" element={<CreateType />}></Route>
              <Route path="/statistics" element={<Statistics />}></Route>
              <Route path="/tools" element={<Tools />}></Route>
              <Route path="/history" element={<History />}></Route>
              <Route path="/parameters" element={<Parameters />}></Route>
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
