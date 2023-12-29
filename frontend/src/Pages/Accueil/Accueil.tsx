import NavBar from "../../Components/NavBar/NavBar";
import "./Accueil.scss";
import image from "../../assets/tirelire-blue.png";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Box from "../../Utils/Box/Box";
import { RiMoneyEuroCircleLine, RiBankFill } from "react-icons/ri";
import { rangeTiretDate } from "../../Services/functions";
import { fetchPost } from "../../Services/api";
import { useEffect } from "react";
import {
  PieChart, Pie, Cell, LabelList
} from 'recharts';
import { UPDATE_DASHBOARD } from "../../Store/Reducers/dashboardReducer";

const Accueil = () => {
  const navigate = useNavigate()
  const auth = useSelector((state: RootState) => state.auth);
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
      if (res.error) return

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
      <div className="accueil page">
        <div className="blue--zone">
          <div className="blue--zone__left">
            <img src={image} alt="background home" />
            <div className="blue--zone__left__text">
              <span className="main">{`Bonjour ${auth.userConnected?.username}`}</span>
              <span className="sub">Heureux de te revoir !</span>
            </div>
          </div>
          <div
            className="blue--zone__right"
            onClick={() => navigate("/parameters")}
          >
            <FaUserCog></FaUserCog>
          </div>
        </div>
        <div className="white--zone">
          <span className="main">{`${dashboard.newExpense}€`}</span>
          <span className="sub">dépensés ce mois ci !</span>
        </div>
        <div className="accueil__body">
          <div className="first">
            <div className="title">Accès rapide</div>
            <div className="accueil__body__boxes">
              <Box
                text="Salaire brut/net"
                icon={<RiMoneyEuroCircleLine></RiMoneyEuroCircleLine>}
                action={() => navigate("/tools/salary")}
                width="8rem"
              ></Box>
              <Box
                text="Capacité d'emprunt"
                icon={<RiBankFill></RiBankFill>}
                action={() => navigate("/tools/loan")}
                width="8rem"
              ></Box>
            </div>
          </div>
          <div className="second">
            <div className="title">Plus grosses dépenses du mois</div>
            {dashboard.data ?
              <div className="accueil__body__pie">
                <PieChart width={300} height={300}>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={dashboard.data}
                    fill="#8884d8"
                  >
                    <LabelList
                      dataKey="name"
                      style={{ fontSize: "16px" }}
                      textAnchor="bottom"
                    />
                    {dashboard.data &&
                      <>
                        <Cell key={dashboard.data[0].value} fill="#3e6fd4" />
                        <Cell key={dashboard.data[1].value} fill="#db8bb5" />
                      </>
                    }
                  </Pie>
                </PieChart>
                {dashboard.data && <div style={{ maxWidth: "40%" }}>
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
      <NavBar></NavBar>
    </>
  );
};

export default Accueil;