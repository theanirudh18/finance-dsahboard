# Vanilla Finance Dashboard

A complete Financial Dashboard web application built using only Vanilla TypeScript, HTML, and CSS (no frameworks or libraries).

## Features

- **Dashboard**: High-level overview with stat cards, recent transactions, and a monthly income vs. expense bar chart.
- **Transactions**: Sortable and filterable table with search, category filtering, and transaction type filtering.
- **Insights**: Visual breakdown of spending categories, top spending category, and savings rate.
- **Role-Based UI**: Toggle between Viewer (read-only) and Admin (can add, edit, delete transactions).
- **State Management**: Persists state in `localStorage`. Comes pre-seeded with 20+ realistic transactions.
- **Design**: Dark theme with amber accents, responsive layout, modal for transaction management, and toast notifications.

## Prerequisites

- Node.js and npm installed.

## Setup and Running

1. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Compile TypeScript**:
   \`\`\`bash
   npx tsc
   \`\`\`
   This will generate the \`app.js\` file from \`app.ts\`.

3. **Run a local server**:
   You can use any simple HTTP server. For example, using Python:
   \`\`\`bash
   python3 -m http.server 8000
   \`\`\`
   Or using Node.js \`serve\` package:
   \`\`\`bash
   npx serve .
   \`\`\`

4. **Open in browser**:
   Navigate to \`http://localhost:8000\` (or whichever port your server uses) to view the dashboard.
