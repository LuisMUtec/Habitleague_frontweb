# HabitLeague Web App

Una aplicación web moderna para gestionar hábitos, tareas y desafíos personales. Desarrollada con React, TypeScript y una arquitectura modular.

## 🚀 Características

- **Autenticación completa**: Login y registro multi-step
- **Dashboard personalizado**: Vista general de tareas y desafíos
- **Gestión de perfil**: Edición de información personal y avatar
- **Navegación responsiva**: Adaptada para desktop y móvil
- **Arquitectura modular**: Código organizado y reutilizable
- **TypeScript**: Tipado estático para mayor seguridad

## 🛠️ Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **CSS Modules** - Estilos modulares
- **Vite** - Build tool

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── auth/           # Componentes de autenticación
│   ├── layout/         # Componentes de layout
│   ├── pages/          # Páginas principales
│   └── ui/             # Componentes de UI reutilizables
├── context/            # Contextos de React
├── hooks/              # Hooks personalizados
├── router/             # Configuración de rutas
├── services/           # Servicios de API
├── utils/              # Utilidades y helpers
└── types.ts            # Definiciones de tipos
```

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd habitleague
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Copiar el archivo de ejemplo
   cp env.example .env.local
   
   # Editar .env.local con tus valores
   # VITE_API_URL=http://192.168.83.163:3000/api
   # VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Construir para producción**
   ```bash
   npm run build
   ```

## 🔧 Configuración

### Variables de Entorno

Copia el archivo de ejemplo y configúralo:

```bash
cp env.example .env.local
```

Variables disponibles en `.env.local`:

```env
# API Configuration
VITE_API_URL=http://192.168.83.163:3000/api

# Google Maps API (Required for location features)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Upload Service (for production)
VITE_UPLOAD_SERVICE_URL=https://your-upload-service.com

# Test Configuration
VITE_TEST_API_URL=http://localhost:8080/api
VITE_TEST_EMAIL=test@example.com
VITE_TEST_PASSWORD=testpassword123
```

### Configuración de API

Actualiza la URL base de la API en `src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

## 📱 Uso

### Flujo de Autenticación

1. **Registro**: Los usuarios pueden crear una cuenta con email, contraseña y información personal
2. **Login**: Acceso con email y contraseña
3. **Perfil**: Edición de información personal y avatar

### Navegación

- **Home**: Dashboard principal con estadísticas y tareas
- **Profile**: Gestión de perfil de usuario
- **Challenges**: Desafíos disponibles (en desarrollo)
- **Tasks**: Gestión de tareas (en desarrollo)

## 🔌 Endpoints de API

La aplicación espera los siguientes endpoints:

### Autenticación
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/register` - Registro de usuario

### Usuario
- `GET /api/user/profile` - Obtener perfil
- `PUT /api/user/profile` - Actualizar perfil
- `POST /api/user/upload-photo` - Subir foto de perfil

### Estructura de Respuestas

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

## 🎨 Personalización

### Colores

Los colores principales se pueden personalizar en los archivos CSS:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --primary-color: #667eea;
  --secondary-color: #764ba2;
}
```

### Temas

La aplicación usa un sistema de colores consistente que se puede modificar en los archivos CSS de cada componente.

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: Navegación superior
- **Tablet**: Navegación adaptada
- **Mobile**: Navegación inferior tipo app

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch
```

## 📦 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de producción
- `npm run lint` - Linting del código
- `npm run type-check` - Verificación de tipos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🔮 Roadmap

- [ ] Implementación completa de Challenges
- [ ] Sistema de Tasks avanzado
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Integración con calendario
- [ ] Analytics y reportes
- [ ] Temas personalizables
- [ ] PWA (Progressive Web App)

---

Desarrollado con ❤️ para ayudar a las personas a construir mejores hábitos.
