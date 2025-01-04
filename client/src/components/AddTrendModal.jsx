// AddTrendModal.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { UploadLogo } from '../components';
import { FiDownload, FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { parseCSV } from '../utils/csvProcessor';
const trendsBase = import.meta.env.VITE_TRENDS_BASE_1;
const trendsGeo = import.meta.env.VITE_TRENDS_GEO_1;
/**
 *
 */

/**
 * validates the structure of the parsed JSON data
 * @param {Array<Object>} data - parsed JSON data from the CSV
 * @returns {boolean} - returns true if the structure is valid, else false
 */
const validateJSONStructure = (data) => {
  if (!Array.isArray(data)) return false;
  for (let item of data) {
    if (
      typeof item.date !== 'string' ||
      typeof item.count !== 'number' ||
      isNaN(new Date(item.date).getTime())
    ) {
      return false;
    }
  }
  return true;
};

/**
 * AddTrendModal Component
 *
 * @param {Function} onClose - function to close the modal
 * @param {Function} onAdd - function to notify the parent to refresh trends
 * @param {string} slug - slug of the trend to be manually approved
 * @param {Function} onManualApprove - Function to handle manual approval
 */
const AddTrendModal = ({ onClose, onAdd, slug, onManualApprove }) => {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // handle file upload and parsing
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      setError('No file selected.');
      toast.error('No file selected.');
      return;
    } // validate file existence

    if (
      file.type !== 'text/csv' &&
      file.type !== 'application/vnd.ms-excel' &&
      file.type !== 'application/csv'
    ) {
      setError('Please upload a valid CSV file.');
      toast.error('Please upload a valid CSV file.');
      return;
    } // validate file type (CSV)

    const reader = new FileReader();

    reader.onload = async (event) => {
      const text = event.target.result;
      try {
        const parsedData = parseCSV(text); // parseCSV from utility
        setJsonData(parsedData);
        setError('');

        const isValid = validateJSONStructure(parsedData);
        if (!isValid) {
          setError('Incorrect Structure of CSV');
          toast.error('Incorrect Structure of CSV');
          return;
        } // validating the structure of the parsed JSON

        setIsUploading(true);
        await onManualApprove(slug, parsedData);
        toast.success('Trend data added successfully!');
        onAdd(); // to Admin component to refresh trends
        onClose(); // close the modal
      } catch (err) {
        setError(`Error parsing CSV: ${err.message}`);
        toast.error(`Error: ${err.message}`);
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setError('Error reading file.');
      toast.error('Error reading file.');
    };

    reader.readAsText(file);
  };

  // Generate the Google Trends link using the slug
  const trendsLink = `${trendsBase}${encodeURIComponent(
    slug
  )}&geo=${trendsGeo}`;

  return (
    <Overlay>
      <ModalContent>
        <div>
          <UploadLogo />
        </div>
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Add Trend Data</h2>
        <div className="google-trends-link">
          <a href={trendsLink} target="_blank" rel="noopener noreferrer">
            {trendsLink}
          </a>
          <FiDownload size={24} style={{ marginLeft: '10px' }} />
        </div>
        <div className="instructions-box">
          <p>
            Please upload a CSV file containing the trend data. Ensure the data
            structure is correct.
          </p>
        </div>
        {error && (
          <ErrorBox>
            <p>Incorrect Structure of CSV</p>
          </ErrorBox>
        )}
        {jsonData && (
          <ConvertedFileContainer>
            <h3>Converted File:</h3>
            <div className="json-preview">
              <pre>{JSON.stringify(jsonData, null, 2)}</pre>
            </div>
          </ConvertedFileContainer>
        )}
        <FileInputContainer>
          <input
            type="file"
            accept=".csv"
            id="csv-upload"
            onChange={handleFileUpload}
            style={{ display: 'none' }} // Hide the default file input
          />
          <label htmlFor="csv-upload" className="upload-label">
            <FiUpload size={30} />
            <span>Choose File</span>
          </label>
        </FileInputContainer>
      </ModalContent>
    </Overlay>
  );
};

AddTrendModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired,
  onManualApprove: PropTypes.func.isRequired,
};

export default AddTrendModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  position: relative;
  text-align: center;

  .modal-close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .google-trends-link {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;

    a {
      color: #007bff;
      text-decoration: none;
      word-break: break-all;
    }
  }

  .instructions-box {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 15px;
  }

  .error-message {
    color: red;
    margin-top: 10px;
  }

  .json-preview {
    margin-top: 10px;
    max-height: 200px;
    overflow-y: scroll;
    background-color: #f4f4f4;
    padding: 10px;
    border-radius: 5px;
    text-align: left;
  }
`;

const FileInputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  .upload-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    color: var(--primary-400);
    transition: color 0.3s ease, background-color 0.3s ease;
    padding: 10px;
    border: 2px dashed var(--primary-400);
    border-radius: 8px;
    width: 150px;
    height: 100px;
    justify-content: center;

    &:hover {
      color: #ffffff;
      background-color: var(--primary-400);
    }

    span {
      margin-top: 5px;
      font-size: 14px;
    }

    svg {
      transition: color 0.3s ease;
    }
  }
`;

const ConvertedFileContainer = styled.div`
  margin-top: 20px;
  text-align: left;

  h3 {
    margin-bottom: 10px;
  }

  .json-preview {
    background-color: #e8e8e8;
  }
`;

const ErrorBox = styled.div`
  margin-top: 20px;
  background-color: #f0f0f0; 
  padding: 15px;
  border-radius: 5px;
  text-align: left;

  p {
    color: red;
    margin-bottom: 10px;
  }

  .json-preview {
    background-color: #dcdcdc;
  }
`;
