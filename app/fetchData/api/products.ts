import axios from 'axios'

export const getAllProducts = () =>
  axios.get('https://dummyjson.com/products?limit=0&skip=0').then((res) => res.data)

export const getAllProductById = (id: number) =>
  axios.get(`https://dummyjson.com/products/${id}`).then((res) => res.data)

export const getAllProductByCategory = (query: string) =>
  axios.get(`https://dummyjson.com/products/search?q=${query}`).then((res) => res.data)

// export const getAllProductByTitle = (limit: number, skip: number, title?: string, price?: number) =>
//   axios
//     .get(
//       `https://dummyjson.com/products?limit=${limit}&skip=${skip}&select=${title},price=${price}`
//     )
//     .then((res) => res.data)
