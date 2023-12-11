import { Calendar } from "primereact/calendar";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import "./Statistics.scss";
import {
  LineChart, Line,
  BarChart, Bar, Rectangle,
  // PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useEffect, useState } from "react";
import { fetchPost, useFetchGet } from "../../Services/api";
import { calculateData } from "../../Services/statistics";
import { orderByDate } from "../../Services/functions";
import { SelectButton } from 'primereact/selectbutton';

const Statistics = () => {
  const items = [
    { name: 'Lignes', value: 1 },
    { name: 'Barres', value: 2 },
    // { name: 'Camembert', value: 3 }
  ];

  const colorArray = [
    "#1F618D", "#148F77", "#D4AC0D", // Blue Sapphire, Mountain Meadow, Ochre
    "#AF601A", "#633974", "#BA4A00", // Rust, Dark Purple, Burnt Sienna
    "#3498DB", "#17A589", "#D35400", // Sky Blue, Shamrock, Pumpkin
    "#CB4335", "#7D6608", "#6C3483", // Mahogany, Olive Drab, Royal Purple
    "#1F618D", "#196F3D", "#D68910", // Blue Sapphire, Forest Green, Dark Orange
    "#922B21", "#5B2C6F", "#C27C0E"  // Sangria, Byzantine, Metallic Gold
  ]

  const operationsData = useFetchGet<Operation[]>("/operation")
  const [date, setDate] = useState<Date | Date[] | null>(null)
  const [data, setData] = useState<CalculatedGroupOP[] | undefined>(undefined)
  const [value, setValue] = useState(1);
  const [legends, setLegends] = useState<any>(null);

  useEffect(() => {
    if (operationsData.loaded && operationsData.data) {
      updateData(operationsData.data)
    }
    // eslint-disable-next-line
  }, [operationsData.loaded])

  const filterByDate = async (rangeDate: Date[]) => {
    if (!rangeDate || !rangeDate[0] || !rangeDate[1]) return
    const body = {
      startDate: rangeDate[0],
      endDate: rangeDate[1]
    }

    const rangeData = await fetchPost('/operation/byDate', body)
    if (rangeData.error) return

    updateData(rangeData.data)
  }

  const updateData = (data: Operation[]) => {
    const newData = orderByDate(data)
    const calculatedData = calculateData(newData)
    setData(calculatedData)
  }

  useEffect(() => {
    if (data) {
      const item: any = { ...data[0] }
      delete item.date

      Object.keys(item).forEach(key => {
        if (key === "Total") {
          item[key] = false;
        } else {
          item[key] = true;
        }
      });

      item.hover = null
      setLegends(item)
    }
  }, [data])

  const handleLegendMouseEnter = (e: any) => {
    if (!legends) return
    if (!legends[e.dataKey]) {
      setLegends({ ...legends, hover: e.dataKey });
    }
  };

  const handleLegendMouseLeave = () => {
    if (!legends) return
    setLegends({ ...legends, hover: null });
  };

  const selectBar = (e: any) => {
    if (!legends) return
    setLegends({
      ...legends,
      [e.dataKey]: !legends[e.dataKey],
      hover: null
    });
  };

  return (
    <>
      <Header title="Statistiques"></Header>
      <div className="statistics page">
        <Calendar
          value={date}
          onChange={(e) => {
            if (!e.value || !Array.isArray(e.value)) return

            const startDate = e.value[0] as Date;
            const endDate = e.value[1]
              ? new Date(e.value[1].getFullYear(), e.value[1].getMonth() + 1, 0)
              : null;

            startDate.setHours(startDate.getHours() + 6);
            endDate?.setHours(endDate.getHours() + 18);

            const rangeDates = endDate ? [startDate, endDate] : [startDate]

            setDate(rangeDates)
            filterByDate(rangeDates)
          }}
          onClearButtonClick={() => {
            setDate(null)
            if (!operationsData.data) return
            updateData(operationsData.data)
          }}
          view="month"
          dateFormat="mm/yy"
          placeholder="Choisissez une date"
          showIcon
          selectionMode="range"
          showButtonBar
        />
        <SelectButton
          value={value}
          onChange={(e) => setValue(e.value)}
          optionLabel="name"
          options={items}
        />
        <ResponsiveContainer width="100%" height={300}>
          {value === 1
            ? <LineChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis padding={{ bottom: 10, top: 10 }} />
              <Tooltip position={{ x: 0, y: 225 }} />
              <Legend
                onClick={selectBar}
                onMouseOver={handleLegendMouseEnter}
                onMouseOut={handleLegendMouseLeave}
              />
              {data && Object.keys(data[0])
                .filter((key) => key !== "date")
                .map((key, index) => (
                  <Line
                    type="monotone"
                    dataKey={key}
                    stroke={colorArray[index]}
                    activeDot={{ r: 8 }}
                    hide={legends && legends[key] === true}
                    fillOpacity={Number(
                      !legends || legends.hover === key || !legends.hover ? 1 : 0.2
                    )}
                    strokeOpacity={Number(
                      !legends || legends.hover === key || !legends.hover ? 1 : 0.2
                    )}
                  />
                ))}
            </LineChart>
            : <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip position={{ x: 0, y: 225 }} />
              <Legend
                onClick={selectBar}
                onMouseOver={handleLegendMouseEnter}
                onMouseOut={handleLegendMouseLeave}
              />
              {data && Object.keys(data[0])
                .filter((key) => key !== "date")
                .map((key, index) => (
                  <Bar
                    dataKey={key}
                    fill={colorArray[index]}
                    activeBar={<Rectangle fill="black" stroke="black" />}
                    hide={legends && legends[key] === true}
                    fillOpacity={Number(
                      !legends || legends.hover === key || !legends.hover ? 1 : 0.2
                    )}
                    strokeOpacity={Number(
                      !legends || legends.hover === key || !legends.hover ? 1 : 0.2
                    )}
                  />
                ))}
            </BarChart>
          }
        </ResponsiveContainer>
      </div >
      <NavBar></NavBar>
    </>
  );
};

export default Statistics;