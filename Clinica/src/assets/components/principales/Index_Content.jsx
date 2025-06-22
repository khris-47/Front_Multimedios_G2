import React from 'react'
import '../../styles/Menu_Index.css'
import Navbar from '../navegacion/Navbar_Content';


function Index_Content() {
  return (
    <div className="landing-body">

      {/* NavBar */}
      <Navbar></Navbar>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-container">
          <div className="landing-hero-text">
            <h1>OFRECEMOS LA MEJOR<br />ATENCIÓN MÉDICA</h1>
            <p>
              Nuestros doctores y enfermeros brindan una atención médica perfecta. Un sistema avanzado de apoyo
              humano que te ayuda a vivir una vida más feliz y saludable, con un hospital completo, servicios
              médicos y tecnología avanzada de salud.
            </p>
            <button className="landing-btn-light">Leer Más</button>
          </div>
        </div>

        <div className="landing-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

        <svg className="landing-wave" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0 80C120 0 360 0 720 0C1080 0 1320 80 1440 80V80H0V80Z" fill="white" />
        </svg>
      </section>

      {/* Departamentos */}
      <section className="landing-section">
        <h2>NUESTROS DEPARTAMENTOS</h2>
        <p className="landing-description">
          Todos los departamentos trabajan de manera colaborativa para brindar la mejor atención médica.
        </p>

        <div className="landing-cards">
          {[
            {
              icon: 'bx bx-heart',
              title: 'CARDIOLOGÍA',
              text: 'El corazón es un órgano vital que bombea sangre al resto del cuerpo.',
            },
            {
              icon: 'bx bx-search-alt-2',
              title: 'DIAGNÓSTICO',
              text: 'Proceso de identificar enfermedades mediante evaluación médica.',
            },
            {
              icon: 'bx bx-scatter-chart',
              title: 'CIRUGÍA',
              text: 'Tratamiento mediante incisiones o manipulaciones.',
            },
          ].map((card, index) => (
            <div key={index} className="landing-card">
              <div className="landing-icon">
                <i className={card.icon}></i>
              </div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>


        <button className="landing-btn-primary">Ver Todos</button>
      </section>



    </div>
  );
};

export default Index_Content