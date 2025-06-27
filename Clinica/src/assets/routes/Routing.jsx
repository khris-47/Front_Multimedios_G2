import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Index from '../pages/principales/Index'
import Login from '../pages/principales/Login'
import Mi_perfil from '../pages/principales/Mi_perfil'
import Doctores from '../pages/registros/Doctores'
import Categorias from '../pages/registros/Categorias'
import Departamentos from '../pages/registros/Departamentos'
import Lista_Usuarios from '../pages/registros/Lista_Usuarios'
import Auditoria_Citas from '../pages/registros/Auditoria_Citas'
import Auditoria_Doctores from '../pages/registros/Auditoria_Doctores'
import Citas_Espera from '../pages/registros/Citas_Espera'
import Citas_Aceptadas from '../pages/registros/Citas_Aceptadas'
import Citas_Usuario from '../pages/registros/Citas_Usuario'

import Medicamento from '../pages/registros/Medicamento'
import Compra_Medicamentos from '../pages/registros/Compra_Medicamentos'
import Factura from '../pages/registros/Factura'


function Routing() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/index" />} />
                    <Route path='/index' element={<Index/>}></Route>
                    <Route path='/login' element={<Login/>}></Route>
                    <Route path='/perfil' element={<Mi_perfil/>}></Route>
                    <Route path='/doctores' element={<Doctores/>}></Route>
                    <Route path='/categorias' element={<Categorias/>}></Route>
                    <Route path='/departamentos' element={<Departamentos/>}></Route>
                    <Route path='/list_usuarios' element={<Lista_Usuarios/>}></Route>
                    <Route path='/aud_citas' element={<Auditoria_Citas/>}></Route>
                    <Route path='/aud_doctores' element={<Auditoria_Doctores/>}></Route>
                    <Route path='/citas_espera' element={<Citas_Espera/>}></Route>
                    <Route path='/citas_aceptada' element={<Citas_Aceptadas/>}></Route>

                    <Route path='/citas_usuario' element={<Citas_Usuario/>}></Route>
                    <Route path='/pedir-cita' element={<Citas_Usuario />} />

                    <Route path='/medicamento' element={<Medicamento/>}></Route>
                    <Route path='/compra_medicamentos' element={<Compra_Medicamentos/>}></Route>
                    <Route path='/factura' element={<Factura/>}></Route>



            </Routes>
        </Router>
    )
}

export default Routing