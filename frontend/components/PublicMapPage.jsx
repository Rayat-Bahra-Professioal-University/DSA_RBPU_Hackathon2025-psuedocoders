import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// FIX for a known issue with react-leaflet and webpack
// This makes sure the marker icons appear correctly.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


export default function PublicMapPage({ issues }) {
  const defaultPosition = [20.5937, 78.9629];

  return (
    // The key change is adding `relative` to this class.
    // This allows the absolutely positioned map to fill this container.
    <main className="flex-grow relative">
      <MapContainer 
        center={defaultPosition} 
        zoom={5} 
        // The style is changed to fill its relative parent.
        style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {issues.map((issue, index) => (
          <Marker 
            key={index} 
            position={[issue.location.latitude, issue.location.longitude]}
          >
            <Popup>
              <div className="text-center w-48">
                <h3 className="font-bold text-base mb-1">{issue.title}</h3>
                <p className="text-xs text-gray-600 mb-2 capitalize">
                  Category: <strong>{issue.category}</strong>
                </p>
                {issue.filePreview && (
                  <img 
                    src={issue.filePreview} 
                    alt={issue.title} 
                    className="w-full h-auto rounded-md object-cover" 
                  />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </main>
  );
}