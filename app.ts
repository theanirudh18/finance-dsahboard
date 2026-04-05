// Types & Interfaces
type TransactionType = 'income' | 'expense';
type TransactionCategory = 'Housing' | 'Food' | 'Transportation' | 'Utilities' | 'Entertainment' | 'Salary' | 'Other';

interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    date: string; // YYYY-MM-DD
    description: string;
    category: TransactionCategory;
}

interface AppState {
    transactions: Transaction[];
    role: 'viewer' | 'admin';
}

const STORAGE_KEY = 'finance_dashboard_state';

const seedTransactions: Transaction[] = [
    { id: '1', type: 'income', amount: 50000, date: '2023-11-01', description: 'Salary', category: 'Salary' },
    { id: '2', type: 'expense', amount: 15000, date: '2023-11-02', description: 'Rent', category: 'Housing' },
    { id: '3', type: 'expense', amount: 1200, date: '2023-11-05', description: 'Groceries', category: 'Food' },
    { id: '4', type: 'expense', amount: 800, date: '2023-11-08', description: 'Gas', category: 'Transportation' },
    { id: '5', type: 'expense', amount: 2000, date: '2023-11-12', description: 'Electricity & Water', category: 'Utilities' },
    { id: '6', type: 'expense', amount: 1500, date: '2023-11-15', description: 'Gifts', category: 'Other' },
    { id: '7', type: 'expense', amount: 3000, date: '2023-11-20', description: 'Dinner & Movies', category: 'Entertainment' },
    { id: '8', type: 'income', amount: 50000, date: '2023-12-01', description: 'Salary', category: 'Salary' },
    { id: '9', type: 'expense', amount: 15000, date: '2023-12-02', description: 'Rent', category: 'Housing' },
    { id: '10', type: 'expense', amount: 2500, date: '2023-12-06', description: 'Groceries', category: 'Food' },
    { id: '11', type: 'expense', amount: 900, date: '2023-12-10', description: 'Gas', category: 'Transportation' },
    { id: '12', type: 'expense', amount: 1800, date: '2023-12-14', description: 'Utilities', category: 'Utilities' },
    { id: '13', type: 'expense', amount: 5000, date: '2023-12-20', description: 'Holiday Shopping', category: 'Entertainment' },
    { id: '14', type: 'income', amount: 10000, date: '2023-12-25', description: 'Bonus', category: 'Salary' },
    { id: '15', type: 'income', amount: 50000, date: '2024-01-01', description: 'Salary', category: 'Salary' },
    { id: '16', type: 'expense', amount: 15000, date: '2024-01-02', description: 'Rent', category: 'Housing' },
    { id: '17', type: 'expense', amount: 1800, date: '2024-01-05', description: 'Groceries', category: 'Food' },
    { id: '18', type: 'expense', amount: 600, date: '2024-01-10', description: 'Gas', category: 'Transportation' },
    { id: '19', type: 'expense', amount: 2100, date: '2024-01-15', description: 'Utilities', category: 'Utilities' },
    { id: '20', type: 'expense', amount: 1000, date: '2024-01-22', description: 'Movie out', category: 'Entertainment' },
    { id: '21', type: 'expense', amount: 3500, date: '2024-01-25', description: 'Car Repair', category: 'Transportation' },
];

let state: AppState = {
    transactions: [],
    role: 'viewer' // 'viewer' or 'admin'
};

// Utils
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};
const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
const generateId = () => Math.random().toString(36).substr(2, 9);

// State Management
function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        state = JSON.parse(saved);
    } else {
        state = { transactions: [...seedTransactions], role: 'viewer' };
        saveState();
    }
}
function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// UI Rendering Functions
function renderApp() {
    applyRoleUI();
    renderDashboard();
    renderTransactions();
    renderInsights();
}

