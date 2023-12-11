type UseFetchGetResponse<T> = {
  data: T | null,
  error: string,
  loaded: boolean
}

type FetchResponse = {
  data: any,
  error: any
}