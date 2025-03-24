
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Add type definitions for Google Maps
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface GoogleMapProps {
  apiKey?: string;
  initialLocation?: Location;
  markers?: Location[];
  onLocationSelect?: (location: Location) => void;
  height?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  apiKey = '',
  initialLocation = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  markers = [],
  onLocationSelect,
  height = '500px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapMarkers, setMapMarkers] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  
  // Load Google Maps script
  useEffect(() => {
    if (!apiKey && !window.google?.maps) {
      console.warn('Google Maps API key is required');
      return;
    }
    
    // If Google Maps is already loaded, we don't need to load it again
    if (window.google?.maps) {
      setIsScriptLoaded(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    
    document.head.appendChild(script);
    
    return () => {
      // If the component unmounts before the script loads, remove it
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [apiKey]);
  
  // Initialize map once the script is loaded
  useEffect(() => {
    if (!isScriptLoaded || !mapRef.current) return;
    
    try {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: initialLocation,
        zoom: 14,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      
      setMap(mapInstance);
      setIsMapLoaded(true);
      
      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLoc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(userLoc);
            mapInstance.setCenter(userLoc);
            
            // Add a marker at the user's location
            new window.google.maps.Marker({
              position: userLoc,
              map: mapInstance,
              title: 'Your Location',
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                scale: 8
              }
            });
          },
          () => {
            console.log('Error: The Geolocation service failed.');
          }
        );
      }
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
    }
  }, [isScriptLoaded, initialLocation]);
  
  // Add markers when the map is loaded
  useEffect(() => {
    if (!isMapLoaded || !map) return;
    
    // Clear existing markers
    mapMarkers.forEach(marker => marker.setMap(null));
    
    // Add new markers
    const newMarkers = markers.map(location => {
      return new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.address || '',
        animation: window.google.maps.Animation.DROP
      });
    });
    
    setMapMarkers(newMarkers);
  }, [isMapLoaded, map, markers]);
  
  // Search for a location
  const handleSearch = () => {
    if (!map || !searchQuery.trim() || !isScriptLoaded) return;
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results: any, status: string) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        const newLocation = {
          lat: location.lat(),
          lng: location.lng(),
          address: results[0].formatted_address
        };
        
        map.setCenter(newLocation);
        
        // Create a marker at the searched location
        const marker = new window.google.maps.Marker({
          position: newLocation,
          map,
          title: newLocation.address,
          animation: window.google.maps.Animation.DROP
        });
        
        // Call the callback if provided
        if (onLocationSelect) {
          onLocationSelect(newLocation);
        }
        
        // Add info window with the address
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div class="p-2">${newLocation.address}</div>`
        });
        
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
        
        // Add the marker to the list
        setMapMarkers([...mapMarkers, marker]);
      } else {
        console.error('Geocode was not successful for the following reason:', status);
      }
    });
  };
  
  // Handle current location button click
  const handleCurrentLocation = () => {
    if (!map || !userLocation) return;
    
    map.setCenter(userLocation);
    map.setZoom(15);
  };
  
  return (
    <div className="w-full">
      <div className="mb-4 flex space-x-2">
        <div className="relative flex-grow">
          <Input
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pr-10 pl-9"
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <Button onClick={handleSearch} className="bg-eco-500 hover:bg-eco-600">
          Search
        </Button>
        <Button variant="outline" onClick={handleCurrentLocation}>
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
      
      <div 
        ref={mapRef} 
        style={{ height, width: '100%' }} 
        className="rounded-lg border border-border overflow-hidden shadow-sm"
      >
        {(!isScriptLoaded || !apiKey) && (
          <div className="h-full w-full flex items-center justify-center bg-muted/30">
            <div className="text-center p-6">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-60" />
              <p className="text-muted-foreground">
                {!apiKey ? 'Please provide a Google Maps API key' : 'Loading map...'}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {!apiKey && (
        <p className="mt-2 text-sm text-muted-foreground">
          Note: For full functionality, a Google Maps API key is required.
        </p>
      )}
    </div>
  );
};

export default GoogleMap;
