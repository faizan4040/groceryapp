'use client'

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

const ChangeMapView = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 14);
  }, [coords, map]);
  return null;
};

interface StoreMapProps {
  selectedStore: any;
  stores: any[];
}

const StoreMap = ({ selectedStore, stores }: StoreMapProps) => {
  return (
    <MapContainer
      center={[selectedStore.lat, selectedStore.lng]}
      zoom={13}
      zoomControl={false}
      className="w-full h-full z-0" // Lower z-index for the map
    >
      <ChangeMapView coords={[selectedStore.lat, selectedStore.lng]} />
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      {stores.map(store => (
        <Marker key={store.id} position={[store.lat, store.lng]}>
          <Popup>
            <div className="p-1 font-sans">
              <p className="font-black text-sm">{store.name}</p>
              <p className="text-xs text-slate-500">{store.timing}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default StoreMap;