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
import ImportManuel from '../Pages/Import_Manual/ImportManuel';
import ImportCSV from '../Pages/Import_CSV/ImportCSV';
import CreateType from '../Pages/Import_Types/CreateType';
import { checkActivity, checkToken, timer } from '../Services/refreshToken';
import Salary from '../Pages/Tools_Salary/Salary';
import Loan from '../Pages/Tools_Loan/Loan';

function App() {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const updateAuth = (value: Partial<AuthState>) => {
    dispatch({ type: UPDATE_AUTH, value });
  };
  const toast = useRef(null);
  const interval = useRef<any>(0);

  useEffect(() => {
    if (auth.isConnected) {
      interval.current = setInterval(() => {
        checkToken();
      }, timer); // Commence toutes les minutes l'écoute si connecté
    } else {
      clearInterval(interval.current);
      interval.current = 0; // Stoppe l'écoute si déco
    }
    return () => {
      clearInterval(interval.current);
      interval.current = 0;
    }; // Stoppe l'écoute si quitte la page

    // eslint-disable-next-line
  }, [auth.isConnected, auth.token]);

  // Au chargement de la page : vérifie l'activité de l'utilisateur, le token et set le toast
  useEffect(() => {
    if (!auth.isConnected && window.location.pathname !== "/") window.location.replace("/")
    checkActivity();
    if (auth.isConnected) checkToken()
    updateAuth({ toast: toast });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!auth.isConnected && window.location.pathname !== "/") window.location.replace("/")
  }, [auth.isConnected])

  return (
    <div className={`app ${auth.isConnected}`} id='app' onClick={() => checkActivity()}>
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
              <Route path="/tools/salary" element={<Salary />}></Route>
              <Route path="/tools/loan" element={<Loan />}></Route>
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
