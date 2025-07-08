# Instrucciones para GitHub Copilot

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

Este es un proyecto de tablero de dibujo interactivo desarrollado con React y p5.js.

## Contexto del Proyecto
- **Framework**: React con Vite
- **Librería de Dibujo**: p5.js
- **Funcionalidades principales**:
  - Tablero de dibujo colaborativo
  - Sincronización entre ventanas usando localStorage
  - Botón de borrado global
  - Persistencia de dibujos entre sesiones

## Arquitectura Técnica
- **React Hooks**: `useState`, `useRef`, `useEffect`
- **p5.js Integration**: Canvas de dibujo con eventos de mouse
- **localStorage API**: Almacenamiento y sincronización de datos
- **Event Listeners**: Sincronización en tiempo real entre ventanas

## Patrones de Código
- Usar hooks de React (useState, useRef, useEffect)
- Componentes funcionales
- Gestión de estado con refs para acceso desde p5.js
- Uso de localStorage para persistencia
- Event listeners para sincronización multi-ventana

## Funcionalidades Implementadas
- **Dibujo libre**: Click y arrastrar para crear trazos
- **Selector de colores**: 12 colores predefinidos + selector personalizado
- **Control de grosor**: Slider para ajustar grosor de trazo (1-20px)
- **Preview en tiempo real**: Vista previa del color y grosor seleccionado
- **Sincronización automática**: Los dibujos aparecen en todas las ventanas
- **Borrado global**: Limpia el canvas en todas las ventanas
- **Persistencia**: Los dibujos se mantienen al recargar la página

## Convenciones
- Nombres de componentes en PascalCase
- Variables de estado descriptivas
- Comentarios en español para documentación
- Código limpio y modular
- Validación de coordenadas de mouse
- Manejo apropiado de eventos p5.js
