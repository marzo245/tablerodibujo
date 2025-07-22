import { useState, useRef, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import p5 from 'p5';
import './App.css';

function App() {
  // Estado de usuario autenticado
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tablero-user');
    return saved ? JSON.parse(saved) : null;
  });

  // Estados principales
  const [dibujos, setDibujos] = useState([]);
  const [dibujando, setDibujando] = useState(false);
  const [canvasListo, setCanvasListo] = useState(false);

  // Estados para herramientas de dibujo
  const [colorUsuario, setColorUsuario] = useState('#FF6B6B');
  const [grosorTrazo, setGrosorTrazo] = useState(3);

  // Estado para el chat
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('tablero-chat');
    return saved ? JSON.parse(saved) : [];
  });
  const [chatInput, setChatInput] = useState("");

  // Estado para manejo de errores de login
  const [loginError, setLoginError] = useState("");

  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if (user) {
      localStorage.setItem('tablero-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tablero-user');
    }
  }, [user]);

  // Referencias para p5.js
  const canvasRef = useRef(null);
  const p5Instance = useRef(null);
  const estadoRef = useRef({
    dibujos,
    dibujando,
    colorUsuario,
    grosorTrazo
  });

  useEffect(() => {
    estadoRef.current = {
      dibujos,
      dibujando,
      colorUsuario,
      grosorTrazo
    };
  }, [dibujos, dibujando, colorUsuario, grosorTrazo]);

  useEffect(() => {
    if (!user) return;
    const dibujosGuardados = localStorage.getItem('tablero-dibujos');
    if (dibujosGuardados) {
      setDibujos(JSON.parse(dibujosGuardados));
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem('tablero-dibujos', JSON.stringify(dibujos));
  }, [dibujos, user]);

  useEffect(() => {
    if (!user) return;
    const handleStorageChange = (e) => {
      if (e.key === 'tablero-dibujos' && e.newValue) {
        setDibujos(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Limpia la instancia previa de p5 si existe
    if (p5Instance.current) {
      p5Instance.current.remove();
      p5Instance.current = null;
    }

    // Limpia el contenedor antes de crear el canvas
    const container = document.getElementById('canvas-container');
    if (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }

    // Crea la nueva instancia de p5
    let pInstance = null;
    const sketch = (p) => {
      p.setup = () => {
        const canvas = p.createCanvas(800, 600);
        canvas.parent('canvas-container');
        p.background(255);
        p.strokeWeight(3);
        setCanvasListo(true);
        canvas.elt.setAttribute('tabindex', '-1');
      };
      p.draw = () => {
        p.background(255);
        estadoRef.current.dibujos.forEach(trazo => {
          if (trazo.puntos && trazo.puntos.length > 0) {
            p.stroke(trazo.color);
            p.strokeWeight(trazo.grosor);
            if (trazo.puntos.length === 1) {
              p.fill(trazo.color);
              p.noStroke();
              p.ellipse(trazo.puntos[0].x, trazo.puntos[0].y, trazo.grosor, trazo.grosor);
            } else {
              p.noFill();
              for (let i = 1; i < trazo.puntos.length; i++) {
                const puntoAnterior = trazo.puntos[i-1];
                const puntoActual = trazo.puntos[i];
                if (puntoAnterior && puntoActual && 
                    typeof puntoAnterior.x === 'number' && typeof puntoAnterior.y === 'number' &&
                    typeof puntoActual.x === 'number' && typeof puntoActual.y === 'number') {
                  p.line(puntoAnterior.x, puntoAnterior.y, puntoActual.x, puntoActual.y);
                }
              }
            }
          }
        });
      };
      p.mousePressed = () => {
        const x = p.mouseX;
        const y = p.mouseY;
        if (x >= 0 && x <= p.width && y >= 0 && y <= p.height) {
          setDibujando(true);
          const nuevoTrazo = {
            id: Date.now(),
            color: estadoRef.current.colorUsuario,
            grosor: estadoRef.current.grosorTrazo,
            puntos: []
          };
          setDibujos(prev => [...prev, nuevoTrazo]);
        }
        return false;
      };
      p.mouseDragged = () => {
        const x = p.mouseX;
        const y = p.mouseY;
        if (estadoRef.current.dibujando && x >= 0 && x <= p.width && y >= 0 && y <= p.height) {
          setDibujos(prev => {
            const nuevos = [...prev];
            if (nuevos.length > 0) {
              const nuevoPunto = { x: Math.round(x), y: Math.round(y) };
              if (!nuevos[nuevos.length - 1].puntos) nuevos[nuevos.length - 1].puntos = [];
              nuevos[nuevos.length - 1].puntos.push(nuevoPunto);
            }
            return nuevos;
          });
        }
        return false;
      };
      p.mouseReleased = () => {
        setDibujando(false);
      };
    };
    pInstance = new p5(sketch);
    p5Instance.current = pInstance;

    // Cleanup
    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
    };
  }, [user]);

  // Sincroniza chat entre ventanas
  useEffect(() => {
    if (!user) return;
    const handleStorageChange = (e) => {
      if (e.key === 'tablero-chat' && e.newValue) {
        setChatMessages(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  // Guarda mensajes en localStorage
  useEffect(() => {
    if (!user) return;
    localStorage.setItem('tablero-chat', JSON.stringify(chatMessages));
  }, [chatMessages, user]);

  // Maneja envío de mensaje
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatInput.trim() === "") return;
    setChatMessages(prev => [...prev, { user: user.name, text: chatInput, picture: user.picture }]);
    setChatInput("");
  };

  // Función para cambiar el grosor del trazo de forma segura
  const cambiarGrosorTrazo = (nuevoValor) => {
    try {
      const nuevoGrosor = parseInt(nuevoValor);
      if (!isNaN(nuevoGrosor) && nuevoGrosor >= 1 && nuevoGrosor <= 20) {
        setTimeout(() => {
          setGrosorTrazo(nuevoGrosor);
        }, 0);
      }
    } catch (error) {
      console.error("Error al cambiar el grosor:", error);
    }
  };

  // Colores predefinidos para selección rápida
  const coloresPredefinidos = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#FD79A8', '#FDCB6E', '#6C5CE7',
    '#A29BFE', '#FF7675', '#74B9FF', '#00B894'
  ];

  // Función para limpiar el tablero
  const limpiarTablero = () => {
    setDibujos([]);
    localStorage.removeItem('tablero-dibujos');
    if (p5Instance.current) {
      p5Instance.current.background(255);
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tablero-usuario-activo');
  };

  // Mostrar solo login si no está autenticado
  if (!user) {
    return (
      <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1>🎨 Tablero de Dibujo Colaborativo</h1>
        <p>Inicia sesión con Google para continuar</p>
        <GoogleLogin
          onSuccess={credentialResponse => {
            if (credentialResponse.credential) {
              const decoded = jwtDecode(credentialResponse.credential);
              // Verifica si ya hay un usuario con ese correo en localStorage
              const usuarioActivo = localStorage.getItem('tablero-usuario-activo');
              if (usuarioActivo && JSON.parse(usuarioActivo).email === decoded.email) {
                setLoginError('Ya hay una sesión activa con este correo en otra ventana.');
                return;
              }
              localStorage.setItem('tablero-usuario-activo', JSON.stringify({ email: decoded.email }));
              setUser(decoded);
              setLoginError("");
            }
          }}
          onError={() => {
            setLoginError('Login Failed');
          }}
        />
        {loginError && <div style={{ color: 'red', marginTop: 12 }}>{loginError}</div>}
      </div>
    );
  }

  // El resto del render de la app (canvas, controles, etc.)
  return (
    <div className="App">
      <header className="app-header">
        <h1>🎨 Tablero de Dibujo Colaborativo</h1>
        <p>Abre múltiples ventanas para ver la sincronización en tiempo real</p>
      </header>
      <div className="controles">
        {/* Selector de colores */}
        <div className="selector-colores">
          <label>Color:</label>
          <div className="paleta-colores">
            {coloresPredefinidos.map((color, index) => (
              <button
                key={index}
                className={`color-btn ${colorUsuario === color ? 'activo' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setColorUsuario(color)}
                title={`Color ${index + 1}`}
              />
            ))}
            {/* Selector de color personalizado */}
            <input
              type="color"
              value={colorUsuario}
              onChange={(e) => setColorUsuario(e.target.value)}
              className="color-picker"
              title="Color personalizado"
            />
          </div>
        </div>
        {/* Selector de grosor */}
        <div className="selector-grosor">
          <label>Grosor: {grosorTrazo}px</label>
          <div className="grosor-controles">
            <button 
              className="btn-grosor"
              onClick={() => cambiarGrosorTrazo(grosorTrazo - 1)}
              disabled={grosorTrazo <= 1}
            >
              -
            </button>
            <input
              type="range"
              min="1"
              max="20"
              value={grosorTrazo}
              onChange={(e) => cambiarGrosorTrazo(e.target.value)}
              className="grosor-slider"
            />
            <button 
              className="btn-grosor"
              onClick={() => cambiarGrosorTrazo(grosorTrazo + 1)}
              disabled={grosorTrazo >= 20}
            >
              +
            </button>
          </div>
          <div className="preview-grosor">
            <div 
              style={{
                width: `${Math.max(grosorTrazo * 2, 10)}px`,
                height: `${Math.max(grosorTrazo * 2, 10)}px`,
                backgroundColor: colorUsuario,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ 
                fontSize: '9px', 
                color: grosorTrazo > 6 ? 'white' : 'black', 
                fontWeight: 'bold' 
              }}>{grosorTrazo}</span>
            </div>
          </div>
        </div>
      </div>
      <button 
        className="btn btn-limpiar"
        onClick={limpiarTablero}
      >
        🗑️ Limpiar Tablero
      </button>
      <div className="canvas-wrapper" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 24 }}>
        <div id="canvas-container" ref={canvasRef}></div>
        {/* Rectángulo al lado del canvas */}
        <div style={{ width: 240, height: 600, background: '#f3f3f3', border: '2px solid #bbb', borderRadius: 10, marginLeft: 0, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-end', padding: 12 }}>
          {/* Área de mensajes */}
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: 12, background: '#fff', borderRadius: 6, border: '1px solid #e0e0e0', padding: 8 }}>
            {chatMessages.length === 0 && <div style={{ color: '#aaa', textAlign: 'center' }}>No hay mensajes aún</div>}
            {chatMessages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <img src={msg.picture} alt="avatar" style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 6 }} />
                <div>
                  <strong style={{ fontSize: 13 }}>{msg.user}</strong>
                  <div style={{ fontSize: 14 }}>{msg.text}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Input y botón para enviar */}
          <form style={{ display: 'flex', gap: 8 }} onSubmit={handleSendMessage}>
            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Escribe un mensaje..." style={{ flex: 1, borderRadius: 6, border: '1px solid #ccc', padding: 8, fontSize: 15 }} autoFocus />
            <button type="submit" style={{ borderRadius: 6, padding: '8px 16px', background: '#667eea', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Enviar</button>
          </form>
        </div>
      </div>
      <footer className="app-footer">
        <p>Haz clic y arrastra para dibujar. Abre esta página en múltiples ventanas para ver la sincronización.</p>
      </footer>
      {user && (
        <div style={{ marginTop: 20 }}>
          <img src={user.picture} alt="Foto de perfil" style={{ borderRadius: '50%', width: 50 }} />
          <p>Bienvenido, {user.name}</p>
          <button onClick={handleLogout} className="btn btn-logout">Cerrar Sesión</button>
        </div>
      )}
    </div>
  );
}

export default App;

