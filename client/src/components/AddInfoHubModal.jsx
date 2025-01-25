import React, { useState } from 'react';
import styled from 'styled-components';
import { IoIosClose } from 'react-icons/io';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import { CustomErrorToast } from '../components';

const AddInfoHubModal = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !link || !file) {
      toast.error('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('link', link);
    formData.append('file', file);

    try {
      const response = await customFetch.post('/infohub', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        toast.success('Info hub item created successfully!');
        onAdd(response.data);
        onClose();
      } else {
        toast.error(
          <CustomSuccessToast message={'Failed to create info hub item.'} />
        );
      }
    } catch (error) {
      toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    }
  };

  return (
    <Container>
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="close-button" onClick={onClose}>
            <IoIosClose size={30} />
          </div>
          <form onSubmit={handleSubmit}>
            <h2>Add Info Hub Item</h2>
            <label>
              Title:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
            <label>
              Description:
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
            <label>
              Link:
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
              />
            </label>
            <label>
              SVG Icon:
              <input
                type="file"
                accept=".svg"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </label>
            <button className="btn" type="submit">
              Add
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-container {
    background: var(--white);
    padding: 2rem;
    border-radius: var(--border-radius);
    position: relative;
    width: 400px;

    h2 {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;

      input,
      textarea {
        width: 100%;
        padding: 0.5rem;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
        border: 1px solid var(--grey-50);
        border-radius: var(--border-radius);
      }
    }

    .add-button {
      background: var(--primary);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius);
      cursor: pointer;
      width: 100%; /* Make the button full width */
      font-size: 1rem;
      font-weight: bold;
      text-align: center;

      &:hover {
        background: var(--primary-dark);
      }
    }
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
`;

export default AddInfoHubModal;
