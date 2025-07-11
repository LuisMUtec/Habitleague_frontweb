# 🚀 Configuración Rápida - HabitLeague Web

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Backend corriendo en `192.168.83.163:3000`
- Navegador web moderno

## ⚡ Configuración en 3 Pasos

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Conexión al Backend
Copiar y configurar el archivo de variables de entorno:

```bash
cp env.example .env.local
```

Editar `.env.local` con tus valores:

```env
VITE_API_URL=http://192.168.83.163:3000/api
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

### 3. Ejecutar la Aplicación
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

## 🔧 Configuración Avanzada

### Variables de Entorno Disponibles

```env
# API Configuration (requerido)
VITE_API_URL=http://192.168.83.163:3000/api

# Google Maps API (requerido para funcionalidades de ubicación)
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui

# Upload Service (para producción)
VITE_UPLOAD_SERVICE_URL=https://your-upload-service.com

# Test Configuration
VITE_TEST_API_URL=http://localhost:8080/api
VITE_TEST_EMAIL=test@example.com
VITE_TEST_PASSWORD=testpassword123

# App Configuration
VITE_APP_NAME=HabitLeague
VITE_APP_VERSION=1.0.0
```

### Endpoints del Backend Esperados

La aplicación espera que tu backend tenga estos endpoints:

#### Autenticación
- `POST /api/auth/login`
- `POST /api/auth/register`

#### Usuario
- `GET /api/user/profile`
- `PUT /api/user/profile`
- `POST /api/user/upload-photo`

#### Estructura de Respuesta Esperada
```json
{
  "success": true,
  "data": {
    // datos de la respuesta
  },
  "message": "Mensaje opcional"
}
```

## 🐛 Solución de Problemas

### Error de Conexión al Backend
1. Verificar que el backend esté corriendo en `192.168.83.163:3000`
2. Verificar la configuración de CORS en el backend
3. Comprobar que la URL en `.env.local` sea correcta

### Error de CORS
Agregar al backend:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Puerto Ocupado
Si el puerto 5173 está ocupado, Vite automáticamente usará el siguiente disponible.

## 📱 Prueba de Funcionalidad

1. **Registro**: Crear una nueva cuenta
2. **Login**: Iniciar sesión
3. **Dashboard**: Ver estadísticas y tareas
4. **Perfil**: Editar información personal

## 🔄 Actualizaciones

Para actualizar la aplicación:
```bash
git pull
npm install
npm run dev
```

## 📞 Soporte

Si tienes problemas:
1. Verificar que el backend esté funcionando
2. Revisar la consola del navegador para errores
3. Verificar la configuración de red 