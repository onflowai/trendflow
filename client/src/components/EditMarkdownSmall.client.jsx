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
              title={isEditorVisible ? 'Hide Markdown View' : 'Show Markdown View'}
            >
              {isEditorVisible ? 'Hide View' : 'Open View'}
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
    border-radius: var(--border-radius-inner);
    position: relative;
    color: var(--markdown-text);

    .top-controls {
      display: flex;
      justify-content: flex-end;
      padding: 8px 8px 0 8px;
    }

    .btn-toggle {
      border: 1px solid var(--markdown-border);
      background: var(--markdown-btn-bg);
      color: var(--markdown-btn-text);
      border-radius: var(--border-radius);
      padding: 6px 10px;
      cursor: pointer;
    }

    .btn-toggle:hover {
      border-color: var(--primary-400);
      color: var(--primary-500);
    }

    .w-md-editor {
      height: 100%;
      display: flex;
      flex-direction: column;
      //background-color: var(--markdown-shell-bg);
      color: var(--markdown-text);
      box-shadow: none;
    }

    .md-editor-content {
      background-color: var(--markdown-editor-bg);
    }

    .md-editor-content-editor {
      background-color: var(--markdown-editor-bg);
      height: 100%;
    }

    .md-editor-inner {
      background-color: var(--markdown-editor-bg);
    }

    .cm-editor,
    .cm-scroller,
    .cm-content {
      background-color: var(--markdown-editor-bg);
      color: var(--markdown-text);
    }

    .wmde-markdown-var {
      background-color: var(--grey-50);
    }

    .md-editor-toolbar-warp:not(.md-editor-toolbar-bottom) {
      border-bottom: none;
    }

    .cm-gutters {
      background-color: var(--markdown-editor-bg);
      color: var(--markdown-muted-text);
      border-right: 1px solid var(--markdown-border);
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

    .cm-line{
      color: var(--markdown-text);
    }

    .ͼ1k{
      color: var(--markdown-muted-text);
    }

    .ͼ1l{
      color: var(--markdown-heading-edit);
    }

    .md-editor-preview {
      background-color: var(--markdown-preview-bg);
      color: var(--markdown-text);
      height: 100%;
      border-left: 1.5px solid var(--markdown-border) !important;
    }

    .wmde-markdown,
    .wmde-markdown-color {
      background-color: var(--markdown-preview-bg);
      color: var(--markdown-text);
    }

    .wmde-markdown {
      --color-fg-default: var(--markdown-text);
      --color-fg-muted: var(--markdown-muted-text);
      --color-canvas-default: var(--markdown-preview-bg);
      --color-canvas-subtle: var(--markdown-code-bg);
      --color-border-default: var(--markdown-border);
      --color-border-muted: var(--markdown-border);
      --color-accent-fg: var(--markdown-link);
    }

    .wmde-markdown h1,
    .wmde-markdown h2,
    .wmde-markdown h3,
    .wmde-markdown h4,
    .wmde-markdown h5,
    .wmde-markdown h6 {
      color: var(--markdown-heading-text);
      border-bottom-color: var(--markdown-border);
    }

    .wmde-markdown p,
    .wmde-markdown li,
    .wmde-markdown strong,
    .wmde-markdown em {
      color: var(--markdown-text);
    }

    .wmde-markdown a {
      color: var(--markdown-link);
    }

    .wmde-markdown blockquote {
      color: var(--markdown-quote-text);
      border-left-color: var(--markdown-quote-border);
    }

    .wmde-markdown code,
    .wmde-markdown pre,
    .wmde-markdown pre code,
    .wmde-markdown .code-highlight,
    .wmde-markdown .code-line {
      //background-color: var(--markdown-code-bg);
      color: var(--markdown-code-text);
    }

    .wmde-markdown pre {
      border: 1px solid var(--markdown-border);
    }

    .wmde-markdown table tr {
      background-color: var(--markdown-preview-bg);
      border-top-color: var(--markdown-border);
    }


    .wmde-markdown table th,
    .wmde-markdown table td {
      border-color: var(--markdown-border);
    }

        /* Markdown editor insertion cursor / caret */
    .cm-content {
      caret-color: var(--primary-200) !important;
    }

    /* CodeMirror actual rendered cursor */
    .cm-cursor,
    .cm-cursor-primary,
    .cm-dropCursor {
      border-left-color: var(--primary-200) !important;
      border-left-width: 2px !important;
    }

    /* Makes cursor easier to see when editor is focused */
    .cm-focused .cm-cursor,
    .cm-focused .cm-cursor-primary {
      border-left-color: var(--primary-200) !important;
      box-shadow: 0 0 8px var(--primary-200);
    }

    /* Optional: text selection color */
    .cm-selectionBackground,
    .cm-focused .cm-selectionBackground {
      background-color: color-mix(
        in srgb,
        var(--primary-200) 35%,
        transparent
      ) !important;
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