function applyRoleUI() {
    const body = document.body;
    if (state.role === 'viewer') {
        body.classList.add('viewer-mode');
        (document.getElementById('roleToggle') as HTMLInputElement).checked = false;
        document.querySelector('.admin-label')?.classList.remove('active');
        document.querySelector('.role-label:not(.admin-label)')?.classList.add('active');
    } else {
        body.classList.remove('viewer-mode');
        (document.getElementById('roleToggle') as HTMLInputElement).checked = true;
        document.querySelector('.admin-label')?.classList.add('active');
        document.querySelector('.role-label:not(.admin-label)')?.classList.remove('active');
    }
    renderTransactionsTable(); // Need to re-render to hide/show actions
}

// DOM Elements
const pagesContainer = document.getElementById('pagesContainer')!;
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('pageTitle')!;

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLButtonElement;
        const pageId = target.getAttribute('data-page');
        if (!pageId) return;

        // Update Nav
        navItems.forEach(nav => nav.classList.remove('active'));
        target.classList.add('active');

        // Update Title
        pageTitle.textContent = target.querySelector('span:not(.icon)')?.textContent || 'Dashboard';

        // Update Pages
        pages.forEach(p => p.classList.remove('active'));
        document.getElementById(pageId + 'Page')?.classList.add('active');
        
        renderApp(); // Re-render logic on tab switch if needed
    });
});

