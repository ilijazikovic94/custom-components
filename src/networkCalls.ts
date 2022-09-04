import axios, { ResponseType } from "axios"
import { hide, show } from "./loaderSlice"
import { store } from "./store"
import { Dictionary, GroupedUpdate, LotFile } from "./utils"

export let networkCallInProgress = false

const {REACT_APP_BACKEND_URL, STORYBOOK} = process.env

interface RequestParams {
  endpoint: string,
  body?: {},
  headers?: Dictionary,
  responseType?: ResponseType
}

const makeRequest = async ({endpoint, body, headers, responseType = 'json'}: RequestParams) => {
  const fullUrl = `${REACT_APP_BACKEND_URL}/${endpoint}`
  store.dispatch(show())
  if (STORYBOOK) {
    setTimeout(() => {
      console.log(`Simulating network call with these parameters:`)
      console.log('fullUrl:')
      console.log(fullUrl)
      console.log('body:')
      console.log(body)
    }, 1000)
    store.dispatch(hide())
  } else {
    const bearerToken = localStorage.getItem('token')
    let data
    try {
      const response = await axios.post(fullUrl, body, {responseType: responseType, headers: {'Authorization': `Basic ${bearerToken}`, ...headers}})
      data = response.data
    } catch (error: any) {
      if (error.response.status === 401) {
        localStorage.setItem('token', '')
      }
      throw error
    }
    store.dispatch(hide())
    if (data.failed) {
      throw new Error("Request failed!")
    }
    return data
  }
}

export const login = async ({username, password}: {username: string, password: string}) => {
  const bearerToken = btoa(`${username}:${password}`)
  localStorage.setItem('token', bearerToken)
  return makeRequest({endpoint: 'login'})
}

export const getComparables = async () =>
  makeRequest({endpoint: 'comparables'})

export const insertComparable = async (comparable: GroupedUpdate) =>
  makeRequest({
    endpoint: 'insertComparable',
    body: {comparable},
  })

export const updateComparables = async (updates: GroupedUpdate[]) =>
  makeRequest({
    endpoint: 'updateComparables',
    body: {updates},
  })

export const deleteComparable = async (inscriptionNumber: string): Promise<void> =>
  makeRequest({endpoint: 'deleteComparable', body: {inscriptionNumber}})

export const getLotFiles = async (lotNumber: string): Promise<LotFile[]> => makeRequest({
  endpoint: 'getLotFiles',
  body: {
    lotNumber: lotNumber,
  }
})

export const uploadLotFile = async (formData: FormData): Promise<LotFile> => makeRequest({
  endpoint: 'uploadLotFile',
  body: formData,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

export const getFile = async (s3Path: string): Promise<any> => makeRequest({
  endpoint: 'getFile',
  body: {s3Path},
  responseType: 'blob'
})

export const deleteLotFile = async (s3Path: string): Promise<string> => makeRequest({
  endpoint: 'deleteFile',
  body: {s3Path}
})
