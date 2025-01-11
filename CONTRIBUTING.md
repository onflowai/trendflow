# Contributing to TrendFlow

Thank you for your interest in contributing to **TrendFlow**! We appreciate your time and effort in helping us improve. This document outlines our guidelines for contributing to the project.

---

## Table of Contents

1. [Code of Conduct](#1-code-of-conduct)
2. [Getting Started](#2-getting-started)
3. [How to Submit Issues](#3-how-to-submit-issues)
4. [Proposing Changes (Pull Requests)](#4-proposing-changes-pull-requests)
5. [Contributor License Agreement (CLA)](#5-contributor-license-agreement-cla)
6. [Coding Standards](#6-coding-standards)
7. [Testing Requirements](#7-testing-requirements)
8. [Approval & Merging Process](#8-approval--merging-process)
9. [Contact](#9-contact)

---

## 1. Code of Conduct

Please note that we follow a simple Code of Conduct that fosters a welcoming, harassment-free environment. Be respectful and considerate in your interactions. If you have any concerns, you can reach out to the [project maintainer](#contact) privately.

---

## 2. Getting Started

1. **Fork this repository** on GitHub.
2. **Clone your fork** to your local machine.
3. **Install dependencies** (e.g., run `npm install` or `yarn install` if it’s a JavaScript project).
4. **Create a new branch** for your changes:
   \`\`\`bash
   git checkout -b feature/my-new-feature
   \`\`\`

---

## 3. How to Submit Issues

1. **Search existing issues** to check if someone already reported a similar problem or feature request.
2. If it’s new, **open a [GitHub Issue](../../issues)**:
   - Provide a **clear, descriptive title**.
   - Include **detailed information**: steps to reproduce the issue, environment details, or related screenshots/logs, if applicable.
   - If it’s a **feature request**, explain why the feature is needed and how it benefits users.

We’ll triage and respond as soon as we can.

---

## 4. Proposing Changes (Pull Requests)

1. **Create a Branch**: Use a descriptive branch name, such as `fix/issue-123` or `feature/add-reporting-module`.
2. **Make Your Changes**: Follow our [Coding Standards](#coding-standards) and add/update tests as needed.
3. **Commit Messages**: Write clear commit messages:
   - _Example:_ \`fix: resolve user login bug (#123)\`
   - Reference issues or explain the rationale behind the changes.
4. **Open a Pull Request**:
   - Compare your branch to \`main\` (or the appropriate base branch).
   - Provide a **detailed description** of the changes in the PR body.
   - Add any relevant **screenshots**, **logs**, or references to issues.

The maintainers will review and give feedback or merge if everything looks good.

---

## 5. Contributor License Agreement (CLA)

TrendFlow requires all contributors to agree to our Contributor License Agreement before merging any significant contribution. The CLA ensures:

- You affirm that your contributions are your own work (or you have the right to submit them).
- You grant the Original Author permission to use and relicense your contributions as outlined in the [TrendFlow Public License](LICENSE) or any future dual/commercial license.

To sign the CLA:

1. We will provide you with a link or document after you open your first Pull Request.
2. Once signed, **notify the maintainer** or include a comment in your PR indicating you’ve completed the CLA.

Without a signed CLA, we cannot merge your changes.

---

## 6. Coding Standards

- **Code Style**:
  - Use consistent naming conventions.
  - Prefer clarity over cleverness.
  - If applicable, follow our ESLint/Prettier settings (for JavaScript/TypeScript), or equivalent style checks for other languages.
- **File Organization**:
  - Keep related code in the same folder/module.
  - Avoid overly large files—split functionality into logical modules.
- **Comments and Documentation**:
  - Document functions, classes, or complex logic with comments.
  - Update relevant README or Wiki pages if you introduce or modify major features.

If you’re unsure about style, **ask in a GitHub Issue** or check existing files for consistency.

---

## 7. Testing Requirements

- **Write Tests for New Features**:
  - For JavaScript: use Jest/Mocha or whatever framework the project has configured.
  - For other languages: follow the established testing framework in the repo.
- **Cover Edge Cases**:
  - If you fix a bug, add a test that would have caught that bug.
  - If you add a feature, test typical and boundary scenarios.
- **Run Test Suites Locally**:
  \`\`\`bash
  npm test
  \`\`\`
  or
  \`\`\`bash
  yarn test
  \`\`\`
  Make sure all tests pass before submitting your PR.

---

## 8. Approval & Merging Process

1. **Pull Request Review**:
   - At least one maintainer (or a designated reviewer) will provide feedback.
   - You may receive **review comments** asking for changes or clarifications.
2. **Approvals**:
   - Once the review comments are addressed, a maintainer will approve the PR.
   - If you are a Co-Owner Contributor, your approval might also be required for major changes, as defined in the [TrendFlow Public License](LICENSE).
3. **Merging**:
   - Only maintainers (or authorized Co-Owner Contributors) can merge.
   - Usually merged into the \`main\` branch, unless otherwise specified (e.g., release branches for hotfixes).
4. **Release Process**:
   - The maintainers handle versioning and releasing official updates (tags, release notes, etc.).

---

## 9. Contact

- **Project Maintainer**: [onflowai](https://github.com/onflowai) (replace with your actual GitHub handle or name)
- For sensitive matters or private security disclosures, please email: [onflowai@gmail.com](mailto:onflowai@gmail.com)

---

Thank you for taking the time to read our guidelines. We look forward to your contributions! If you have any questions or feedback about contributing, feel free to [open an issue](../../issues) or [contact us directly](#contact).