// Toast
function showToast(message: string, type: 'success'|'error' = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    // trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Dashboard Page
function renderDashboard() {
    const totalIncome = state.transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = state.transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpense;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const thisMonthSpend = state.transactions
        .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
        .reduce((acc, t) => acc + t.amount, 0);

    document.getElementById('dashTotalBalance')!.textContent = formatCurrency(balance);
    document.getElementById('dashTotalIncome')!.textContent = '+' + formatCurrency(totalIncome);
    document.getElementById('dashTotalExpenses')!.textContent = '-' + formatCurrency(totalExpense);
    document.getElementById('dashMonthSpend')!.textContent = formatCurrency(thisMonthSpend);

    renderRecentTransactions();
    renderBarChart();
}

function renderRecentTransactions() {
    const container = document.getElementById('dashTransactionList');
    if (!container) return;
    container.innerHTML = '';
    
    const recent = [...state.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
    
    if (recent.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1rem;">No transactions yet.</p>';
        return;
    }

    recent.forEach(t => {
        const div = document.createElement('div');
        div.className = 'transaction-item';
        div.innerHTML = `
            <div class="transaction-info">
                <span class="transaction-desc">${t.description}</span>
                <span class="transaction-date">${formatDate(t.date)}</span>
            </div>
            <div class="transaction-amount ${t.type === 'income' ? 'positive' : ''}">
                ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
            </div>
        `;
        container.appendChild(div);
    });
}

function renderBarChart() {
    const container = document.getElementById('barChartContainer');
    const labelsContainer = document.getElementById('barChartLabels');
    if (!container || !labelsContainer) return;
    container.innerHTML = '';
    labelsContainer.innerHTML = '';

    // Group by month
    const monthlyData: Record<string, { income: number, expense: number }> = {};
    state.transactions.forEach(t => {
        const d = new Date(t.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[key]) monthlyData[key] = { income: 0, expense: 0 };
        if (t.type === 'income') monthlyData[key].income += t.amount;
        else monthlyData[key].expense += t.amount;
    });

    const sortedMonths = Object.keys(monthlyData).sort().slice(-6); // last 6 months
    if (sortedMonths.length === 0) return;

    let maxAmount = 0;
    sortedMonths.forEach(m => {
        const data = monthlyData[m]!;
        if (data.income > maxAmount) maxAmount = data.income;
        if (data.expense > maxAmount) maxAmount = data.expense;
    });

    if (maxAmount === 0) maxAmount = 1;

    sortedMonths.forEach(m => {
        const data = monthlyData[m]!;
        const incomePct = (data.income / maxAmount) * 100;
        const expensePct = (data.expense / maxAmount) * 100;

        const group = document.createElement('div');
        group.className = 'chart-bar-group';
        group.innerHTML = `
            <div class="chart-bar income" style="height: ${incomePct}%" data-val="${formatCurrency(data.income)}"></div>
            <div class="chart-bar expense" style="height: ${expensePct}%" data-val="${formatCurrency(data.expense)}"></div>
        `;
        container.appendChild(group);

        const d = new Date(m + '-01T00:00:00');
        const labelText = d.toLocaleDateString('en-US', { month: 'short' });
        const label = document.createElement('div');
        label.className = 'chart-label';
        label.textContent = labelText;
        labelsContainer.appendChild(label);
    });
}

// Transactions Page Filters
let currentSearch = '';
let currentFilterType = 'all';
let currentFilterCat = 'all';
let currentSort = 'date-desc';

const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const filterType = document.getElementById('filterType') as HTMLSelectElement;
const filterCategory = document.getElementById('filterCategory') as HTMLSelectElement;
const sortBy = document.getElementById('sortBy') as HTMLSelectElement;

searchInput?.addEventListener('input', (e) => { currentSearch = (e.target as HTMLInputElement).value.toLowerCase(); renderTransactionsTable(); });
filterType?.addEventListener('change', (e) => { currentFilterType = (e.target as HTMLSelectElement).value; renderTransactionsTable(); });
filterCategory?.addEventListener('change', (e) => { currentFilterCat = (e.target as HTMLSelectElement).value; renderTransactionsTable(); });
sortBy?.addEventListener('change', (e) => { currentSort = (e.target as HTMLSelectElement).value; renderTransactionsTable(); });


function renderTransactions() {
    renderTransactionsTable();
}

function renderTransactionsTable() {
    const tbody = document.getElementById('transactionTableBody');
    const emptyState = document.getElementById('emptyState');
    if (!tbody || !emptyState) return;

    let filtered = state.transactions.filter(t => {
        const matchSearch = t.description.toLowerCase().includes(currentSearch);
        const matchType = currentFilterType === 'all' || t.type === currentFilterType;
        const matchCat = currentFilterCat === 'all' || t.category === currentFilterCat;
        return matchSearch && matchType && matchCat;
    });

    filtered.sort((a, b) => {
        if (currentSort === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (currentSort === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (currentSort === 'amount-desc') return b.amount - a.amount;
        if (currentSort === 'amount-asc') return a.amount - b.amount;
        return 0;
    });

    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        filtered.forEach(t => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatDate(t.date)}</td>
                <td><strong>${t.description}</strong></td>
                <td><span class="category-badge">${t.category}</span></td>
                <td class="amount-cell ${t.type === 'income' ? 'positive' : ''}">${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}</td>
                <td class="action-column admin-only">
                    <div class="actions-cell">
                        <button class="icon-btn edit-btn" data-id="${t.id}" title="Edit">✏️</button>
                        <button class="icon-btn delete delete-btn" data-id="${t.id}" title="Delete">🗑️</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Attach handlers
        if (state.role === 'admin') {
            document.querySelectorAll('.edit-btn').forEach(btn => 
                btn.addEventListener('click', (e) => {
                    const id = (e.currentTarget as HTMLButtonElement).getAttribute('data-id');
                    if (id) openModal(id);
                })
            );
            document.querySelectorAll('.delete-btn').forEach(btn => 
                btn.addEventListener('click', (e) => {
                    const id = (e.currentTarget as HTMLButtonElement).getAttribute('data-id');
                    if (id && confirm('Are you sure you want to delete this transaction?')) {
                        state.transactions = state.transactions.filter(tx => tx.id !== id);
                        saveState();
                        renderApp();
                        showToast('Transaction deleted', 'success');
                    }
                })
            );
        }
    }
}

// Insights Page
function renderInsights() {
    const expenses = state.transactions.filter(t => t.type === 'expense');
    const incomes = state.transactions.filter(t => t.type === 'income');
    
    // Top category
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(e => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });
    
    let topCat = '--';
    let topCatAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
        if (amt > topCatAmount) {
            topCatAmount = amt;
            topCat = cat;
        }
    });

    document.getElementById('topCategoryName')!.textContent = topCat;
    document.getElementById('topCategoryAmount')!.textContent = formatCurrency(topCatAmount);

    // Savings Rate (This Month)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const thisMonthIncome = incomes.filter(t => new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear).reduce((acc, t) => acc + t.amount, 0);
    const thisMonthExpense = expenses.filter(t => new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear).reduce((acc, t) => acc + t.amount, 0);
    
    let savingsRate = 0;
    if (thisMonthIncome > 0) {
        savingsRate = ((thisMonthIncome - thisMonthExpense) / thisMonthIncome) * 100;
    }
    
    document.getElementById('savingsRate')!.textContent = `${Math.max(0, savingsRate).toFixed(1)}%`;

    // Category Breakdown
    const list = document.getElementById('categoryBreakdownList');
    if (!list) return;
    list.innerHTML = '';

    const totalExpenseAmount = expenses.reduce((a, b) => a + b.amount, 0);
    
    Object.entries(categoryTotals).sort((a,b) => b[1] - a[1]).forEach(([cat, amt]) => {
        const pct = totalExpenseAmount > 0 ? (amt / totalExpenseAmount) * 100 : 0;
        const item = document.createElement('div');
        item.className = 'breakdown-item';
        item.innerHTML = `
            <div class="breakdown-info">
                <span>${cat}</span>
                <span>${formatCurrency(amt)} (${pct.toFixed(1)}%)</span>
            </div>
            <div class="breakdown-progress-bg">
                <div class="breakdown-progress-fill" style="width: ${pct}%"></div>
            </div>
        `;
        list.appendChild(item);
    });
}

