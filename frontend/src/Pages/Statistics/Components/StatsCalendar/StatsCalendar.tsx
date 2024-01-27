import { useState } from "react";
import { fetchPost } from "../../../../Services/api";
import { Calendar } from "primereact/calendar";

interface Props {
  operationsData: Operation[] | null,
  updateData: (items: Operation[]) => void
}

const StatsCalendar = (props: Props) => {
  const [date, setDate] = useState<Date[] | null>(null)

  const filterByDate = async (rangeDate: Date[]) => {
    if (!rangeDate || !rangeDate[0] || !rangeDate[1]) return
    const body = {
      startDate: rangeDate[0],
      endDate: rangeDate[1]
    }

    const rangeData = await fetchPost('/operation/byDate', body)
    if (rangeData.error) return

    props.updateData(rangeData.data)
  }

  return (
    <>
      {date && !date[1] && <small className="p-error">Veuillez renseigner une date de fin</small>}
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
          if (!props.operationsData) return
          props.updateData(props.operationsData)
        }}
        view="month"
        dateFormat="mm/yy"
        placeholder="Choisissez une date"
        showIcon
        selectionMode="range"
        showButtonBar
      />
    </>
  );
};

export default StatsCalendar;