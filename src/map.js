// Map.js
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as XLSX from 'xlsx';
import Papa from 'papaparse'; // Add PapaParse library for CSV parsing
import './Map.css';

const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [file, setFile] = useState(null);
  const [headerOptions, setHeaderOptions] = useState({
    latitude: null,
    longitude: null,
    description: null,
  });
  const [allColumns, setAllColumns] = useState([]);

  useEffect(() => {
    const map = L.map('map').setView([1.2921, 36.8219], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const customIcon = new L.Icon({
      iconUrl: process.env.PUBLIC_URL + '/camera-icon.png', // Replace with your marker icon path
      iconSize: [20, 20],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });

    const addMarkersToMap = () => {
      markers.forEach((marker) => {
        const isValidLatLng = !isNaN(marker.latitude) && !isNaN(marker.longitude);
    
        if (isValidLatLng) {
          L.marker([marker.latitude, marker.longitude], { icon: customIcon })
            .addTo(map)
            .bindPopup(marker.description)
            .openPopup();
        } else {
          console.warn(`Invalid latitude or longitude for marker: ${JSON.stringify(marker)}`);
        }
      });
    };
    

    addMarkersToMap();

    return () => {
      map.remove();
    };
  }, [markers, headerOptions.latitude, headerOptions.longitude, headerOptions.description]);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];

    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);

      if (uploadedFile.name.endsWith('.xlsx') || uploadedFile.name.endsWith('.xls')) {
        // Handle XLSX file
        handleXLSXFile(data);
      } else if (uploadedFile.name.endsWith('.csv')) {
        // Handle CSV file
        handleCSVFile(data);
      } else {
        alert('Unsupported file format. Please upload an XLSX or CSV file.');
      }
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  const handleXLSXFile = (data) => {
    try {
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];

      // Dynamically set all columns in the state
      setAllColumns(headers);

      setHeaderOptions({
        latitude: null,
        longitude: null,
        description: null,
      });
    } catch (error) {
      console.error('Error reading XLSX file:', error);
      alert('Error reading XLSX file. Please check your file and try again.');
    }
  };

  const handleCSVFile = (data) => {
    try {
      const text = new TextDecoder().decode(data);
      const parsedData = Papa.parse(text, { header: true });

      const headers = parsedData.meta.fields;

      // Dynamically set all columns in the state
      setAllColumns(headers);

      setHeaderOptions({
        latitude: null,
        longitude: null,
        description: null,
      });
    } catch (error) {
      console.error('Error parsing CSV file:', error);
      alert('Error parsing CSV file. Please check your file and try again.');
    }
  };

  const handleHeaderChange = (type, selectedHeader) => {
    setHeaderOptions({ ...headerOptions, [type]: selectedHeader });
  };

  const handleMarkerCreation = () => {
    if (headerOptions.latitude && headerOptions.longitude && headerOptions.description) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);

        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          // Handle XLSX file
          handleXLSXFileForMarkers(data);
        } else if (file.name.endsWith('.csv')) {
          // Handle CSV file
          handleCSVFileForMarkers(data);
        }
      };

      reader.readAsArrayBuffer(file);
    } else {
      alert('Please select columns for latitude, longitude, and description.');
    }
  };

  const handleXLSXFileForMarkers = (data) => {
    try {
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const dataArray = XLSX.utils.sheet_to_json(sheet);

      const newMarkers = dataArray.map((item) => ({
        latitude: parseFloat(item[headerOptions.latitude]),
        longitude: parseFloat(item[headerOptions.longitude]),
        description: item[headerOptions.description],
      }));

      setMarkers(newMarkers);
    } catch (error) {
      console.error('Error reading XLSX file for markers:', error);
      alert('Error reading XLSX file for markers. Please check your file and try again.');
    }
  };

  const handleCSVFileForMarkers = (data) => {
    try {
      const text = new TextDecoder().decode(data);
      const parsedData = Papa.parse(text, { header: true });

      const newMarkers = parsedData.data.map((item) => ({
        latitude: parseFloat(item[headerOptions.latitude]),
        longitude: parseFloat(item[headerOptions.longitude]),
        description: item[headerOptions.description],
      }));

      setMarkers(newMarkers);
    } catch (error) {
      console.error('Error parsing CSV file for markers:', error);
      alert('Error parsing CSV file for markers. Please check your file and try again.');
    }
  };

  return (
    <div className="map-container">
      <div className="file-input-container">
        <span>Upload Coordinates Below: </span>
        <label htmlFor="file" className="custom-file-input">
          {file ? file.name : 'Choose File'}
        </label>
        <input type="file" id="file" className="file-input" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
      </div>
      <div className="button-container">
        <div className="dropdown-container">
          <label>Latitude (Y): </label>
          <select
            value={headerOptions.latitude || ''}
            onChange={(e) => handleHeaderChange('latitude', e.target.value)}
            className="select-dropdown"
          >
            <option value={null}>Select</option>
            {allColumns.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>
        <div className="dropdown-container">
          <label>Longitude (X): </label>
          <select
            value={headerOptions.longitude || ''}
            onChange={(e) => handleHeaderChange('longitude', e.target.value)}
            className="select-dropdown"
          >
            <option value={null}>Select</option>
            {allColumns.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>
        <div className="dropdown-container">
          <label>Description: </label>
          <select
            value={headerOptions.description || ''}
            onChange={(e) => handleHeaderChange('description', e.target.value)}
            className="select-dropdown"
          >
            <option value={null}>Select</option>
            {allColumns.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>
        <button className="create-button" onClick={handleMarkerCreation}>
          Create Markers
        </button>
      </div>
      <div id="map" className="map" />
    </div>
  );
};

export default Map;
