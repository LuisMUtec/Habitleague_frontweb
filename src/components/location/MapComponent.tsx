import React, { useState, useEffect, useRef } from 'react';

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
  height?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  onLocationSelect,
  initialLat = -12.0464,
  initialLng = -77.0428,
  height = "400px"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    // Detectar ubicación del usuario
    const detectUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log('📍 User location detected:', { latitude, longitude });
            setCurrentLocation({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.log('⚠️ Could not detect user location:', error.message);
            // Usar coordenadas por defecto si no se puede detectar
            setCurrentLocation({ lat: initialLat, lng: initialLng });
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutos
          }
        );
      } else {
        console.log('⚠️ Geolocation not supported, using default coordinates');
        setCurrentLocation({ lat: initialLat, lng: initialLng });
      }
    };

    // Cargar Google Maps API
    const loadGoogleMaps = () => {
      if ((window as any).google && (window as any).google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        console.warn('⚠️ VITE_GOOGLE_MAPS_API_KEY no está configurada. Google Maps no funcionará correctamente.');
        setIsLoading(false);
        return;
      }
      
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    detectUserLocation();
    loadGoogleMaps();
  }, [initialLat, initialLng]);

  // Reinicializar mapa cuando se detecte la ubicación del usuario
  useEffect(() => {
    if (currentLocation && (window as any).google && (window as any).google.maps && mapRef.current) {
      console.log('🔄 Reinitializing map with user location:', currentLocation);
      initializeMap();
    }
  }, [currentLocation]);

  const initializeMap = () => {
    if (!mapRef.current) return;

    // Usar ubicación del usuario si está disponible, sino usar coordenadas iniciales
    const centerLat = currentLocation?.lat || initialLat;
    const centerLng = currentLocation?.lng || initialLng;

    console.log('🗺️ Initializing map with coordinates:', { centerLat, centerLng });

    const google = (window as any).google;
    const mapInstance = new google.maps.Map(mapRef.current, {
      center: { lat: centerLat, lng: centerLng },
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    // Crear marcador inicial
    const initialMarker = new google.maps.Marker({
      position: { lat: centerLat, lng: centerLng },
      map: mapInstance,
      draggable: true,
      title: "Arrastra para cambiar la ubicación"
    });

    // Evento de clic en el mapa
    mapInstance.addListener('click', (event: any) => {
      const lat = event.latLng?.lat();
      const lng = event.latLng?.lng();
      
      if (lat && lng) {
        updateMarkerPosition(initialMarker, lat, lng);
        getAddressFromCoordinates(lat, lng);
      }
    });

    // Evento de arrastre del marcador
    initialMarker.addListener('dragend', (event: any) => {
      const lat = event.latLng?.lat();
      const lng = event.latLng?.lng();
      
      if (lat && lng) {
        getAddressFromCoordinates(lat, lng);
      }
    });

    setIsLoading(false);
  };

  const updateMarkerPosition = (marker: any, lat: number, lng: number) => {
    if (marker) {
      marker.setPosition({ lat, lng });
    }
  };

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const google = (window as any).google;
      const geocoder = new google.maps.Geocoder();
      
      geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          const address = results[0].formatted_address;
          console.log('📍 Address found:', address)
          setSelectedLocation({ lat, lng, address });
          onLocationSelect(lat, lng, address);
        } else {
          // Si no se puede obtener la dirección, usar coordenadas como fallback
          const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          console.log('📍 Using fallback address:', fallbackAddress)
          setSelectedLocation({ lat, lng, address: fallbackAddress });
          onLocationSelect(lat, lng, fallbackAddress);
        }
      });
    } catch (error) {
      console.error('Error getting address:', error);
      // Si no se puede obtener la dirección, usar coordenadas como fallback
      const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      console.log('📍 Using fallback address due to error:', fallbackAddress)
      setSelectedLocation({ lat, lng, address: fallbackAddress });
      onLocationSelect(lat, lng, fallbackAddress);
    }
  };

  const handleSearchLocation = () => {
    if (!searchQuery.trim()) return;

    const google = (window as any).google;
    if (!google || !google.maps) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        const place = results[0];
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address;

        // Centrar el mapa en la nueva ubicación
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: { lat, lng },
            zoom: 15
          });

          // Crear nuevo marcador
          const marker = new google.maps.Marker({
            position: { lat, lng },
            map: mapInstance,
            draggable: true,
            title: "Arrastra para cambiar la ubicación"
          });

          // Agregar eventos
          mapInstance.addListener('click', (event: any) => {
            const clickLat = event.latLng?.lat();
            const clickLng = event.latLng?.lng();
            
            if (clickLat && clickLng) {
              updateMarkerPosition(marker, clickLat, clickLng);
              getAddressFromCoordinates(clickLat, clickLng);
            }
          });

          marker.addListener('dragend', (event: any) => {
            const dragLat = event.latLng?.lat();
            const dragLng = event.latLng?.lng();
            
            if (dragLat && dragLng) {
              getAddressFromCoordinates(dragLat, dragLng);
            }
          });
        }

        setSelectedLocation({ lat, lng, address });
        onLocationSelect(lat, lng, address);
        setSearchQuery('');
      }
    });
  };

  const centerOnUserLocation = () => {
    if (currentLocation && mapRef.current) {
      const google = (window as any).google;
      if (!google || !google.maps) return;

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat: currentLocation.lat, lng: currentLocation.lng },
        zoom: 15
      });

      // Crear nuevo marcador
      const marker = new google.maps.Marker({
        position: { lat: currentLocation.lat, lng: currentLocation.lng },
        map: mapInstance,
        draggable: true,
        title: "Arrastra para cambiar la ubicación"
      });

      // Agregar eventos
      mapInstance.addListener('click', (event: any) => {
        const clickLat = event.latLng?.lat();
        const clickLng = event.latLng?.lng();
        
        if (clickLat && clickLng) {
          updateMarkerPosition(marker, clickLat, clickLng);
          getAddressFromCoordinates(clickLat, clickLng);
        }
      });

      marker.addListener('dragend', (event: any) => {
        const dragLat = event.latLng?.lat();
        const dragLng = event.latLng?.lng();
        
        if (dragLat && dragLng) {
          getAddressFromCoordinates(dragLat, dragLng);
        }
      });

      console.log('📍 Centered map on user location:', currentLocation);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controles del mapa */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h3 className="text-lg font-medium text-gray-900">Seleccionar Ubicación en el Mapa</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar ubicación (ej: 'Centro comercial', 'Parque')"
            className="flex-1 sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation()}
          />
          <button
            type="button"
            onClick={handleSearchLocation}
            className="px-4 py-2 bg-[#B59E7D] text-[#F1EADA] rounded-lg hover:bg-[#584738] text-sm whitespace-nowrap"
          >
            🔍 Buscar
          </button>
          {currentLocation && (
            <button
              type="button"
              onClick={centerOnUserLocation}
              className="px-4 py-2 bg-[#B59E7D] text-[#F1EADA] rounded-lg hover:bg-[#584738] text-sm whitespace-nowrap"
              title="Centrar en mi ubicación actual"
            >
              📍 Mi Ubicación
            </button>
          )}
        </div>
      </div>

      {/* Mapa */}
      <div className="relative">
        <div
          ref={mapRef}
          style={{ height }}
          className="w-full rounded-xl border-2 border-gray-200 overflow-hidden"
        />
        
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Cargando mapa...</p>
            </div>
          </div>
        )}

        {/* Instrucciones */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg max-w-xs">
          <p className="text-sm text-gray-700">
            💡 <strong>Instrucciones:</strong><br/>
            • Haz clic en el mapa para seleccionar ubicación<br/>
            • Arrastra el marcador para ajustar<br/>
            • Usa el buscador para encontrar lugares
          </p>
        </div>
      </div>

      {/* Información de la ubicación seleccionada */}
      {selectedLocation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">📍 Ubicación Seleccionada</h4>
          <div className="space-y-1 text-sm">
            <p><strong>Dirección:</strong> {selectedLocation.address}</p>
            <p><strong>Latitud:</strong> {selectedLocation.lat.toFixed(6)}</p>
            <p><strong>Longitud:</strong> {selectedLocation.lng.toFixed(6)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent; 