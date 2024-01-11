import image from "../../assets/tirelire-blue.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "../../Utils/Box/Box";
import { CiImport } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import { rangeTiretDate } from "../../Services/functions";
import { fetchPost } from "../../Services/api";
import { useEffect } from "react";
import {
  PieChart, Pie, Cell, LabelList
} from 'recharts';
import { UPDATE_DASHBOARD } from "../../Store/Reducers/dashboardReducer";
import Header from "../../Components/Header/Header";
import Accueil1 from "../../assets/Accueil3.jpg"
import Accueil2 from "../../assets/Accueil2.png"
import Bouton from "../../Utils/Bouton/Bouton";

const AccueilDesktop = () => {
  const navigate = useNavigate()
  // const auth = useSelector((state: RootState) => state.auth);
  const dashboard = useSelector((state: RootState) => state.dashboard);
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
      <Header title="Accueil"></Header>
      <div className="accueil__desktop page">
        <div
          className="accueil__desktop__bandeau"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${Accueil1})` }}
        >
          <div className="accueil__desktop__bandeau__encart">
            <img className="logo" src={image} alt="" />
            <div className="block">
              <div>Bonjour Elliot,</div>
              <span>Heureux de te revoir !</span>
            </div>
          </div>
        </div>
        <div className="accueil__desktop__body">
          <div className="white--zone">
            <div className="sentence">Fais le point sur tes dépenses du mois </div>
            <span className="main">{`${dashboard.newExpense}€`}</span>
            <span className="sub">dépensés ce mois ci !</span>
            <Bouton
              btnTexte="Accéder aux statistiques"
              btnAction={() => navigate("/statistics")}
              color="pink"
            ></Bouton>
          </div>
          <div className="accueil__desktop__body__right">
            <div className="title">Accès rapide</div>
            <div className="accueil__desktop__body__right__boxes">
              <Box
                text="Import fichier"
                icon={<CiImport></CiImport>}
                action={() => navigate("/import/csv")}
                width="100%"
                height="120px"
              ></Box>
              <Box
                text="Saisie manuelle"
                icon={<TbHandClick></TbHandClick>}
                action={() => navigate("/import/manual")}
                width="100%"
                height="120px"
              ></Box>
            </div>
          </div>
        </div>
        <div className="accueil__desktop__bottom" style={{ backgroundImage: `url(${Accueil2})` }}>
          <div className="second">
            <div className="title">Ta plus grosse dépense du mois :</div>
            {dashboard.data ?
              <div className="accueil__desktop__bottom__pie">
                <PieChart width={300} height={300}>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={dashboard.data}
                    fill="#8884d8"
                  >
                    <LabelList
                      dataKey="name"
                      style={{ fontSize: "20px" }}
                      textAnchor="bottom"
                      fill="#fff"
                    />
                    {dashboard.data &&
                      <>
                        <Cell key={dashboard.data[0].value} fill="var(--third-color)" />
                        <Cell key={dashboard.data[1].value} fill="var(--second-color)" />
                      </>
                    }
                  </Pie>
                </PieChart>
                {dashboard.data && <div className="legend">
                  {`Tu as dépensé ${dashboard.maxExpensePercentage}% de ton budget dans le poste de dépense "${dashboard.data[0].name}"`}
                </div>}
              </div>
              : <div className="accueil__body__noexpense">
                Tu n'as pas encore saisi de dépenses ce mois ci !
                <span onClick={() => navigate("/import")}>C'est parti ?</span>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default AccueilDesktop;