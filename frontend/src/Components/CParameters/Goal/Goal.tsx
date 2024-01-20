import "./Goal.scss";
import image from "../../../assets/tirelire-blue.png";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_USER_CONNECTED } from "../../../Store/Reducers/authReducer";
import { fetchPut } from "../../../Services/api";

const Goal = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const updateUserConnected = (value: Partial<User>) => {
    dispatch({ type: UPDATE_USER_CONNECTED, value });
  };
  const [date, setDate] = useState<Date[] | null>(auth.userConnected?.goalPeriod?.length === 2
    ? [new Date(auth.userConnected.goalPeriod[0]), new Date(auth.userConnected.goalPeriod[1])]
    : null
  )
  const [goal, setGoal] = useState<string>(auth.userConnected?.goal?.toString() || "")

  const editAllowStatus = async () => {
    if (!auth.userConnected) return

    const payload = { allowGoal: !auth.userConnected.allowGoal }

    const newUser = await fetchPut(`/user/${auth.userConnected._id}`, payload)
    if (newUser.data) updateUserConnected(payload)
  }

  const editGoal = async () => {
    if (!auth.userConnected) return

    if (!goal || auth.userConnected?.goal === goal) {
      setGoal(auth.userConnected?.goal || "")
      return
    }

    const newUser = await fetchPut(`/user/${auth.userConnected._id}`, { goal: goal })
    if (newUser.data) updateUserConnected({ goal: goal })
  }

  const editGoalPeriod = async (dates: Date[] | null) => {
    if (!auth.userConnected || (dates && dates.length !== 2)) return

    const newUser = await fetchPut(`/user/${auth.userConnected._id}`, { goalPeriod: dates })
    if (newUser.data) updateUserConnected({ goalPeriod: dates || undefined })
  }

  return (
    <div className='goal'>
      <div className="import__top">
        <img src={image} alt="background home" />
        <span className="text">Renseigne ici un objectif d'épargne qui te suivra dans tes analyses !</span>
      </div>
      <div className="goal__field">
        <label>Combien tu veux épargner ?</label>
        <InputText
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="1000€"
          className="goal__field-goal"
          keyfilter="num"
          onBlur={() => editGoal()}
        />
      </div>
      {date && !date[1] && <small className="p-error">Veuillez renseigner une date de fin</small>}
      <div className="goal__field">
        <label>Sur quelle période ?</label>
        <Calendar
          value={date}
          onChange={(e) => {
            if (!e.value || !Array.isArray(e.value)) {
              editGoalPeriod(null)
              return
            }

            const startDate = e.value[0] as Date;
            const endDate = e.value[1]
              ? new Date(e.value[1].getFullYear(), e.value[1].getMonth() + 1, 0)
              : null;

            startDate.setHours(startDate.getHours() + 6);
            endDate?.setHours(endDate.getHours() + 18);

            const rangeDates = endDate ? [startDate, endDate] : [startDate]

            setDate(rangeDates)
            editGoalPeriod(rangeDates)
          }}
          onClearButtonClick={() => {
            setDate(null)
          }}
          view="month"
          dateFormat="mm/yy"
          placeholder="Choisissez une date"
          showIcon
          selectionMode="range"
          showButtonBar
        />
      </div>
      <div className="goal__field switch">
        {auth.userConnected && <InputSwitch
          checked={auth.userConnected.allowGoal}
          onChange={() => editAllowStatus()}
        />}
        <span>Intégrer l'objectif à mes stats</span>
      </div>
    </div>
  );
};

export default Goal;