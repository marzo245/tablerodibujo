# 🎨 Tablero de Dibujo Colaborativo

Una aplicación web interactiva que permite dibujar colaborativamente en tiempo real usando localStorage para sincronización entre múltiples ventanas del navegador.

## 📖 Descripción

Este proyecto implementa un tablero de dibujo digital donde los usuarios pueden crear trazos que se sincronizan automáticamente entre diferentes ventanas del navegador. Utiliza React para la interfaz de usuario y p5.js para las funcionalidades de dibujo y rendering del canvas.

## ✨ Características

- **🎨 Dibujo en tiempo real**: Canvas interactivo para crear trazos con el mouse
- **🌈 Selector de colores**: Paleta de 12 colores predefinidos + selector personalizado
- **� Control de grosor**: Slider para ajustar el grosor del trazo (1-20px)
- **�🔄 Sincronización automática**: Los dibujos se sincronizan entre múltiples ventanas del navegador
- **🗑️ Borrado global**: Función para limpiar el tablero en todas las ventanas simultáneamente
- **💾 Persistencia**: Los dibujos se guardan automáticamente y persisten entre sesiones
- **📱 Diseño responsivo**: Interfaz adaptable a diferentes tamaños de pantalla
- **🎯 Interfaz intuitiva**: Controles fáciles de usar con preview en tiempo real

## �️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | ^18.3.1 | Librería de interfaz de usuario |
| **Vite** | ^6.0.1 | Herramienta de build y desarrollo |
| **p5.js** | ^1.11.1 | Librería para gráficos y canvas |
| **JavaScript** | ES2022+ | Lenguaje de programación |
| **CSS3** | - | Estilos y animaciones |
| **localStorage** | - | Almacenamiento local del navegador |

## 📋 Prerrequisitos

Antes de ejecutar este proyecto, asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 o **yarn** >= 1.22.0

## � Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd tablerodibujo
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en modo desarrollo
```bash
npm run dev
```

### 4. Construir para producción
```bash
npm run build
```

### 5. Vista previa de la build
```bash
npm run preview
```

## 🎮 Instrucciones de Uso

### Herramientas de Dibujo
1. **Seleccionar color**: 
   - Haz clic en cualquiera de los 12 colores predefinidos
   - O usa el selector de color personalizado para elegir cualquier color
2. **Ajustar grosor**: 
   - Usa el slider para cambiar el grosor del trazo (1-20 píxeles)
   - El preview muestra cómo se verá el trazo
3. **Dibujar**: Haz clic y arrastra el mouse sobre el canvas
4. **Soltar**: Libera el botón del mouse para finalizar el trazo

### Funcionalidades Colaborativas
1. **Múltiples ventanas**:
   - Abre la aplicación en una ventana del navegador
   - Abre una segunda ventana (Ctrl+N) y navega a la misma URL
   - Los dibujos aparecerán automáticamente en ambas ventanas
   - Cada ventana puede usar diferentes colores y grosores

2. **Borrado sincronizado**:
   - Presiona el botón "🗑️ Limpiar Tablero"
   - El canvas se limpiará en todas las ventanas abiertas

### Persistencia
- Los dibujos se guardan automáticamente con su color y grosor
- Al recargar la página, los dibujos previos se cargan automáticamente
- Los datos persisten hasta que se use la función de borrado

## 📁 Estructura del Proyecto

```
tablerodibujo/
├── public/                 # Archivos estáticos
├── src/                    # Código fuente
│   ├── App.jsx            # Componente principal
│   ├── App.css            # Estilos del componente principal
│   ├── index.css          # Estilos globales
│   └── main.jsx           # Punto de entrada
├── .github/               # Configuración de GitHub
│   └── copilot-instructions.md
├── package.json           # Dependencias y scripts
├── vite.config.js         # Configuración de Vite
└── README.md              # Documentación
```

## 🔧 Configuración de Desarrollo

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm run preview` | Vista previa de la build de producción |
| `npm run lint` | Ejecuta el linter para verificar código |

### Variables de Entorno
No se requieren variables de entorno para este proyecto.

## 🏗️ Arquitectura Técnica

### Componentes Principales
- **App.jsx**: Componente raíz que maneja el estado y la lógica de dibujo
- **p5 Instance**: Instancia de p5.js para el rendering del canvas
- **Estado React**: Gestión de trazos, estado de dibujo y sincronización

### Flujo de Datos
1. **Entrada del usuario** → Eventos de mouse en el canvas
2. **Procesamiento** → Captura de coordenadas y creación de trazos
3. **Almacenamiento** → Guardado en localStorage
4. **Sincronización** → Propagación a otras ventanas via evento 'storage'
5. **Renderizado** → Actualización del canvas con p5.js

### Patrones de Diseño
- **Hooks de React**: `useState`, `useRef`, `useEffect`
- **Observer Pattern**: Event listener para cambios en localStorage
- **State Management**: Referencias para acceso a estado desde p5.js

## 🧪 Testing

### Pruebas Manuales
1. **Funcionalidad de dibujo**:
   - Verificar que se pueden crear trazos
   - Validar que los trazos se renderizan correctamente
   - Probar diferentes colores y grosores

2. **Herramientas de dibujo**:
   - Cambiar entre colores predefinidos
   - Usar el selector de color personalizado
   - Ajustar el grosor y verificar el preview
   - Verificar que los cambios se aplican a nuevos trazos

3. **Sincronización**:
   - Abrir múltiples ventanas
   - Verificar sincronización en tiempo real
   - Probar función de borrado global
   - Confirmar que las herramientas funcionan independientemente en cada ventana

4. **Persistencia**:
   - Dibujar con diferentes colores y grosores
   - Recargar página
   - Verificar que todos los trazos persisten con sus propiedades originales

## 🚧 Roadmap y Mejoras Futuras

### Funcionalidades Planificadas
- [x] **Múltiples colores**: Selector de colores para diferentes usuarios ✅
- [x] **Grosor de trazo**: Control deslizante para ajustar el grosor ✅
- [ ] **Formas geométricas**: Herramientas para círculos, rectángulos, etc.
- [ ] **Deshacer/Rehacer**: Funcionalidad de undo/redo
- [ ] **Exportar imagen**: Guardar el canvas como PNG/SVG
- [ ] **WebSockets**: Sincronización real en tiempo real con servidor
- [ ] **Salas de dibujo**: Múltiples tableros independientes
- [ ] **Chat integrado**: Comunicación entre usuarios

### Mejoras Técnicas
- [ ] **TypeScript**: Migración para mejor tipado
- [ ] **Testing**: Implementar pruebas unitarias y de integración
- [ ] **PWA**: Convertir en Progressive Web App
- [ ] **Optimización**: Mejorar rendimiento para dibujos complejos

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Para contribuir:

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Estándares de Código
- Seguir las convenciones de React y JavaScript moderno
- Usar comentarios en español para documentación
- Mantener componentes funcionales y hooks
- Escribir código limpio y modular

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

Desarrollado como proyecto educativo para aprender React, p5.js y técnicas de sincronización en el navegador.

## 🙏 Agradecimientos

- **React Team** por la excelente librería de UI
- **p5.js Community** por la potente librería de gráficos
- **Vite Team** por las herramientas de desarrollo rápidas
