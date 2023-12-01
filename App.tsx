import React from 'react'
import './App.css'
import { Recorder } from './components/Recorder'

import {Box} from '@mui/material'

function App() {

  return (
    <Box width={"100%"} height={'100vh'} display={"flex"}  justifyContent={"center"} alignItems={"center"} >
      <Recorder/>
    </Box>
  )
}

export default App
