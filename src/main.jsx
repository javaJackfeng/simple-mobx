import React from 'react'
import ReactDOM from 'react-dom/client'
import { observable, autorun } from "./mobx/index"
import App from './App'

const proxyObj = observable({ name: "1" })

autorun(() => {
  console.log("name", proxyObj.name);
})

console.log(proxyObj)

proxyObj.name = 2

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
