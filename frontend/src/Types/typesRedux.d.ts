type RootState = {
  auth: AuthState,
  dashboard: DashboardState
  stats: StatsState
  loan: LoanState
  salary: SalaryState
}

type AuthState = {
  isConnected: boolean,
  token: string | null,
  userConnected: User | null,
  newLogTime: number | null,
  toast: MutableRefObject<null> | null
}

type DashboardState = {
  newExpense: number,
  maxExpensePercentage: number,
  data: ExpenseTypeSum[] | null
};

type StatsState = {
  date: Date[] | null,
  detailSelectValue: number,
  absolute: boolean,
  showAllLegends: boolean,
  legends: Legends | null
}

type LoanState = {
  capital: number,
  time: number,
  interest: number,
  monthCost: number,
  fullCost: number
}

type SalaryState = {
  salaireBrut: number,
  estCadre: boolean
}