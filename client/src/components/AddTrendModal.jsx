import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { UploadLogo } from '../components';
import { FiDownload, FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { parseCSV } from '../utils/csvProcessor';
import { IoIosClose } from 'react-icons/io';

const trendsLabel = import.meta.env.VITE_TRENDS_LABEL_BASE_1;
const trendsBase = import.meta.env.VITE_TRENDS_LINK_BASE_1;
const trendsGeo = import.meta.env.VITE_TRENDS_LINK_GEO_1;
const trendsLabel2 = import.meta.env.VITE_TRENDS_LABEL_BASE_2;
const trendsBase2 = import.meta.env.VITE_TRENDS_LINK_BASE_2;
const trendsGeo2 = import.meta.env.VITE_TRENDS_LINK_GEO_2;

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const validMimeTypes = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/csv',
  'text/plain',
];

/**
 * Validates the structure of the parsed JSON data
 * @param {Array<Object>} data - parsed JSON data from the CSV
 * @returns {boolean} - returns true if the structure is valid, else false
 */
const validateJSONStructure = (data) => {
  if (!Array.isArray(data) || data.length === 0) return false;
  const MAX_ENTRIES = 1000; // prevent excessively large data
  if (data.length > MAX_ENTRIES) return false;

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

    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds the maximum limit of 1MB.');
      toast.error('File size exceeds the maximum limit of 1MB.');
      return;
    } // validate max file size

    if (!validMimeTypes.includes(file.type)) {
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
        } // validate the structure of the parsed JSON

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

  const trendsLink1 = `${trendsBase}${encodeURIComponent(
    slug
  )}&geo=${trendsGeo}`;
  const trendsLink2 = `${trendsBase2}${encodeURIComponent(
    slug
  )}&geo=${trendsGeo2}`;

  const links = [
    { label: trendsLabel, href: trendsLink1 },
    { label: trendsLabel2, href: trendsLink2 },
  ];

  return (
    <Overlay>
      <ModalContent>
        <div>
          <UploadLogo />
        </div>
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close Modal"
        >
          <IoIosClose />
        </button>
        <h2>Add Trend Data:</h2>

        {/* Updated Trends Links Section */}
        <div className="trends-links">
          {links.map((link, index) => (
            <div key={index} className="link-item">
              <label className="form-label">{link.label}</label>
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.href}
                <FiDownload size={24} style={{ marginLeft: '10px' }} />
              </a>
            </div>
          ))}
        </div>

        {/* Instructions Box with Download Icon on the Left */}
        <div className="instructions-box">
          <div className="instructions-content">
            <div className="instruction-icon" aria-label="Download Icon">
              <FiDownload size={24} />
            </div>
            <p>
              Use provided links to download the scv file and upload it here.
              The download link looks like the provided icon.
            </p>
          </div>
        </div>

        {error && (
          <ErrorBox>
            <p>{error}</p>
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

// Styled Components

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
  background-color: var(--add-trend-modal-color);
  padding: 20px 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  position: relative;
  text-align: center;

  .modal-close-btn {
    color: var(--black);
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .trends-links {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 15px;

    .link-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 10px;

      .form-label {
        margin-bottom: 5px;
        font-weight: bold;
      }

      a {
        display: flex;
        align-items: center;
        color: #007bff;
        text-decoration: none;
        word-break: break-all;

        &:hover {
          text-decoration: underline;
        }

        svg {
          color: #007bff;
        }
      }
    }
  }

  .instructions-box {
    background-color: var(--card-highlight);
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 15px;

    .instructions-content {
      display: flex;
      align-items: center;

      .instruction-icon {
        color: #007bff;
        margin-right: 10px;
        cursor: pointer;

        &:hover {
          color: #0056b3;
        }

        svg {
          transition: color 0.3s ease;
        }
      }

      p {
        margin: 0;
        font-size: 16px;
        text-align: left;
      }
    }
  }

  .instructions-box .instructions-content p {
    flex: 1; 
  }

  .instructions-box .instructions-content .instruction-icon:hover svg {
    color: #0056b3;
  }

  .instructions-box p {
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
      color: var(--white);
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
    max-height: 200px;
    overflow-y: auto;
    background-color: var(--grey-70);
    padding: 10px;
    border-radius: 5px;
    text-align: left;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`;

const ErrorBox = styled.div`
  margin-top: 20px;
  background-color: var(--red-light); 
  padding: 15px;
  border-radius: 5px;
  text-align: left;

  p {
    color: var(--red-dark);
    margin-bottom: 10px;
  }

  .json-preview {
    background-color: var(--grey-70);
  }
`;