// Modal Logic
const modalOverlay = document.getElementById('transactionModal');
const transactionForm = document.getElementById('transactionForm') as HTMLFormElement;
const transIdInput = document.getElementById('transId') as HTMLInputElement;

document.getElementById('addTransactionBtn')?.addEventListener('click', () => {
    openModal();
});

document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
document.getElementById('cancelModalBtn')?.addEventListener('click', closeModal);

function openModal(id?: string) {
    if (state.role !== 'admin') return;
    
    modalOverlay?.classList.remove('hidden');
    if (id) {
        const t = state.transactions.find(tx => tx.id === id);
        if (t) {
            document.getElementById('modalTitle')!.textContent = 'Edit Transaction';
            transIdInput.value = t.id;
            (document.querySelector(`input[name="transType"][value="${t.type}"]`) as HTMLInputElement).checked = true;
            (document.getElementById('transDate') as HTMLInputElement).value = t.date;
            (document.getElementById('transDescription') as HTMLInputElement).value = t.description;
            (document.getElementById('transAmount') as HTMLInputElement).value = t.amount.toString();
            (document.getElementById('transCategory') as HTMLSelectElement).value = t.category;
        }
    } else {
        document.getElementById('modalTitle')!.textContent = 'Add Transaction';
        transactionForm.reset();
        transIdInput.value = '';
        (document.getElementById('transDate') as HTMLInputElement).value = new Date().toISOString().split('T')[0] || '';
    }
}

function closeModal() {
    modalOverlay?.classList.add('hidden');
    transactionForm.reset();
}

transactionForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = transIdInput.value || generateId();
    const type = (document.querySelector('input[name="transType"]:checked') as HTMLInputElement).value as TransactionType;
    const date = (document.getElementById('transDate') as HTMLInputElement).value;
    const description = (document.getElementById('transDescription') as HTMLInputElement).value;
    const amount = parseFloat((document.getElementById('transAmount') as HTMLInputElement).value);
    const category = (document.getElementById('transCategory') as HTMLSelectElement).value as TransactionCategory;

    const transaction: Transaction = { id, type, date, description, amount, category };

    if (transIdInput.value) {
        // Edit
        const idx = state.transactions.findIndex(t => t.id === id);
        if (idx !== -1) state.transactions[idx] = transaction;
        showToast('Transaction updated', 'success');
    } else {
        // Add
        state.transactions.push(transaction);
        showToast('Transaction added', 'success');
    }

    saveState();
    closeModal();
    renderApp();
});

// Role Toggle Logic
document.getElementById('roleToggle')?.addEventListener('change', (e) => {
    const checked = (e.target as HTMLInputElement).checked;
    state.role = checked ? 'admin' : 'viewer';
    saveState();
    applyRoleUI();
});

// Init
loadState();
renderApp();
