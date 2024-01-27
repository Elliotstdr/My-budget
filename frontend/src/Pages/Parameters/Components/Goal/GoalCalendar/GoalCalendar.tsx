import { useDispatch, useSelector } from "react-redux";
import { fetchPut } from "../../../../../Services/api";
import "./GoalCalendar.scss";
import { Calendar } from "primereact/calendar";
import { UPDATE_USER_CONNECTED } from "../../../../../Store/Reducers/authReducer";

interface Props {
  date: Date[] | null,
  setDate: React.Dispatch<React.SetStateAction<Date[] | null>>
}

const GoalCalendar = (props: Props) => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const updateUserConnected = (value: Partial<User>) => {
    dispatch({ type: UPDATE_USER_CONNECTED, value });
  };

  const editGoalPeriod = async (dates: Date[] | null) => {
    if (!auth.userConnected || (dates && dates.length !== 2)) return

    const newUser = await fetchPut(`/user/${auth.userConnected._id}`, { goalPeriod: dates })
    if (newUser.data) updateUserConnected({ goalPeriod: dates || undefined })
  }

  return (
    <Calendar
      value={props.date}
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

        props.setDate(rangeDates)
        editGoalPeriod(rangeDates)
      }}
      onClearButtonClick={() => {
        props.setDate(null)
      }}
      view="month"
      dateFormat="mm/yy"
      placeholder="Choisissez une date"
      showIcon
      selectionMode="range"
      showButtonBar
    />
  );
};

export default GoalCalendar;