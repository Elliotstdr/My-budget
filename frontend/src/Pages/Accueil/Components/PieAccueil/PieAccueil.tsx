import { Cell, LabelList, Pie, PieChart } from "recharts";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import './PieAccueil.scss'

const PieAccueil = () => {
  const navigate = useNavigate()
  const dashboard = useSelector((state: RootState) => state.dashboard);

  return (
    <div className="pieAccueil">
      <div className="title">Ta plus grosse dépense du mois :</div>
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
          {dashboard.data && <div className="legend" style={{ maxWidth: "40%" }}>
            {`Tu as dépensé ${dashboard.maxExpensePercentage}% de ton budget dans le poste de dépense "${dashboard.data[0].name}"`}
          </div>}
        </div>
        : <div className="accueil__body__noexpense">
          Tu n'as pas encore saisi de dépenses ce mois ci !
          <span onClick={() => navigate("/import")}>C'est parti ?</span>
        </div>
      }
    </div>
  );
};

export default PieAccueil;