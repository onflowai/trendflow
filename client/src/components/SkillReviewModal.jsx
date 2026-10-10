import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import {
  CustomErrorToast,
  CustomSuccessToast,
  LoadingBar,
} from '.';
import EditMarkdown from './EditMarkdown.client';
import EditMarkdownMini from './EditMarkdownMini.client';
import useLocalStorage from '../hooks/useLocalStorage';
import customFetch from '../utils/customFetch';

import skillFlowColor from '../assets/images/skillflow-color.svg';
import skillFlowGreen from '../assets/images/skillflow-green.svg';

const toArray = (value) => {
  return Array.isArray(value) ? value : [];
};

const updateArrayItem = (items, index, value) => {
  return items.map((item, itemIndex) =>
    itemIndex === index ? value : item
  );
};

const updateWorkflowField = (
  items,
  index,
  field,
  value
) => {
  return items.map((item, itemIndex) =>
    itemIndex === index
      ? {
          ...item,
          [field]: value,
        }
      : item
  );
};

const isDifferent = (a, b) => {
  return JSON.stringify(a) !== JSON.stringify(b);
};

const FieldHeader = ({ title, active }) => {
  return (
    <div className="indicator-container skill-review-field-header">
      <div
        className={`indicator ${active ? 'active' : ''}`}
      ></div>

      <h5>{title}</h5>
    </div>
  );
};

