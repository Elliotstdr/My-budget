type RootState = {
  auth: AuthState,
}

type AuthState = {
  isConnected: boolean,
  token: string | null,
  userConnected: User | null,
  newLogTime: number | null,
  toast: MutableRefObject<null> | null,
  allowPropositions: boolean
}