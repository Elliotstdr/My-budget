import NavBar from "../../Components/NavBar/NavBar";
import { useDispatch } from "react-redux";
import { rangeTiretDate } from "../../Services/functions";
import { fetchPost } from "../../Services/api";
import { useEffect } from "react";
import { UPDATE_DASHBOARD } from "../../Store/Reducers/dashboardReducer";
import AccueilDesktop from "./AccueilDesktop/AccueilDesktop";
import { useScreenSize } from "../../Services/useScreenSize";
import AccueilMobile from "./AccueilMobile/AccueilMobile";
import Header from "../../Components/Header/Header";

const Accueil = () => {
  const windowSize = useScreenSize()
  const dispatch = useDispatch();
  const updateDashboard = (value: Partial<DashboardState>) => {
    dispatch({ type: UPDATE_DASHBOARD, value });
  };

  useEffect(() => {
    const getCurrentExpense = async () => {
      const payload = rangeTiretDate(new Date)
      if (!payload) return

      const res = await fetchPost(`/operation/dashboard`, payload);
      if (res.error) {
        updateDashboard({
          newExpense: 0,
          data: null,
          maxExpensePercentage: 0
        })
        return
      }

      updateDashboard({
        newExpense: res.data.newExpense,
        data: res.data.data,
        maxExpensePercentage: res.data.maxExpensePercentage
      })
    }

    getCurrentExpense()
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {windowSize.width >= 900 && <Header title="Accueil" className="header-accueil"></Header>}
      {windowSize.width < 900
        ? <AccueilMobile></AccueilMobile>
        : <AccueilDesktop></AccueilDesktop>
      }
      <NavBar></NavBar>
    </>
  );
};

export default Accueil;