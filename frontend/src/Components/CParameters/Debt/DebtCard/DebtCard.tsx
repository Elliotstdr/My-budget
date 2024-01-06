import "./DebtCard.scss";
import { fetchDelete } from "../../../../Services/api";
import { errorToast, formatMonthYear } from "../../../../Services/functions";

interface Props {
  debt: Debt
  setDebts: React.Dispatch<React.SetStateAction<Debt[]>>
}

const DebtCard = (props: Props) => {
  const deleteDebt = async (id: string) => {
    const res = await fetchDelete(`/debt/${id}`)
    if (res.error) {
      errorToast(res)
      return
    }
    props.setDebts((prev) => prev.filter((x) => x._id !== id))
  }

  return (
    <div className='debtcard'>
      <div className="debtcard__left">
        <div className="debtcard__left__top">
          <div className="title" title={props.debt.title}>
            {props.debt.title}
          </div>
        </div>
        <div className="debtcard__left__bottom">
          <div className="target">
            <div className="pi pi-user"></div> {props.debt.target}
          </div>
          <div className="value">
            <div className="pi pi-euro"></div> {props.debt.value}
          </div>
          {props.debt.dueDate && <div className="date">
            <div className="pi pi-clock"></div> {formatMonthYear(props.debt.dueDate)}
          </div>}
        </div>
      </div>
      <div className="debtcard__right">
        <div
          className="pi pi-trash"
          style={{ cursor: "pointer" }}
          onClick={() => deleteDebt(props.debt._id)}
        ></div>
      </div>
    </div>
  );
};

export default DebtCard;