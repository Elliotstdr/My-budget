type TreatedOperation = {
  date: string,
  valeur: string | number,
  nom: string,
  type?: string
}

type DynamicStringObject = {
  [key: string]: any;
};

type ExpenseTypeSum = {
  name: string,
  value: number
}