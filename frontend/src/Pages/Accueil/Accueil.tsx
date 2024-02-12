import NavBar from "../../Components/NavBar/NavBar";
import { rangeTiretDate } from "../../Services/functions";
import { fetchPost } from "../../Services/api";
import { useEffect } from "react";
import AccueilDesktop from "./AccueilDesktop/AccueilDesktop";
import { useScreenSize } from "../../Services/useScreenSize";
import AccueilMobile from "./AccueilMobile/AccueilMobile";
import Header from "../../Components/Header/Header";
import { useDispatch } from "react-redux";
import { updateDashboard } from "../../Store/Reducers/dashboardReducer";

const Accueil = () => {
  const dispatch = useDispatch()
  const windowSize = useScreenSize()

  useEffect(() => {
    const getCurrentExpense = async () => {
      const payload = rangeTiretDate(new Date)
      if (!payload) return

      const res = await fetchPost(`/operation/dashboard`, payload);
      if (res.error) {
        dispatch(updateDashboard({
          newExpense: 0,
          data: null,
          maxExpensePercentage: 0
        }))
        return
      }

      dispatch(updateDashboard({
        newExpense: res.data.newExpense,
        data: res.data.data,
        maxExpensePercentage: res.data.maxExpensePercentage
      }))
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