import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { IoIosClose } from 'react-icons/io';
import { IoSettingsSharp } from 'react-icons/io5';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { CustomErrorToast } from '../components';
import FormComponentLogos from './FormComponentLogos';
/**
 * Modal for adding tech or category 
 * @param {*} s 
 * @returns 
 */
const normalizeSpaces = (s = '') => s.trim().replace(/\s+/g, ' ');

const toKey = (value = '') => {
  const clean = normalizeSpaces(value);
  const alnumSpace = clean.replace(/[^a-zA-Z0-9 ]/g, '');
  return alnumSpace.trim().replace(/\s+/g, '_').toUpperCase();
};

const toFileName = (value = '') => {
  const clean = normalizeSpaces(value);
  const alnumSpace = clean.replace(/[^a-zA-Z0-9 ]/g, '');
  return `${alnumSpace.trim().toLowerCase().replace(/\s+/g, '-')}.svg`;
};

const AdminSettingModal = ({ currentUser, onCreated, className }) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('technology');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const isAdmin = useMemo(() => {
    const role = (currentUser?.role || '').toString();
    return role === 'admin' || role === 'superAdmin';
  }, [currentUser]);

  const preview = useMemo(() => {
    const v = normalizeSpaces(value);
    if (!v) return null;

    const key = toKey(v);
    const fileName = toFileName(v);
    const base = mode === 'category' ? '/assets/cat' : '/assets';

    return {
      key,
      label: v,
      value: v,
      fileName,
      image: `${base}/${fileName}`,
    };
  }, [value, mode]);

  const reset = () => {
    setMode('technology');
    setValue('');
    setDescription('');
    setLoading(false);
  };

  const onClose = () => {
    setOpen(false);
    reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v = normalizeSpaces(value);
    const d = normalizeSpaces(description);

    if (!v) return toast.error('Value is required.');
    if (d.length > 500) return toast.error('Description max 500 characters.');

    setLoading(true);

    try {
      if (mode === 'category') {
        const res = await customFetch.post('/icons/icon-data/category', {
          value: v,
          description: d,
        });

        toast.success('Category created successfully!');
        onCreated?.(res.data);
      } else {
        const res = await customFetch.post('/icons/icon-data/technology', {
          value: v,
          description: d,
        });

        toast.success('Technology created successfully!');
        onCreated?.(res.data);
      }

      onClose();
    } catch (error) {
      toast.error(
        <CustomErrorToast
          message={
            error?.response?.data?.message ||
            error?.response?.data?.msg ||
            'Request failed'
          }
        />
      );
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <AdminSettingsShell className="admin-settings-shell">
      <button
        type="button"
        className={`admin-settings-trigger ${className || ''}`}
        onClick={() => setOpen(true)}
        aria-label="Admin settings"
      >
        <IoSettingsSharp />
      </button>

      {open && (
        <div className="admin-settings-overlay" onMouseDown={onClose}>
          <div
            className="admin-settings-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="admin-settings-close"
              onClick={onClose}
              aria-label="Close admin settings"
            >
              <IoIosClose size={30} />
            </button>

            <div>
              <h2>Add Tech</h2>

              <div className="admin-settings-tabs">
                <button
                  type="button"
                  className={
                    mode === 'technology'
                      ? 'admin-settings-tab active'
                      : 'admin-settings-tab'
                  }
                  onClick={() => setMode('technology')}
                  disabled={loading}
                >
                  Technology
                </button>

                <button
                  type="button"
                  className={
                    mode === 'category'
                      ? 'admin-settings-tab active'
                      : 'admin-settings-tab'
                  }
                  onClick={() => setMode('category')}
                  disabled={loading}
                >
                  Category
                </button>
              </div>

              <FormComponentLogos
                type="text"
                name="value"
                labelText={mode === 'category' ? 'Category Value' : 'Technology Value'}
                placeholder={
                  mode === 'category'
                    ? 'e.g. Infrastructure as Code'
                    : 'e.g. Cherry Studio'
                }
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={loading}
              />

              <label className="admin-settings-label">
                Description:
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional (max 500 chars)"
                  disabled={loading}
                />
              </label>

              <div className="admin-settings-preview">
                {!preview ? (
                  <p className="admin-settings-muted">
                    Type a value to preview the generated key + file name.
                  </p>
                ) : (
                  <>
                    <p>
                      <span>key:</span> {preview.key}
                    </p>
                    <p>
                      <span>fileName:</span> {preview.fileName}
                    </p>
                    <p>
                      <span>image:</span> {preview.image}
                    </p>
                  </>
                )}
              </div>

              <button
                type="button"
                className="admin-settings-add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Adding…' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminSettingsShell>
  );
};

const AdminSettingsShell = styled.div`
  .admin-settings-trigger {
    width: 50px;
    height: 50px;
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
    border: 1.5px solid var(--grey-50);
    border-left: 0;
    background: transparent;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color);
    transition: color 0.3s ease, background 0.3s ease;
  }

  .admin-settings-trigger:hover {
    color: var(--primary-500);
    background: var(--grey-30);
  }

  .admin-settings-trigger svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  .admin-settings-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .admin-settings-modal {
    background: var(--white);
    color: var(--text-color);
    padding: 2rem;
    border-radius: var(--border-radius);
    position: relative;
    width: 460px;
    max-width: 92vw;
    border: 1.5px solid var(--grey-50);
  }

  .admin-settings-modal h2 {
    margin-bottom: 1rem;
  }

  .admin-settings-close {
    position: absolute;
    top: 10px;
    right: 10px;
    width: auto;
    height: auto;
    border: none;
    background: transparent;
    color: var(--text-color);
    cursor: pointer;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .admin-settings-label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-color);
  }

  .admin-settings-label textarea {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid var(--grey-50);
    border-radius: var(--border-radius);
    background: transparent;
    color: var(--text-color);
    min-height: 90px;
    resize: vertical;
  }

  .admin-settings-tabs {
    display: flex;
    gap: 8px;
    margin: 0.5rem 0 1rem 0;
  }

  .admin-settings-tab {
    flex: 1;
    border: 1px solid var(--grey-50);
    background: transparent;
    color: var(--text-color);
    padding: 0.6rem 0.75rem;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 600;
  }

  .admin-settings-tab.active {
    border-color: var(--primary-500);
    color: var(--primary-500);
    background: var(--grey-30);
  }

  .admin-settings-preview {
    border: 1px solid var(--grey-50);
    border-radius: var(--border-radius);
    padding: 0.75rem;
    margin-bottom: 1rem;
    background: transparent;
  }

  .admin-settings-preview p {
    margin: 0.25rem 0;
    word-break: break-word;
  }

  .admin-settings-preview span {
    font-weight: 700;
    margin-right: 6px;
  }

  .admin-settings-muted {
    opacity: 0.75;
  }

  .admin-settings-add-btn {
    width: 100%;
    min-height: 48px;
    border: none;
    border-radius: var(--border-radius);
    background: var(--primary-300);
    color: var(--white);
    padding: 0.75rem 1rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 700;
    text-align: center;
    transition: background 0.3s ease, opacity 0.3s ease;
  }

  .admin-settings-add-btn:hover {
    background: var(--primary-600);
  }

  .admin-settings-add-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export default AdminSettingModal;