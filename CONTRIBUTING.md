# 🤝 Contributing to WebAble

First off, thank you for taking the time to contribute! 🎉
Every contribution, big or small, is truly appreciated.

---

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.  
Please be kind, constructive, and collaborative.

---

## 💡 How Can I Contribute?

You can contribute in many ways:

- 🐛 **Report Bugs** – Open an issue describing the bug
- ✨ **Suggest Features** – Share your ideas via issues
- 🛠️ **Fix Bugs** – Look for issues labeled `bug` or `good first issue`
- 📖 **Improve Documentation** – Fix typos, improve clarity
- 🎨 **UI Improvements** – Enhance the design or responsiveness
- ⚡ **Performance Improvements** – Optimize the codebase

---

## 🚀 Getting Started

### 1. Fork the Repository

Click the **Fork** button on the top right of the [WebAble repository](https://github.com/harshika53/WebAble).

### 2. Clone Your Fork
```bash
git clone https://github.com/your-username/WebAble.git
cd WebAble
```

### 3. Install Dependencies

**Frontend:**
```bash
npm install
npm run dev
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 4. Create a New Branch
```bash
git checkout -b feature/your-feature-name
```

---

## 🌿 Branching Guidelines

Use clear and descriptive branch names:

| Type | Branch Name Example |
|------|-------------------|
| New Feature | `feature/add-dark-mode` |
| Bug Fix | `fix/scan-button-error` |
| Documentation | `docs/update-readme` |
| UI Improvement | `ui/improve-dashboard` |

---

## 💬 Commit Message Guidelines

We use **Conventional Commits** enforced by Husky and commitlint. Every commit is validated automatically.

### Format
```
<type>: <description>
```

### Allowed Types
| Type | Usage | Example |
|------|-------|---------|
| `feat` | New feature | `feat: add dark mode toggle` |
| `fix` | Bug fix | `fix: resolve scan button crash` |
| `docs` | Documentation changes | `docs: update API endpoints` |
| `style` | Code style (no logic change) | `style: format button styles` |
| `refactor` | Code refactoring | `refactor: extract utility functions` |
| `test` | Add/update tests | `test: add login validation tests` |
| `chore` | Build, deps, setup | `chore: upgrade React to v19` |
| `perf` | Performance improvement | `perf: optimize image loading` |
| `ci` | CI/CD configuration | `ci: add GitHub Actions workflow` |
| `revert` | Revert previous commit | `revert: undo dark mode feature` |

### Rules (Enforced by commitlint)
- ✅ Type must be lowercase
- ✅ Description must be lowercase
- ✅ No period (.) at the end
- ✅ Max 100 characters for the full message
- ✅ No empty descriptions

### Good Examples ✅
```
feat: add real-time accessibility report generation
fix: prevent form submission with invalid email
docs: document WebAble API authentication flow
style: update dashboard card spacing
refactor: consolidate scan logic into service
test: add unit tests for accessibility checker
chore: update dev dependencies
perf: cache scan results in local storage
ci: add pre-commit linting hook
```

### Bad Examples ❌
```
Fixed bug                          ← vague, no type
FEAT: Add new feature              ← type not lowercase
add feature                        ← missing type prefix
feat: add new feature.             ← period at end
feat: add new feature for dashboard and improve UI and update styles  ← too long (>100 chars)
feat: Add Feature                  ← description not lowercase
Merge branch main                  ← not conventional format
Update stuff                       ← no type, vague description
```

### Optional: Adding Scope
For larger features, optionally include scope:
```
feat(dashboard): add dark mode toggle
fix(accessibility): resolve color contrast issue
docs(api): update authentication docs
```

---

## 🔃 Pull Request Process

1. Make sure your code works properly before submitting
2. Update the README if your change affects usage
3. Open a Pull Request to the `main` branch
4. Fill in the PR template clearly — describe **what** and **why**
5. Wait for review — we will respond within a few days
6. Address review comments if any
7. Once approved, your PR will be merged! 🎉

---

## 🏷️ Issue Labels Guide

| Label | Meaning |
|-------|---------|
| `good first issue` | Great for beginners |
| `help wanted` | Extra attention needed |
| `bug` | Something is broken |
| `enhancement` | New feature request |
| `documentation` | Docs related changes |

---

## 👩‍💻 Maintainer

**Harshika Rathod** — Project Maintainer and Developer of WebAble

For any queries, feel free to open an issue on GitHub.

---

⭐ If you find WebAble useful, don't forget to give it a star on [GitHub](https://github.com/harshika53/WebAble)!
