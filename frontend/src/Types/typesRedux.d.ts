type RootState = {
  auth: AuthState,
  dashboard: DashboardState
}

type AuthState = {
  isConnected: boolean,
  token: string | null,
  userConnected: User | null,
  newLogTime: number | null,
  toast: MutableRefObject<null> | null,
  allowPropositions: boolean
}

type DashboardState = {
  newExpense: number,
  maxExpensePercentage: number,
  data: ExpenseTypeSum[] | null
};