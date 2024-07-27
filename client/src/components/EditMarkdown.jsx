import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MarkdownEditor from '@uiw/react-markdown-editor';
// import '@uiw/react-markdown-editor/dist/markdown-editor.css';

const EditMarkdown = ({ initialContent, onContentChange }) => {
  const [content, setContent] = useState(initialContent || '');

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleChange = (editor, data, value) => {
    setContent(value);
    onContentChange(value);
  };

  return (
    <Container>
      <div className="edit-markdown">
        <MarkdownEditor
          value={content}
          onChange={handleChange}
          visible={true} /* Automatically show preview */
          toolbars={false} /* Remove toolbar */
          enableScroll={true} /* Enable scrolling */
          height="500px"
        />
      </div>
    </Container>
  );
};

const Container = styled.div`
 .edit-markdown {
    width: 100%;
    background-color: var(--grey-50);
    border-radius: var(--border-radius);
    .w-md-editor {
      height: 100%; /* ensuring the editor takes up the full height */
      display: flex;
      flex-direction: column;
    }
    .md-editor-content-editor {
      color: #d5d4d4; /* example text color */
      height: 100%; /* ensuring the text input area takes up full height */
    }
    .md-editor-inner{
      background-color: var(--grey-50);
    }
    .cm-editor{
      background-color: var(--grey-50);
    }
    .w-md-editor-preview {
      flex: 1; 
      overflow: auto;
      background-color: #5387bc; 
      color: #333333; 
      height: 100%; 
    }
    .md-editor-toolbar button {
      color: var(--grey-100);
    }
    .md-editor-toolbar button.active {
      color: var(--primary-800);
    }
    .edit-markdown .md-editor-toolbar {
      color: var(--grey-100);
    }
  }
`;

export default EditMarkdown;
