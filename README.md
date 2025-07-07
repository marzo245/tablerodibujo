# 🎨 Tablero de Dibujo Colaborativo

Una aplicación web interactiva que permite a múltiples usuarios dibujar colaborativamente en tiempo real sobre un canvas compartido.

## ✨ Características

- **🎭 Múltiples usuarios**: Simula hasta 5 usuarios conectados simultáneamente
- **🌈 Colores únicos**: Cada usuario tiene asignado un color distintivo
- **⚡ Tiempo real**: Los dibujos aparecen instantáneamente para todos los usuarios
- **🗑️ Borrado global**: Botón para limpiar el canvas para todos los usuarios
- **🎨 Interfaz moderna**: Diseño atractivo y responsivo con efectos visuales
- **📱 Responsive**: Funciona en dispositivos móviles y de escritorio

## 🚀 Tecnologías Utilizadas

- **React** - Librería de interfaz de usuario
- **Vite** - Herramienta de build rápida
- **p5.js** - Librería para gráficos y animaciones
- **CSS3** - Estilos modernos con gradientes y efectos

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <tu-repo>
cd tablerodibujo
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta la aplicación en modo desarrollo:
```bash
npm run dev
```

4. Abre [http://localhost:5173](http://localhost:5173) en tu navegador

## 🎮 Cómo usar

1. **Dibujar**: Haz clic y arrastra el mouse sobre el canvas para dibujar
2. **Cambiar usuario**: Usa el botón "Cambiar Usuario" para alternar entre diferentes usuarios
3. **Limpiar**: Presiona el botón "Limpiar Tablero" para borrar todos los dibujos
4. **Observar actividad**: Los puntos de colores muestran qué usuarios están "conectados"

## 🏗️ Estructura del Proyecto

```
src/
├── App.jsx          # Componente principal con lógica del canvas
├── App.css          # Estilos específicos de la aplicación
├── index.css        # Estilos globales
└── main.jsx         # Punto de entrada de la aplicación
```

## 🔧 Configuración

El proyecto está configurado con:
- **React Hooks** para gestión de estado
- **useRef** para manejar instancias de p5.js
- **useEffect** para efectos de ciclo de vida
- **Simulación de usuarios** con temporizadores

## 🎯 Funcionalidades Futuras

- [ ] Conexión real con WebSockets
- [ ] Más herramientas de dibujo (diferentes grosores, formas)
- [ ] Guardado de dibujos
- [ ] Salas privadas
- [ ] Chat en tiempo real

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
