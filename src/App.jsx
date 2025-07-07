import { useState, useRef, useEffect } from 'react'
import p5 from 'p5'
import './App.css'

function App() {
  // Estados simplificados
  const [dibujos, setDibujos] = useState([])
  const [dibujando, setDibujando] = useState(false)
  const [canvasListo, setCanvasListo] = useState(false)
  
  // Color fijo para el usuario
  const colorUsuario = '#FF6B6B'
  
  // Referencias para p5.js
  const canvasRef = useRef(null)
  const p5Instance = useRef(null)
  const estadoRef = useRef({
    dibujos,
    dibujando
  })
  
  // Actualizar la referencia cuando cambien los estados
  useEffect(() => {
    estadoRef.current = {
      dibujos,
      dibujando
    }
  }, [dibujos, dibujando])
  
  // Cargar dibujos desde localStorage al iniciar
  useEffect(() => {
    const dibujosGuardados = localStorage.getItem('tablero-dibujos')
    if (dibujosGuardados) {
      setDibujos(JSON.parse(dibujosGuardados))
    }
  }, [])
  
  // Guardar dibujos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('tablero-dibujos', JSON.stringify(dibujos))
  }, [dibujos])
  
  // Escuchar cambios en localStorage (para sincronizar entre ventanas)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'tablero-dibujos' && e.newValue) {
        setDibujos(JSON.parse(e.newValue))
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])
  
  // Efecto para configurar p5.js (solo una vez)
  useEffect(() => {
    const sketch = (p) => {
      p.setup = () => {
        const canvas = p.createCanvas(800, 600)
        canvas.parent('canvas-container')
        p.background(255)
        p.strokeWeight(3)
        setCanvasListo(true)
      }
      
      p.draw = () => {
        p.background(255)
        
        // Dibujar todos los trazos guardados
        estadoRef.current.dibujos.forEach(trazo => {
          if (trazo.puntos && trazo.puntos.length > 0) {
            p.stroke(trazo.color)
            p.strokeWeight(trazo.grosor)
            
            // Si solo hay un punto, dibujar un círculo pequeño
            if (trazo.puntos.length === 1) {
              p.fill(trazo.color)
              p.noStroke()
              p.ellipse(trazo.puntos[0].x, trazo.puntos[0].y, 3, 3)
            } else {
              // Si hay más de un punto, dibujar líneas conectadas
              p.noFill()
              for (let i = 1; i < trazo.puntos.length; i++) {
                const puntoAnterior = trazo.puntos[i-1]
                const puntoActual = trazo.puntos[i]
                
                // Verificar que ambos puntos existan y sean válidos
                if (puntoAnterior && puntoActual && 
                    typeof puntoAnterior.x === 'number' && typeof puntoAnterior.y === 'number' &&
                    typeof puntoActual.x === 'number' && typeof puntoActual.y === 'number') {
                  p.line(puntoAnterior.x, puntoAnterior.y, puntoActual.x, puntoActual.y)
                }
              }
            }
          }
        })
      }
      
      p.mousePressed = () => {
        // Capturar las coordenadas inmediatamente
        const x = p.mouseX
        const y = p.mouseY
        
        // Verificar que el mouse esté dentro del área del canvas
        if (x >= 0 && x <= p.width && y >= 0 && y <= p.height) {
          setDibujando(true)
          const nuevoTrazo = {
            id: Date.now(),
            color: colorUsuario,
            grosor: 3,
            puntos: [{ x: Math.round(x), y: Math.round(y) }]
          }
          setDibujos(prev => [...prev, nuevoTrazo])
        }
        return false // Prevenir comportamiento por defecto
      }
      
      p.mouseDragged = () => {
        // Capturar las coordenadas inmediatamente
        const x = p.mouseX
        const y = p.mouseY
        
        if (estadoRef.current.dibujando && x >= 0 && x <= p.width && y >= 0 && y <= p.height) {
          setDibujos(prev => {
            const nuevos = [...prev]
            if (nuevos.length > 0) {
              const nuevoPunto = { x: Math.round(x), y: Math.round(y) }
              nuevos[nuevos.length - 1].puntos.push(nuevoPunto)
            }
            return nuevos
          })
        }
        return false // Prevenir comportamiento por defecto
      }
      
      p.mouseReleased = () => {
        setDibujando(false)
      }
    }
    
    // Solo crear la instancia una vez
    if (!p5Instance.current) {
      p5Instance.current = new p5(sketch)
    }
    
    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove()
        p5Instance.current = null
      }
    }
  }, []) // Sin dependencias para que solo se ejecute una vez
  
  // Función para limpiar el tablero
  const limpiarTablero = () => {
    setDibujos([])
    localStorage.removeItem('tablero-dibujos')
    if (p5Instance.current) {
      p5Instance.current.background(255)
    }
  }
  
  
  return (
    <div className="App">
      <header className="app-header">
        <h1>🎨 Tablero de Dibujo Colaborativo</h1>
        <p>Abre múltiples ventanas para ver la sincronización en tiempo real</p>
      </header>
      
      <div className="controles">
        <button 
          className="btn btn-limpiar"
          onClick={limpiarTablero}
        >
          🗑️ Limpiar Tablero
        </button>
        
        <div className="info-color">
          <span>Tu color: </span>
          <div 
            style={{ 
              display: 'inline-block', 
              width: '20px', 
              height: '20px', 
              backgroundColor: colorUsuario,
              borderRadius: '50%',
              marginLeft: '5px'
            }}
          ></div>
        </div>
      </div>
      
      <div className="canvas-wrapper">
        <div id="canvas-container" ref={canvasRef}></div>
      </div>
      
      <footer className="app-footer">
        <p>Haz clic y arrastra para dibujar. Abre esta página en múltiples ventanas para ver la sincronización.</p>
      </footer>
    </div>
  )
}

export default App
