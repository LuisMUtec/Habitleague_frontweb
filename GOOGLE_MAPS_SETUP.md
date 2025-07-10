# Configuración de Google Maps API

## Pasos para configurar Google Maps en el proyecto:

### 1. Obtener API Key de Google Maps

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API
4. Ve a "Credentials" y crea una nueva API Key
5. Restringe la API Key a tu dominio por seguridad

### 2. Configurar la API Key en el proyecto

1. Crea un archivo `.env` en la raíz del proyecto
2. Agrega la siguiente línea:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
   ```

### 3. Funcionalidades del mapa

El componente MapComponent incluye:
- ✅ **Detección automática de ubicación del usuario** (geolocalización)
- ✅ **Coordenadas dinámicas** que se adaptan según la ubicación del usuario
- ✅ Selección de ubicación haciendo clic en el mapa
- ✅ Arrastrar el marcador para ajustar la posición
- ✅ Búsqueda de ubicaciones por nombre
- ✅ Obtención automática de dirección (geocoding)
- ✅ Botón "Mi Ubicación" para centrar el mapa en la ubicación actual
- ✅ Interfaz responsive y moderna
- ✅ Fallback a coordenadas por defecto (Lima, Perú) si no se puede detectar la ubicación

### 4. Uso en el formulario de creación de challenges

- El usuario puede hacer clic en el mapa para seleccionar una ubicación
- La latitud y longitud se obtienen automáticamente
- La dirección se obtiene automáticamente usando geocoding
- El usuario solo necesita configurar el radio de tolerancia manualmente

### 5. Notas importantes

- La API Key debe estar restringida a tu dominio por seguridad
- El componente funciona sin API Key pero con funcionalidad limitada
- Se recomienda usar HTTPS en producción 