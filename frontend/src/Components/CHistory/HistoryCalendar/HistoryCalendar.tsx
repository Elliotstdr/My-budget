import { Calendar } from 'primereact/calendar';
import { useFetchGet } from "../../../Services/api";
import { useScreenSize } from "../../../Services/useScreenSize";
import { SetStateAction, useState } from "react";
import './HistoryCalendar.scss'

type Props = {
  setOperations: React.Dispatch<SetStateAction<Operation[]>>
}

const HistoryCalendar = (props: Props) => {
  const operationsData = useFetchGet<Operation[]>("/operation")
  const [date, setDate] = useState<Date | null | undefined>(null)
  const windowSize = useScreenSize()

  const filterByDate = (date: Date) => {
    if (!operationsData.data) return
    const monthFilter = date.getMonth()
    const yearFilter = date.getFullYear()

    const tempOperations: Operation[] = operationsData.data.filter((x) => {
      const operationDate = new Date(x.datePeriod);
      if (operationDate.getFullYear() === yearFilter && operationDate.getMonth() === monthFilter) return x
    })

    props.setOperations(tempOperations)
  }

  return (
    <Calendar
      value={date}
      onChange={(e) => {
        if (!e.value && operationsData.data) {
          setDate(null)
          props.setOperations(operationsData.data)
          return
        }
        const newDate = e.value as Date;
        newDate.setHours(newDate.getHours() + 12);
        setDate(newDate)
        filterByDate(newDate)
      }}
      view="month"
      dateFormat="mm/yy"
      placeholder="Choisissez une date"
      showIcon={windowSize.width < 900}
      showButtonBar
      inline={windowSize.width >= 900}
    />
  );
};

export default HistoryCalendar;