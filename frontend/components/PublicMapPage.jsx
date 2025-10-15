import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function PublicMapPage({ issues }) {
  // Default center for the map if no issues are present
  const defaultPosition = [20.5937, 78.9629]; // Centered on India

  return (
    <main className="flex-grow">
      {/* The container needs a specific height to be visible */}
      <MapContainer 
        center={defaultPosition} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
      >
        {/* This is the background map image from OpenStreetMap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Map over the issues and create a Marker for each one */}
        {issues.map((issue, index) => (
          <Marker 
            key={index} 
            position={[issue.location.latitude, issue.location.longitude]}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">{issue.title}</h3>
                <p className="text-sm text-gray-600 mb-2 capitalize">
                  Category: <strong>{issue.category}</strong>
                </p>
                {issue.filePreview && (
                  <img 
                    src={issue.filePreview} 
                    alt={issue.title} 
                    className="w-full h-auto rounded-md" 
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