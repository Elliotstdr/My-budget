import { store } from "../Store/store";

export const successToast = (message: string, summary: string = "Succès") => {
  const reduxStore = store.getState();
  reduxStore.auth.toast.current.show({
    severity: "success",
    summary: `${summary} : `,
    detail: message,
    life: 3000,
  });
};

export const errorToast = (message: string | FetchResponse, summary: string = "Erreur") => {
  let finalMessage = ""
  if(typeof message === "string") {
    finalMessage = message
  } else {
    finalMessage = message?.error?.response?.data?.message
      ? message.error.response.data.message
      : "Une erreur est survenue"
  }
  const reduxStore = store.getState();
  reduxStore.auth.toast.current.show({
    severity: "error",
    summary: `${summary} : `,
    detail: finalMessage,
    life: 3000,
  });
};

export const rangeTiretDate = (date: Date) => {
  if(!date) return null
  const year = date.getFullYear();
  const month = date.getMonth() + 1
  const nextMonth = date.getMonth() + 2

  return {
    startDate: year + "-" + month + "-" + 1, 
    endDate: year + "-" + nextMonth + "-" + 1
  }
}

export const literalMonthAndYear = (date: Date) => {
  if(!date) return
  const month = date.toLocaleString('default', { month: 'long' })
  const year = date.getFullYear()

  return month + " " + year
}

export const formatMonthYear = (date: Date) => {
  const newDate = new Date(date);
    // Extraire le mois et l'année (au format "MM-YYYY")
  const monthKey = `${(newDate.getMonth() + 1).toString().padStart(2, '0')}-${newDate.getFullYear()}`;

  return monthKey
}

export const formatYearMonth = (date: Date) => {
  const newDate = new Date(date);
    // Extraire le mois et l'année (au format "MM-YYYY")
  const monthKey = `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, '0')}`;

  return monthKey
}

export const orderByDate = (data: Operation[]) => {
  return data.sort((a, b) => {
    const aDate = formatMonthYear(a.datePeriod)
    const bDate = formatMonthYear(b.datePeriod)

    return aDate.localeCompare(bDate)
  })
}