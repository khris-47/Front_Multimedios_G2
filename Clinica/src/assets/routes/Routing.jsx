import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Index from '../pages/principales/Index'
import Login from '../pages/principales/Login'
import Mi_perfil from '../pages/principales/Mi_perfil'
import Doctores from '../pages/registros/Doctores'


function Routing() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/index" />} />
                    <Route path='/index' element={<Index/>}></Route>
                    <Route path='/login' element={<Login/>}></Route>
                    <Route path='/perfil' element={<Mi_perfil/>}></Route>
                    <Route path='/doctores' element={<Doctores/>}></Route>
                
            </Routes>
        </Router>
    )
}

export default Routing