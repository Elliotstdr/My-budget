import { Cell, LabelList, Pie, PieChart } from "recharts";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PieAccueil = () => {
  const navigate = useNavigate()
  const dashboard = useSelector((state: RootState) => state.dashboard);

  return (
    <div className="pieAccueil">
      <div className="my-2 font-[500] text-base main-color md:text-xl md:font-bold">
        Ta plus grosse dépense du mois :
      </div>
      {dashboard.data ?
        <div className="flex items-center h-40 md:w-1/2 min-[420px]:h-52 min-[500px]:h-64">
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
          {dashboard.data && <div className="md:text-sm md:w-24" style={{ maxWidth: "40%" }}>
            {`Tu as dépensé ${dashboard.maxExpensePercentage}% de ton budget dans le poste de dépense "${dashboard.data[0].name}"`}
          </div>}
        </div>
        : <div className="h-44 flex flex-col justify-center text-center text-base md:w-1/2">
          Tu n'as pas encore saisi de dépenses ce mois ci !
          <span className="cursor-pointer underline third-color" onClick={() => navigate("/import")}>C'est parti ?</span>
        </div>
      }
    </div>
  );
};

export default PieAccueil;