import "./Debt.scss";
import image from "../../../assets/tirelire-blue.png";
import { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { Divider } from "primereact/divider";
import { useFetchGet } from "../../../Services/api";
import DebtCard from "./DebtCard/DebtCard";
import { useScreenSize } from "../../../Services/useScreenSize";
import DebtForm from "./DebtForm/DebtForm";

const Debt = () => {
  const debtData = useFetchGet<Debt[]>("/debt")
  const [visibleForm, setVisibleForm] = useState(false)
  const [debts, setDebts] = useState<Debt[]>([])
  const windowSize = useScreenSize()

  useEffect(() => {
    if (debtData.loaded && debtData.data) {
      setDebts(debtData.data)
      debtData.data.length === 0 && setVisibleForm(true)
    }
    // eslint-disable-next-line
  }, [debtData.loaded])

  return (
    <div className='debt'>
      <div>
        <div className="import__top">
          <img src={image} alt="background home" />
          <span className="text">Renseigne ici tes différentes créances avec tes proches</span>
        </div>
        <div className={`debt__showForm ${visibleForm}`} onClick={() => setVisibleForm(!visibleForm)}>
          <FaAngleRight /> Ajouter une créance
        </div>
        <DebtForm visibleForm={visibleForm} setDebts={setDebts}></DebtForm>
      </div>
      <Divider layout={windowSize.width > 900 ? "vertical" : "horizontal"}></Divider>
      <div className="debt__container">
        {debts.map((x) =>
          <DebtCard
            key={x._id}
            debt={x}
            setDebts={setDebts}
          ></DebtCard>
        )}
      </div>
    </div>
  );
};

export default Debt;