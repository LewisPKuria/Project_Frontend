//ExcelUpload.js
import React, { useState } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import Button from '@material-ui/core/Button';
import * as XLSX from 'xlsx';

const ExcelUpload = ({ onUpload }) => {
  const [excelFile, setExcelFile] = useState(null);

  const handleUpload = () => {
    if (excelFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const excelData = XLSX.utils.sheet_to_json(worksheet);
        onUpload(excelData);
      };

      reader.readAsArrayBuffer(excelFile);
    }
  };

  return (
    <div style={{ marginTop: 16 }}> {/* Add some margin to the top of the div */}
      <DropzoneArea
        acceptedFiles={['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
        dropzoneText={"Drag and drop an Excel file with location details here"}
        onChange={(files) => setExcelFile(files[0])}
      />
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: 16 }} // Add some margin to the top of the button
        onClick={handleUpload}
      >
        Upload Excel File
      </Button>
    </div>
  );
};

export default ExcelUpload;