const SkillReviewModal = ({
  skillObject,
  setSkillObject,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  };

  const handleClose = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    setIsOpen(false);
  };

  const storageKey =
    `tf_skill_review_draft_v1_${skillObject?.slug || 'empty'}`;

  const [draft, setDraft] = useLocalStorage(
    storageKey,
    null
  );

  const [markdown, setMarkdown] = useState('');
  const [useWhen, setUseWhen] = useState([]);
  const [doNotUseWhen, setDoNotUseWhen] = useState([]);
  const [commonMistakes, setCommonMistakes] = useState([]);
  const [
    verificationCommands,
    setVerificationCommands,
  ] = useState([]);
  const [
    verificationManualChecks,
    setVerificationManualChecks,
  ] = useState([]);
  const [outputFormat, setOutputFormat] = useState('');
  const [workflow, setWorkflow] = useState([]);
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [
    isGeneratingMarkdown,
    setIsGeneratingMarkdown,
  ] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const original = useMemo(() => {
    return {
      markdown: skillObject?.markdown || '',
      useWhen: toArray(skillObject?.useWhen),
      doNotUseWhen: toArray(
        skillObject?.doNotUseWhen
      ),
      commonMistakes: toArray(
        skillObject?.commonMistakes
      ),
      verificationCommands: toArray(
        skillObject?.verification?.commands
      ),
      verificationManualChecks: toArray(
        skillObject?.verification?.manualChecks
      ),
      outputFormat: skillObject?.outputFormat || '',
      workflow: toArray(skillObject?.workflow),
    };
  }, [skillObject]);

  const indicatorState = {
    markdown:
      markdown !== original.markdown,

    useWhen:
      isDifferent(
        useWhen,
        original.useWhen
      ),

    doNotUseWhen:
      isDifferent(
        doNotUseWhen,
        original.doNotUseWhen
      ),

    commonMistakes:
      isDifferent(
        commonMistakes,
        original.commonMistakes
      ),

    verification:
      isDifferent(
        verificationCommands,
        original.verificationCommands
      ) ||
      isDifferent(
        verificationManualChecks,
        original.verificationManualChecks
      ),

    outputFormat:
      outputFormat !== original.outputFormat,

    workflow:
      isDifferent(
        workflow,
        original.workflow
      ),
  };

  const hasDraftChanges =
    Object.values(indicatorState).some(Boolean);

  /*
   * Hydrate the editor exactly once for this Skill slug.
   * The key on SkillReviewModal forces a new mount for a new slug.
   */
  useEffect(() => {
    if (!skillObject?.slug) return;

    const source =
      draft?.slug === skillObject.slug
        ? draft
        : original;

    setMarkdown(source.markdown || '');
    setUseWhen(toArray(source.useWhen));
    setDoNotUseWhen(
      toArray(source.doNotUseWhen)
    );
    setCommonMistakes(
      toArray(source.commonMistakes)
    );
    setVerificationCommands(
      toArray(source.verificationCommands)
    );
    setVerificationManualChecks(
      toArray(source.verificationManualChecks)
    );
    setOutputFormat(
      source.outputFormat || ''
    );
    setWorkflow(
      toArray(source.workflow)
    );

    /*
     * Prevent the empty initial React state from being written
     * over the stored draft during the first render.
     */
    setIsHydrated(true);
  }, [skillObject?.slug]);

  /*
   * Persist only actual unsaved changes.
   */
  useEffect(() => {
    if (!isHydrated) return;
    if (!skillObject?.slug) return;

    if (!hasDraftChanges) {
      setDraft(null);
      return;
    }

    setDraft({
      slug: skillObject.slug,
      markdown,
      useWhen,
      doNotUseWhen,
      commonMistakes,
      verificationCommands,
      verificationManualChecks,
      outputFormat,
      workflow,
      updatedAt: Date.now(),
    });
  }, [
    isHydrated,
    skillObject?.slug,
    hasDraftChanges,
    markdown,
    useWhen,
    doNotUseWhen,
    commonMistakes,
    verificationCommands,
    verificationManualChecks,
    outputFormat,
    workflow,
    setDraft,
  ]);

  const handleCreateMarkdown = async () => {
    try {
      setIsGeneratingMarkdown(true);

      const { data } = await customFetch.patch(
        `/skills/${skillObject.slug}/create-markdown`,
        {
          useWhen,
          doNotUseWhen,
          commonMistakes,
          verification: {
            commands: verificationCommands,
            manualChecks: verificationManualChecks,
          },
          outputFormat,
          workflow,
        }
      );

      setMarkdown(data.markdown || '');
      setSkillObject?.(data.skill);
      setDraft(null);

      toast.success(
        <CustomSuccessToast message="SKILL.md created" />
      );
    } catch (error) {
      toast.error(
        <CustomErrorToast
          message={
            error?.response?.data?.msg ||
            'Error creating SKILL.md'
          }
        />
      );
    } finally {
      setIsGeneratingMarkdown(false);
    }
  };

  return (
    <Container>
      <div className="review-skill-row">
        <button
          type="button"
          className="review-skill-btn"
          onClick={handleOpen}
        >
          <span className="review-skill-icon-wrap">
            <img
              className="review-skill-icon review-skill-icon-default"
              src={skillFlowGreen}
              alt=""
              draggable={false}
            />

            <img
              className="review-skill-icon review-skill-icon-hover"
              src={skillFlowColor}
              alt=""
              draggable={false}
            />
          </span>

          <span>Review Skill:</span>
          <strong>{skillObject.slug}</strong>
        </button>
      </div>

      {isOpen && (
        <div
          className="skill-review-overlay"
          onClick={handleClose}
        >
          <div
            className="skill-review-panel"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="skill-review-top">
              <div className="skill-review-brand">
                <img
                  src={skillFlowColor}
                  alt=""
                  draggable={false}
                />

                <div>
                  <h4>Review Skill</h4>
                  <p>{skillObject.title}</p>
                </div>
              </div>

              <button
                type="button"
                className="skill-review-close"
                onClick={handleClose}
                aria-label="Close Skill review"
              >
                ×
              </button>
            </div>

            <div className="skill-review-meta-grid">
              <div className="skill-review-meta-card">
                <h5>Generation Source</h5>

                <p>
                  Model:{' '}
                  {skillObject?.generationSource?.model ||
                    'n/a'}
                </p>

                <p>
                  Prompt:{' '}
                  {skillObject?.generationSource
                    ?.promptVersion || 'n/a'}
                </p>

                <p>
                  Generated:{' '}
                  {skillObject?.generationSource
                    ?.generatedAt
                    ? new Date(
                        skillObject.generationSource
                          .generatedAt
                      ).toLocaleString()
                    : 'n/a'}
                </p>

                <p>
                  Trend Context:{' '}
                  {String(
                    skillObject?.generationSource
                      ?.usedTrendContext
                  )}
                </p>

                <p>
                  Trend Blog:{' '}
                  {String(
                    skillObject?.generationSource
                      ?.usedTrendBlog
                  )}
                </p>
              </div>

              <div className="skill-review-meta-card">
                <h5>Safety</h5>

                <p>
                  Scripts:{' '}
                  {String(
                    skillObject?.safety?.hasScripts
                  )}
                </p>

                <p>
                  Network:{' '}
                  {String(
                    skillObject?.safety?.requiresNetwork
                  )}
                </p>

                <p>
                  Secrets:{' '}
                  {String(
                    skillObject?.safety?.requiresSecrets
                  )}
                </p>

                <p>
                  Risk:{' '}
                  {skillObject?.safety?.riskLevel ||
                    'n/a'}
                </p>

                <p>
                  Installs:{' '}
                  {skillObject?.installCount ?? 0}
                </p>
              </div>
            </div>

            <details className="skill-review-markdown-box">
              <summary>
                <span>SKILL.md</span>

                {skillObject.markdownNeedsRegeneration && (
                  <strong>not generated</strong>
                )}
              </summary>

              <FieldHeader
                title="Markdown"
                active={indicatorState.markdown}
              />

              <EditMarkdown
                initialContent={markdown}
                onContentChange={setMarkdown}
                previewOpen={false}
                height="500px"
              />
            </details>

            <div className="skill-review-section">
              <FieldHeader
                title="Use When"
                active={indicatorState.useWhen}
              />

              {useWhen.map((item, index) => (
                <div
                  className="skill-edit-item"
                  key={`useWhen-${index}`}
                >
                  <h6>Use {index + 1}:</h6>

                  <EditMarkdownMini
                    initialContent={item}
                    onContentChange={(value) =>
                      setUseWhen((current) =>
                        updateArrayItem(
                          current,
                          index,
                          value
                        )
                      )
                    }
                    height="120px"
                  />
                </div>
              ))}
            </div>

            <div className="skill-review-section">
              <FieldHeader
                title="Do Not Use When"
                active={indicatorState.doNotUseWhen}
              />

              {doNotUseWhen.map((item, index) => (
                <div
                  className="skill-edit-item"
                  key={`doNotUseWhen-${index}`}
                >
                  <h6>
                    Do Not Use {index + 1}:
                  </h6>

                  <EditMarkdownMini
                    initialContent={item}
                    onContentChange={(value) =>
                      setDoNotUseWhen((current) =>
                        updateArrayItem(
                          current,
                          index,
                          value
                        )
                      )
                    }
                    height="120px"
                  />
                </div>
              ))}
            </div>

            <div className="skill-review-section">
              <FieldHeader
                title="Common Mistakes"
                active={
                  indicatorState.commonMistakes
                }
              />

              {commonMistakes.map((item, index) => (
                <div
                  className="skill-edit-item"
                  key={`commonMistake-${index}`}
                >
                  <h6>
                    Mistakes {index + 1}:
                  </h6>

                  <EditMarkdownMini
                    initialContent={item}
                    onContentChange={(value) =>
                      setCommonMistakes((current) =>
                        updateArrayItem(
                          current,
                          index,
                          value
                        )
                      )
                    }
                    height="120px"
                  />
                </div>
              ))}
            </div>

            <div className="skill-review-section">
              <FieldHeader
                title="Verification"
                active={
                  indicatorState.verification
                }
              />

              <h6>Commands</h6>

              {verificationCommands.map(
                (item, index) => (
                  <div
                    className="skill-edit-item"
                    key={`verificationCommand-${index}`}
                  >
                    <h6>
                      Command {index + 1}:
                    </h6>

                    <EditMarkdownMini
                      initialContent={item}
                      onContentChange={(value) =>
                        setVerificationCommands(
                          (current) =>
                            updateArrayItem(
                              current,
                              index,
                              value
                            )
                        )
                      }
                      height="90px"
                    />
                  </div>
                )
              )}

              <h6>Manual Checks</h6>

              {verificationManualChecks.map(
                (item, index) => (
                  <div
                    className="skill-edit-item"
                    key={`verificationManualCheck-${index}`}
                  >
                    <h6>
                      Manual Check {index + 1}:
                    </h6>

                    <EditMarkdownMini
                      initialContent={item}
                      onContentChange={(value) =>
                        setVerificationManualChecks(
                          (current) =>
                            updateArrayItem(
                              current,
                              index,
                              value
                            )
                        )
                      }
                      height="100px"
                    />
                  </div>
                )
              )}
            </div>

            <div className="skill-review-section">
              <FieldHeader
                title="Output Format"
                active={
                  indicatorState.outputFormat
                }
              />

              <EditMarkdownMini
                initialContent={outputFormat}
                onContentChange={setOutputFormat}
                height="130px"
              />
            </div>

            <div className="skill-review-section">
              <button
                type="button"
                className="skill-workflow-toggle"
                onClick={() =>
                  setWorkflowOpen(
                    (current) => !current
                  )
                }
              >
                Workflow {workflowOpen ? '−' : '+'}
              </button>

              {workflowOpen && (
                <>
                  <FieldHeader
                    title="Workflow"
                    active={
                      indicatorState.workflow
                    }
                  />

                  {workflow.map((item, index) => {
                    const stepNumber =
                      item.step || index + 1;

                    return (
                      <div
                        className="skill-workflow-item"
                        key={`workflow-${index}`}
                      >
                        <h6>
                          Step {stepNumber}
                        </h6>

                        <input
                          type="text"
                          className="form-input"
                          value={item.title || ''}
                          onChange={(event) =>
                            setWorkflow((current) =>
                              updateWorkflowField(
                                current,
                                index,
                                'title',
                                event.target.value
                              )
                            )
                          }
                          placeholder="Workflow step title"
                          aria-label={`Step ${stepNumber} title`}
                        />

                        <div className="skill-edit-item">
                          <h6>
                            Step {stepNumber} Detail:
                          </h6>

                          <EditMarkdownMini
                            initialContent={
                              item.detail || ''
                            }
                            onContentChange={(value) =>
                              setWorkflow((current) =>
                                updateWorkflowField(
                                  current,
                                  index,
                                  'detail',
                                  value
                                )
                              )
                            }
                            height="150px"
                          />
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            <div className="skill-review-footer">
              <button
                type="button"
                className="btn btn-block form-btn"
                onClick={handleCreateMarkdown}
                disabled={isGeneratingMarkdown}
              >
                {isGeneratingMarkdown
                  ? 'generating…'
                  : 'Generate SKILL.md'}
              </button>

              <div className="loading-bar">
                {isGeneratingMarkdown && (
                  <LoadingBar />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  .skill-review-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    background: rgba(0, 0, 0, 0.58);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 4rem 1rem;
    overflow-y: auto;
  }

  .skill-review-panel {
    width: min(1100px, 100%);
    border: 1.5px solid var(--grey-50);
    border-radius: var(--border-radius);
    background: var(--white);
    padding: 1.25rem;
  }

  .skill-review-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .skill-review-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
  }

  .skill-review-brand img {
    width: 34px;
    height: 34px;
    object-fit: contain;
  }

  .skill-review-brand h4 {
    margin: 0;
  }

  .skill-review-brand p {
    margin: 0.2rem 0 0;
    color: var(--grey-400);
    font-size: 0.85rem;
    font-weight: 600;
  }

  .skill-review-close {
    width: 34px;
    height: 34px;
    border: 1.5px solid var(--grey-50);
    border-radius: 50%;
    background: transparent;
    color: var(--text-color);
    cursor: pointer;
    font-size: 1.35rem;
    line-height: 1;
  }

  .skill-review-meta-grid {
    display: grid;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 768px) {
    .skill-review-meta-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .skill-review-meta-card,
  .skill-review-markdown-box,
  .skill-review-section {
    border: 1.5px solid var(--grey-50);
    border-radius: var(--border-radius);
    background: var(--white);
    padding: 0.85rem;
  }

  .skill-review-markdown-box,
  .skill-review-section {
    margin-top: 1rem;
  }

  .skill-review-meta-card h5 {
    margin: 0 0 0.5rem;
  }

  .skill-review-meta-card p {
    margin: 0.2rem 0;
    color: var(--grey-500);
    font-size: 0.82rem;
    font-weight: 600;
  }

  .skill-review-markdown-box summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    font-weight: 800;
  }

  .skill-review-markdown-box summary strong {
    color: var(--red-dark);
    font-size: 0.78rem;
    text-transform: uppercase;
  }

  .skill-review-field-header {
    margin-bottom: 0.65rem;
  }

  .skill-review-field-header h5 {
    margin: 0;
  }

  .skill-review-section h6,
  .skill-workflow-item h6 {
    margin: 0.75rem 0 0.45rem;
    color: var(--grey-500);
  }

  .skill-edit-item + .skill-edit-item {
    margin-top: 0.85rem;
  }

  .skill-workflow-item + .skill-workflow-item {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1.5px solid var(--grey-50);
  }

  .skill-workflow-item .form-input {
    margin-bottom: 0.75rem;
  }

  .skill-workflow-toggle {
    width: 100%;
    min-height: 42px;
    border: 1.5px solid var(--grey-70);
    border-radius: var(--border-radius);
    background: transparent;
    color: var(--text-color);
    cursor: pointer;
    font-weight: 800;
    text-align: left;
    padding: 0 0.85rem;
  }

  .skill-review-footer {
    margin-top: 1rem;
  }

  .loading-bar {
    margin-top: 0.75rem;
  }

  .indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
    background-color: var(--grey-400);
  }

  .indicator.active {
    background-color: var(--green);
  }

  .indicator-container {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
  }

  .indicator-container-search {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
  }

  .indicator-container-search .indicator {
    margin-top: 1rem;
  }

  .button-row .indicator {
    margin-top: 1rem;
  }
`;

export default SkillReviewModal;