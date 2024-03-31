import React, { useState } from 'react';
import { ImageUpload } from './home';
import Map from './map';
import UserRoleSelection from './UserRoleSelection'; // Import the new component
import Button from '@material-ui/core/Button';

function App() {
  const [userRole, setUserRole] = useState(null);

  const handleRoleSelect = (role) => {
    setUserRole(role);
  };

  return (
    <div>
      {!userRole && <UserRoleSelection onRoleSelect={handleRoleSelect} />} {/* Render UserRoleSelection if user role is not selected */}
      {userRole === 'farmer' && (
        <div>
          <div style={{ margin: '2px', textAlign:'left' }}>
            <h2>Upload Potato Plant Leaf Images Below:</h2>
          </div>
          <ImageUpload />
        </div>
      )}
      {userRole === 'agricultural_officer' && (
        <div>
          <h2>INTERACTIVE LEAFLET MAP:</h2>
          <Map />
          <div style={{ margin: '2px', textAlign:'left' }}>
            <h2>Upload Potato Plant Leaf Images Below:</h2>
          </div>
          <ImageUpload />
        </div>
      )}
    </div>
  );
}

export default App;
