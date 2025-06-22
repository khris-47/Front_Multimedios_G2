import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Index from '../pages/principales/Index'
import Login from '../pages/principales/Login'
import Mi_perfil from '../pages/principales/Mi_perfil'


function Routing() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/index" />} />
                    <Route path='/index' element={<Index/>}></Route>
                    <Route path='/login' element={<Login/>}></Route>
                    <Route path='/perfil' element={<Mi_perfil/>}></Route>

            </Routes>
        </Router>
    )
}

export default Routing