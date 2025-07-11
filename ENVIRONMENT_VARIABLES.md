# Variables de Entorno - HabitLeague

## 📋 Configuración Inicial

1. Copia el archivo de ejemplo:
   ```bash
   cp env.example .env.local
   ```

2. Edita `.env.local` con tus valores específicos

## 🔧 Variables Disponibles

### API Configuration
| Variable | Descripción | Requerida | Valor por defecto |
|----------|-------------|-----------|-------------------|
| `VITE_API_URL` | URL base de la API del backend | ✅ | `http://localhost:8080/api` |

### Google Maps API
| Variable | Descripción | Requerida | Valor por defecto |
|----------|-------------|-----------|-------------------|
| `VITE_GOOGLE_MAPS_API_KEY` | API Key de Google Maps para funcionalidades de ubicación | ✅ | - |

### Upload Service
| Variable | Descripción | Requerida | Valor por defecto |
|----------|-------------|-----------|-------------------|
| `VITE_UPLOAD_SERVICE_URL` | URL del servicio de upload de imágenes | ❌ | `https://example.com` |

### Test Configuration
| Variable | Descripción | Requerida | Valor por defecto |
|----------|-------------|-----------|-------------------|
| `VITE_TEST_API_URL` | URL de la API para tests | ❌ | `http://localhost:8080/api` |
| `VITE_TEST_EMAIL` | Email para tests | ❌ | `test@example.com` |
| `VITE_TEST_PASSWORD` | Contraseña para tests | ❌ | `testpassword123` |

### App Configuration
| Variable | Descripción | Requerida | Valor por defecto |
|----------|-------------|-----------|-------------------|
| `VITE_APP_NAME` | Nombre de la aplicación | ❌ | `HabitLeague` |
| `VITE_APP_VERSION` | Versión de la aplicación | ❌ | `1.0.0` |

## 🚨 Variables Críticas

### VITE_GOOGLE_MAPS_API_KEY
**⚠️ CRÍTICA** - Sin esta variable, las funcionalidades de ubicación no funcionarán.

**Cómo obtenerla:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Habilita las APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API
4. Ve a "Credentials" y crea una nueva API Key
5. Restringe la API Key a tu dominio por seguridad

### VITE_API_URL
**⚠️ CRÍTICA** - Sin esta variable, la aplicación no podrá conectarse al backend.

**Ejemplos:**
- Desarrollo local: `http://localhost:8080/api`
- Backend remoto: `http://192.168.83.163:3000/api`
- Producción: `https://api.habitleague.com/api`

## 🔒 Seguridad

### Variables Sensibles
- `VITE_GOOGLE_MAPS_API_KEY` - Restringe esta key a tu dominio
- `VITE_TEST_PASSWORD` - Solo para desarrollo/testing

### Archivos a Ignorar
Asegúrate de que `.env.local` esté en tu `.gitignore`:
```gitignore
.env.local
.env.*.local
```

## 🐛 Solución de Problemas

### Google Maps no funciona
```bash
# Verificar que la variable esté configurada
echo $VITE_GOOGLE_MAPS_API_KEY

# Verificar en la consola del navegador
console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
```

### API no responde
```bash
# Verificar la URL de la API
echo $VITE_API_URL

# Probar conectividad
curl $VITE_API_URL/health
```

### Variables no se cargan
1. Reinicia el servidor de desarrollo: `npm run dev`
2. Verifica que el archivo se llame `.env.local`
3. Verifica que las variables empiecen con `VITE_`

## 📝 Ejemplo de .env.local

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=AIzaSyYourActualApiKeyHere

# Upload Service
VITE_UPLOAD_SERVICE_URL=https://your-upload-service.com

# Test Configuration
VITE_TEST_API_URL=http://localhost:8080/api
VITE_TEST_EMAIL=test@example.com
VITE_TEST_PASSWORD=testpassword123

# App Configuration
VITE_APP_NAME=HabitLeague
VITE_APP_VERSION=1.0.0
``` 