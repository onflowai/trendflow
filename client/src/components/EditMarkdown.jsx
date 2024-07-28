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
    <Outline>
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
          <div className="bottom-bar"></div>
        </div>
      </Container>
    </Outline>
  );
};

const Outline = styled.div`
  padding: 4px; /* Space between the outer border and the editor */
  border: 1.5px solid var(--grey-50); /* Border around the editor */
  border-radius: var(--border-radius); /* Rounded corners */
`;

const Container = styled.div`
 .edit-markdown {
    width: 100%;
    background-color: var(--grey-50);
    border-radius: var( --input-radius);
    position: relative;
    .w-md-editor {
      height: 100%; /* ensuring the editor takes up the full height */
      display: flex;
      flex-direction: column;
    }
    .md-editor-content-editor {
      background-color: red; /* example text color */
      height: 100%; /* ensuring the text input area takes up full height */
    }
    .md-editor-inner{
      background-color: var(--grey-50);
    }
    .cm-editor{
      background-color: var(--white);
    }
    .wmde-markdown-var{
      background-color: var(--grey-50);//tool bar with preview button
      /* border-radius: var(--border-radius-inner); */
    }
    .md-editor-toolbar-warp:not(.md-editor-toolbar-bottom) {
      border-bottom: none;//simple line under the tool bar
    }
    .ͼ2 .cm-gutters{
        border-right: none; //simple line on the right of the number line
    }
    .cm-gutters{
      background-color: var(--white);
    }
    .md-editor-preview {
      background-color: var(--white);
      height: 100%;
    }
    .md-editor-preview{
      border-left: 1.5px solid var(--grey-50) !important;
    }
    .cm-activeLineGutter{
      background-color: var(--grey-30);//active line
    }
    .cm-activeLine {
     background-color: var(--grey-30);//active line
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
    .bottom-bar {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 25px; /* Adjust the height as needed */
      background-color: var(--grey-50);
      border-bottom-left-radius: var(--border-radius-inner);
      border-bottom-right-radius: var(--border-radius-inner);
    }
  }
`;

export default EditMarkdown;
