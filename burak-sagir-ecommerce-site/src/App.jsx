import { useState } from 'react'
import './App.css'
import ProductGrid from './components/ProductGrid'
import Header from './components/Header'
import RouterConfig from './config/RouterConfig'

function App() {

  return (
    <>
      <Header />
      <RouterConfig />
    </>
  )
}

export default App
