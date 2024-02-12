import "./Goal.scss";
import image from "src/assets/tirelire-blue.png";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { InputSwitch } from "primereact/inputswitch";
import { useDispatch, useSelector } from "react-redux";
import { fetchPut } from "../../../../Services/api";
import GoalCalendar from "./GoalCalendar/GoalCalendar";
import { updateUserConnected } from "../../../../Store/Reducers/authReducer";

const Goal = () => {
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth);
  const [date, setDate] = useState<Date[] | null>(auth.userConnected?.goalPeriod?.length === 2
    ? [new Date(auth.userConnected.goalPeriod[0]), new Date(auth.userConnected.goalPeriod[1])]
    : null
  )
  const [goal, setGoal] = useState<string>(auth.userConnected?.goal?.toString() || "")

  const editAllowStatus = async () => {
    if (!auth.userConnected) return

    const payload = { allowGoal: !auth.userConnected.allowGoal }

    const newUser = await fetchPut(`/user/${auth.userConnected._id}`, payload)
    if (newUser.data) dispatch(updateUserConnected(payload))
  }

  const editGoal = async () => {
    if (!auth.userConnected) return

    if (!goal || auth.userConnected?.goal === goal) {
      setGoal(auth.userConnected?.goal || "")
      return
    }

    const newUser = await fetchPut(`/user/${auth.userConnected._id}`, { goal: goal })
    if (newUser.data) dispatch(updateUserConnected({ goal: goal }))
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
        <GoalCalendar date={date} setDate={setDate}></GoalCalendar>
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