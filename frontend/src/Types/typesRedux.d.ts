interface RootState {
  auth: AuthState,
}

interface AuthState {
  isConnected: boolean,
  token: string | null,
  userConnected: User | null,
  newLogTime: number | null,
  toast: MutableRefObject<null> | null
}