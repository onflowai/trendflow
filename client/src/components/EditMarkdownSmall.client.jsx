import React, { useState, useEffect, lazy, Suspense } from 'react';
import styled from 'styled-components';

/**
 * EditMarkdown Lazy-load the UIW editor on the client only
 * NOTE: "visible" here controls whether the editor pane is shown UIW behavior
 */
const MarkdownEditor = lazy(() => import('@uiw/react-markdown-editor'));

export default function EditMarkdown({
  initialContent,
  onContentChange,
  previewOpen = true,
  height = '700px',
}) {
  const [content, setContent] = useState(initialContent || '');
  const [isEditorVisible, setIsEditorVisible] = useState(!!previewOpen);

  useEffect(() => {
    setContent(initialContent || '');
  }, [initialContent]);

  useEffect(() => {
    setIsEditorVisible(!!previewOpen);
  }, [previewOpen]);

  const handleChange = (editorValue) => {
    setContent(editorValue);
    onContentChange(editorValue);
  };

  return (
    <Outline>
      <Container>
        <div className="edit-markdown">
          <div className="top-controls">
            <button
              type="button"
              className="btn-toggle"
              onClick={() => setIsEditorVisible((v) => !v)}
              title={isEditorVisible ? 'Hide editor' : 'Show editor'}
            >
              {isEditorVisible ? 'Hide Editor' : 'Edit Markdown'}
            </button>
          </div>

          <Suspense fallback={<div>Loading Editor…</div>}>
            <MarkdownEditor
              value={content}
              onChange={handleChange}
              visible={isEditorVisible}
              toolbars={false}
              enableScroll={true}
              height={height}
            />
          </Suspense>

          <div className="bottom-bar"></div>
        </div>
      </Container>
    </Outline>
  );
}

// The same styled-components from your original code + tiny control styling
const Outline = styled.div`
  padding: 4px;
  border: 1.5px solid var(--grey-50);
  border-radius: var(--border-radius);
`;

const Container = styled.div`
  .edit-markdown {
    width: 100%;
    background-color: var(--grey-50);
    border-radius: var(--input-radius);
    position: relative;

    .top-controls {
      display: flex;
      justify-content: flex-end;
      padding: 8px 8px 0 8px; /*HERE*/
    }

    .btn-toggle {
      border: 1px solid var(--grey-50);
      background: var(--white);
      border-radius: var(--border-radius);
      padding: 6px 10px;
      cursor: pointer;
    }

    .w-md-editor {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .md-editor-content-editor {
      background-color: red; /* keeping your existing styling, even if it hurts my soul */
      height: 100%;
    }

    .md-editor-inner {
      background-color: var(--grey-50);
    }

    .cm-editor {
      background-color: var(--white);
    }

    .wmde-markdown-var {
      background-color: var(--grey-50);
    }

    .md-editor-toolbar-warp:not(.md-editor-toolbar-bottom) {
      border-bottom: none;
    }

    .ͼ2 .cm-gutters {
      border-right: none;
    }

    .cm-gutters {
      background-color: var(--white);
    }

    .md-editor-preview {
      background-color: var(--white);
      height: 100%;
    }

    .wmde-markdown-color {
      background-color: var(--white);
    }

    .md-editor-preview {
      border-left: 1.5px solid var(--grey-50) !important;
    }

    .cm-activeLineGutter {
      background-color: var(--grey-30);
    }

    .cm-activeLine {
      background-color: var(--grey-30);
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