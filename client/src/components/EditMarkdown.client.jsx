import React, { useState, useEffect, lazy, Suspense } from 'react';
import styled from 'styled-components';

/**
 * EditMarkdown Lazy-load the UIW editor on the client only
 */
const MarkdownEditor = lazy(() => import('@uiw/react-markdown-editor'));

export default function EditMarkdown({ initialContent, onContentChange }) {
  const [content, setContent] = useState(initialContent || '');

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleChange = (editorValue) => {
    setContent(editorValue);
    onContentChange(editorValue);
  };

  return (
    <Outline>
      <Container>
        <div className="edit-markdown">
          {/* Suspense fallback is rendered while the UIW editor chunk loads in the browser */}
          <Suspense fallback={<div>Loading Editor…</div>}>
            <MarkdownEditor
              value={content}
              onChange={handleChange}
              visible={true}
              toolbars={false}
              enableScroll={true}
              height="700px"
            />
          </Suspense>
          <div className="bottom-bar"></div>
        </div>
      </Container>
    </Outline>
  );
}

// The same styled-components from your original code:
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
      background-color: var(--white); //the editor goes into dark mode on its own..
      height: 100%;
    }
    .wmde-markdown-color{
      background-color: var(--white); 
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
      height: 25px;
      background-color: var(--grey-50);
      border-bottom-left-radius: var(--border-radius-inner);
      border-bottom-right-radius: var(--border-radius-inner);
    }
  }
`;
