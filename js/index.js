// Dữ liệu ban đầu
const monthlyCategories = [
    {
        month: "2025-03",
        budget: 1000000,
        remainMoney: 1000000,
        categories: [
            { id: 1, name: "Ăn uống", limit: 15000 },
            { id: 2, name: "Đi lại", limit: 20000 },
            { id: 3, name: "Tiền nhà", limit: 30000 }
        ]
    }
];

const transactions = [
    {
        month: "2025-03",
        transaction: [
            { id: 1, categoryId: 1, note: "ok", amount: 15000 },
            { id: 2, categoryId: 3, note: "hehe", amount: 50000 },
            { id: 3, categoryId: 2, note: "di xe", amount: 10000 },
            { id: 4, categoryId: 1, note: "an toi", amount: 20000 },
            { id: 5, categoryId: 3, note: "nha", amount: 15000 },
            { id: 6, categoryId: 2, note: "xe buyt", amount: 8000 }
        ]
    }
];

const monthlyReports = [
    {
        month: "2025-03",
        totalAmount: 118000,
        details: [
            { categoryId: 1, amount: 15000 },
            { categoryId: 3, amount: 50000 },
            { categoryId: 2, amount: 10000 },
            { categoryId: 1, amount: 20000 },
            { categoryId: 3, amount: 15000 },
            { categoryId: 2, amount: 8000 }
        ]
    }
];

// DOM
const monthInputElement = document.querySelector("#monthInput");
const monthlyBudgetInputElement = document.querySelector("#monthlyBudgetInput");
const saveMonthlyBudgetElement = document.querySelector("#saveMonthlyBudget");
const remainingAmountElement = document.querySelector("#remainingAmount");
const nameCategoryElement = document.querySelector("#nameCategory");
const limitMoneyElement = document.querySelector("#limitMoney");
const addCategoryElement = document.querySelector("#addCategory");
const listCategoryElement = document.querySelector("#listCategory");
const moneyInputaddSpendingElement = document.querySelector("#moneyInputaddSpending");
const spendingCategoryElement = document.querySelector("#spendingCategory");
const noteInputaddSpendingElement = document.querySelector("#noteInputaddSpending");
const saveAddSpendingElement = document.querySelector("#saveAddSpending");
const searchInputElement = document.querySelector("#searchInput");
const submitHistoryButtonElement = document.querySelector("#searchForm button");
const sortElement = document.querySelector("#sort");
const transactionListElement = document.querySelector("#transactionList");
const paginationElement = document.querySelector("#pagination");
const errorElement = document.querySelector("#error");
const statisticsSpendingBodyElement = document.querySelector("#statisticsSpendingBody");

// Biến toàn cục
let editState = {};
let currentPage = 1;
const perPage = 5;

let monthlyCategoriesLocals = JSON.parse(localStorage.getItem("monthlyCategories")) || [];
let transactionsLocals = JSON.parse(localStorage.getItem("transactions")) || [];
let monthlyReportsLocals = JSON.parse(localStorage.getItem("monthlyReports")) || [];
const userLocals = JSON.parse(localStorage.getItem("users")) || [];

// Lưu dữ liệu vào localStorage
function saveToLocalStorage() {
    localStorage.setItem("monthlyCategories", JSON.stringify(monthlyCategoriesLocals));
    localStorage.setItem("transactions", JSON.stringify(transactionsLocals));
    localStorage.setItem("monthlyReports", JSON.stringify(monthlyReportsLocals));
    localStorage.setItem("users", JSON.stringify(userLocals));
}

// Khởi tạo dữ liệu mặc định nếu localStorage trống
if (
    monthlyCategoriesLocals.length === 0 &&
    transactionsLocals.length === 0 &&
    monthlyReportsLocals.length === 0
) {
    monthlyCategoriesLocals = [...monthlyCategories];
    transactionsLocals = [...transactions];
    monthlyReportsLocals = [...monthlyReports];
    saveToLocalStorage();
}

// Hàm kiểm tra tháng
function validateMonth() {
    if (!monthInputElement.value) {
        Swal.fire({
            title: "Lỗi!",
            text: "Vui lòng chọn tháng!",
            icon: "error"
        });
        return true;
    }
    return false;
}

// Hàm kiểm tra ngân sách
function validateBudget() {
    const budgetValue = monthlyBudgetInputElement.value.trim();
    const budgetNum = Number(budgetValue);
    if (!budgetValue || budgetNum <= 0 || isNaN(budgetNum)) {
        Swal.fire({
            title: "Lỗi!",
            text: "Ngân sách không hợp lệ!",
            icon: "error"
        });
        return true;
    }
    return false;
}

// Hàm yêu cầu chọn tháng
function requireMonthSelected() {
    if (!monthInputElement.value) {
        Swal.fire({
            icon: "warning",
            title: "Chưa chọn tháng!",
            text: "Vui lòng chọn tháng trước khi thao tác.",
            confirmButtonText: "OK"
        });
        return false;
    }
    return true;
}

// Hàm kiểm tra ngân sách tháng
function requireMonthlyBudgetEntered(month) {
    const selectedMonthData = monthlyCategoriesLocals.find(item => item.month === month);
    if (!selectedMonthData || !selectedMonthData.budget || selectedMonthData.budget <= 0) {
        Swal.fire({
            icon: "warning",
            title: "Chưa nhập ngân sách!",
            text: "Vui lòng nhập ngân sách tháng trước khi thao tác.",
            confirmButtonText: "OK"
        });
        return false;
    }
    return true;
}

// Render danh sách danh mục
function renderCategoriesData(monthValue) {
    listCategoryElement.innerHTML = "";
    const monthData = monthlyCategoriesLocals.find(item => item.month === monthValue);
    if (!monthData) return;

    const html = monthData.categories.map((category, index) => `
        <li>
            <p class = "categoryhihi">${category.name} - Giới hạn: 
                <span>${category.limit.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
            </p>
            <p class="function">
                <span class="editCategory" data-index="${index}">Sửa</span>  
                <span class="deleteCategory" data-index="${index}">Xoá</span>
            </p>
        </li>
    `).join("");

    listCategoryElement.innerHTML = html;

    document.querySelectorAll(".editCategory").forEach(button => {
        button.addEventListener("click", function() {
            const index = parseInt(button.getAttribute("data-index"));
            const categoryIndex = monthlyCategoriesLocals.findIndex(item => item.month === monthValue);
            handleEditCategory(index, categoryIndex);
        });
    });

    document.querySelectorAll(".deleteCategory").forEach(button => {
        button.addEventListener("click", function() {
            const index = parseInt(button.getAttribute("data-index"));
            const categoryIndex = monthlyCategoriesLocals.findIndex(item => item.month === monthValue);
            Swal.fire({
                title: "Bạn có chắc chắn muốn xoá?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đúng, xoá!",
                cancelButtonText: "Huỷ"
            }).then(result => {
                if (result.isConfirmed) {
                    handleDeleteCategory(index, categoryIndex, monthValue);
                    Swal.fire("Đã xoá thành công!", "", "success");
                }
            });
        });
    });
}

// Xoá danh mục
function handleDeleteCategory(index, categoryIndex, monthValue) {
    if (categoryIndex >= 0 && index >= 0 && monthlyCategoriesLocals[categoryIndex].categories[index]) {
        monthlyCategoriesLocals[categoryIndex].categories.splice(index, 1);
        saveToLocalStorage();
        renderCategoriesData(monthValue);
        renderOption(monthValue);

        const transactionIndex = transactionsLocals.findIndex(item => item.month === monthValue);
        if (transactionIndex >= 0) {
            handleDeleteHistory(index, transactionIndex, monthValue);
        }

        currentPage = 1;
        renderPaginatedHistory(currentPage);
    }
}

// Sửa danh mục
function handleEditCategory(index, categoryIndex) {
    addCategoryElement.textContent = "Lưu";
    editState = { monthIndex: categoryIndex, categoryIndex: index };
    nameCategoryElement.value = monthlyCategoriesLocals[categoryIndex].categories[index].name;
    limitMoneyElement.value = monthlyCategoriesLocals[categoryIndex].categories[index].limit;
}

// Thêm danh mục
function addCategory(monthValue, categoryNameValue, limitValue) {
    let monthData = monthlyCategoriesLocals.find(item => item.month === monthValue);

    if (checkLimit(monthValue, limitValue)) {
        Swal.fire({
            title: "Lỗi!",
            text: "Giới hạn danh mục vượt quá ngân sách hoặc số tiền còn lại!",
            icon: "error"
        });
        return;
    }

    const newCategory = {
        id: Math.floor(Math.random() * 1000),
        name: categoryNameValue,
        limit: +limitValue
    };

    if (monthData) {
        monthData.categories.push(newCategory);
    } else {
        if (!requireMonthlyBudgetEntered(monthValue)) return;
        monthData = {
            month: monthValue,
            budget: 0,
            remainMoney: 0,
            categories: [newCategory]
        };
        monthlyCategoriesLocals.push(monthData);
    }
    saveToLocalStorage();
}

// Thêm chi tiêu
function addSpending(monthValue, spendingMoneyValue, spendingOptionValue, spendingNoteValue) {
    if (!monthValue || !requireMonthlyBudgetEntered(monthValue)) return;

    const moneyNum = +spendingMoneyValue;
    if (isNaN(moneyNum) || moneyNum < 0) {
        Swal.fire({
            title: "Lỗi!",
            text: "Số tiền chi tiêu không hợp lệ!",
            icon: "error"
        });
        return;
    }

    if (!spendingOptionValue || isNaN(+spendingOptionValue)) {
        Swal.fire({
            title: "Lỗi!",
            text: "Vui lòng chọn danh mục hợp lệ!",
            icon: "error"
        });
        return;
    }

    const newTransaction = {
        id: Math.floor(Math.random() * 1000),
        categoryId: +spendingOptionValue,
        note: spendingNoteValue || "",
        amount: moneyNum
    };

    if (remainMoney(monthValue, moneyNum)) return;

    let monthData = transactionsLocals.find(item => item.month === monthValue);
    if (monthData) {
        monthData.transaction.push(newTransaction);
    } else {
        monthData = { month: monthValue, transaction: [newTransaction] };
        transactionsLocals.push(monthData);
    }

    addReport(monthValue, newTransaction.categoryId, newTransaction.amount);
    saveToLocalStorage();
    budgetWarning(monthValue);

    // Reset về trang 1 để hiển thị giao dịch mới
    currentPage = 1;
    renderPaginatedHistory(currentPage);
}

// Render danh sách tùy chọn danh mục
function renderOption(monthValue) {
    spendingCategoryElement.innerHTML = '<option value="">Chọn danh mục</option>';
    const monthData = monthlyCategoriesLocals.find(item => item.month === monthValue);
    if (!monthData) return;

    const htmls = monthData.categories.map(category => `
        <option value="${category.id}">${category.name}</option>
    `).join("");
    spendingCategoryElement.innerHTML += htmls;
}

// Xoá lịch sử giao dịch
function handleDeleteHistory(index, historyIndex, monthValue) {
    if (historyIndex < 0 || !transactionsLocals[historyIndex] || !transactionsLocals[historyIndex].transaction[index]) {
        Swal.fire("Lỗi!", "Giao dịch không tồn tại!", "error");
        return;
    }

    const transaction = transactionsLocals[historyIndex].transaction[index];
    const transactionAmount = transaction.amount;
    const transactionCategoryId = transaction.categoryId;

    let monthReport = monthlyReportsLocals.find(item => item.month === monthValue);
    if (monthReport) {
        monthReport.totalAmount -= transactionAmount;
        monthReport.details = monthReport.details.filter(detail => 
            !(detail.categoryId === transactionCategoryId && detail.amount === transactionAmount)
        );
        if (monthReport.totalAmount <= 0) {
            monthlyReportsLocals = monthlyReportsLocals.filter(item => item.month !== monthValue);
        }
    }

    let monthCategory = monthlyCategoriesLocals.find(item => item.month === monthValue);
    if (monthCategory) {
        monthCategory.remainMoney += transactionAmount;
        remainingAmountElement.textContent = `${monthCategory.remainMoney.toLocaleString('vi', { style: 'currency', currency: 'VND' })}`;
    }

    transactionsLocals[historyIndex].transaction.splice(index, 1);
    if (transactionsLocals[historyIndex].transaction.length === 0) {
        transactionsLocals.splice(historyIndex, 1);
    }

    saveToLocalStorage();

    // Kiểm tra lại số trang sau khi xóa
    const monthTransactions = transactionsLocals.find(item => item.month === monthValue);
    const totalPages = monthTransactions ? Math.ceil(monthTransactions.transaction.length / perPage) : 0;
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    } else if (totalPages === 0) {
        currentPage = 1;
    }
    renderPaginatedHistory(currentPage);
    budgetWarning(monthValue);
    monthlySpendingStatistics();
}

// Tìm kiếm lịch sử giao dịch
function searchHistory(searchValue) {
    const monthValue = monthInputElement.value;
    transactionListElement.innerHTML = "";

    const monthTransactions = transactionsLocals.find(item => item.month === monthValue);
    const monthCategories = monthlyCategoriesLocals.find(item => item.month === monthValue);
    if (!monthTransactions || !monthCategories) return;

    const htmls = monthTransactions.transaction.map((transaction, index) => {
        const category = monthCategories.categories.find(cat => cat.id === transaction.categoryId);
        if (category && (category.name.toLowerCase().includes(searchValue.toLowerCase()) || transaction.note.toLowerCase().includes(searchValue.toLowerCase()))) {
            return `
                <li>
                    <p>${category.name} - <span>${transaction.note}</span> : <span>${transaction.amount.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span></p>
                    <p class="function"><span class="deleteHistory" data-index="${index}" data-month="${monthValue}">Xoá</span></p>
                </li>
            `;
        }
    }).filter(Boolean).join("");

    transactionListElement.innerHTML = htmls;

    document.querySelectorAll(".deleteHistory").forEach(button => {
        button.removeEventListener("click", handleDeleteClick);
        button.addEventListener("click", handleDeleteClick);
    });
}

// Sắp xếp lịch sử giao dịch
function sortHistory(sortValue) {
    const monthValue = monthInputElement.value;
    const monthTransactions = transactionsLocals.find(item => item.month === monthValue);
    if (!monthTransactions) return;

    if (sortValue === "asc") {
        monthTransactions.transaction.sort((a, b) => a.amount - b.amount);
    } else if (sortValue === "desc") {
        monthTransactions.transaction.sort((a, b) => b.amount - a.amount);
    }

    currentPage = 1; // Reset về trang 1 sau khi sắp xếp
    console.log("After sort - reset currentPage to 1");
    renderPaginatedHistory(currentPage);
}

// Render lịch sử giao dịch với phân trang
function renderPaginatedHistory(page) {
    const monthValue = monthInputElement.value;
    transactionListElement.innerHTML = "";

    const monthTransactions = transactionsLocals.find(item => item.month === monthValue);
    const monthCategories = monthlyCategoriesLocals.find(item => item.month === monthValue);

    if (!monthTransactions || !monthCategories || !monthTransactions.transaction || monthTransactions.transaction.length === 0) {
        transactionListElement.innerHTML = "<li>Không có giao dịch nào cho tháng này.</li>";
        paginationElement.innerHTML = "";
        currentPage = 1;
        return;
    }

    const totalPages = Math.ceil(monthTransactions.transaction.length / perPage);
    currentPage = Math.max(1, Math.min(page, totalPages));
    console.log("Rendering page:", currentPage, "Total pages:", totalPages);

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const paginatedTransactions = monthTransactions.transaction.slice(start, end);

    const htmls = paginatedTransactions.map((transaction, index) => {
        const category = monthCategories.categories.find(cat => cat.id === transaction.categoryId);
        if (category) {
            return `
                <li>
                    <p class = "textDeleteHistory">${category.name} - <span>${transaction.note}</span> : <span>${transaction.amount.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span></p>
                    <p class="function"><span class="deleteHistory" data-index="${start + index}" data-month="${monthValue}">Xoá</span></p>
                </li>
            `;
        }
        return null;
    }).filter(Boolean).join("");

    transactionListElement.innerHTML = htmls || "<li>Không có giao dịch nào.</li>";

    document.querySelectorAll(".deleteHistory").forEach(button => {
        button.removeEventListener("click", handleDeleteClick);
        button.addEventListener("click", handleDeleteClick);
    });

    renderPaginationControls(monthTransactions.transaction.length);
}

// Hàm xử lý xóa giao dịch
function handleDeleteClick() {
    const index = parseInt(this.getAttribute("data-index"));
    const monthValue = this.getAttribute("data-month");
    const historyIndex = transactionsLocals.findIndex(item => item.month === monthValue);

    Swal.fire({
        title: "Bạn có chắc chắn muốn xoá?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đúng, xoá!",
        cancelButtonText: "Huỷ"
    }).then(result => {
        if (result.isConfirmed) {
            handleDeleteHistory(index, historyIndex, monthValue);
            Swal.fire("Đã xoá thành công!", "", "success");
        }
    });
}

// Render nút phân trang
function renderPaginationControls(totalItems) {
    paginationElement.innerHTML = "";
    const totalPages = Math.ceil(totalItems / perPage);

    if (totalPages <= 1) {
        paginationElement.style.display = "none";
        return;
    }

    currentPage = Math.max(1, Math.min(currentPage, totalPages));

    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? "active" : "";
        paginationElement.innerHTML += `
            <li class="page-item ${activeClass}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    paginationElement.style.display = "flex";
    paginationElement.style.listStyle = "none";
    paginationElement.style.justifyContent = "center";
    paginationElement.style.margin = "10px 0";

    document.querySelectorAll(".page-link").forEach(link => {
        link.removeEventListener("click", handlePageClick);
        link.addEventListener("click", handlePageClick);
    });
}

// Hàm xử lý click phân trang
function handlePageClick(e) {
    e.preventDefault();
    const newPage = parseInt(this.getAttribute("data-page"));
    if (newPage !== currentPage) {
        currentPage = newPage;
        console.log("Switching to page:", currentPage);
        renderPaginatedHistory(currentPage);
    }
}

// Cảnh báo vượt ngân sách
function budgetWarning(monthValue) {
    const monthCategories = monthlyCategoriesLocals.find(item => item.month === monthValue);
    const monthTransactions = transactionsLocals.find(item => item.month === monthValue);
    let warnings = [];

    if (monthCategories && monthTransactions) {
        monthCategories.categories.forEach(category => {
            const totalSpent = monthTransactions.transaction
                .filter(t => t.categoryId === category.id)
                .reduce((sum, t) => sum + t.amount, 0);
            if (totalSpent > category.limit) {
                warnings.push(`<p>Danh mục "${category.name}" vượt giới hạn: ${totalSpent.toLocaleString('vi', { style: 'currency', currency: 'VND' })} / ${category.limit.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</p>`);
            }
        });
    }

    errorElement.innerHTML = warnings.join("");
    errorElement.style.display = warnings.length > 0 ? "block" : "none";
}

// Thêm báo cáo
function addReport(monthValue, categoryId, amount) {
    let monthReport = monthlyReportsLocals.find(item => item.month === monthValue);
    const newDetail = { categoryId, amount };

    if (monthReport) {
        monthReport.details.push(newDetail);
        monthReport.totalAmount += amount;
    } else {
        monthReport = { month: monthValue, totalAmount: amount, details: [newDetail] };
        monthlyReportsLocals.push(monthReport);
    }
    saveToLocalStorage();
    monthlySpendingStatistics();
}

// Kiểm tra thống kê chi tiêu
function spendingStatisticsCheck(monthValue) {
    const monthCategories = monthlyCategoriesLocals.find(item => item.month === monthValue);
    const monthReport = monthlyReportsLocals.find(item => item.month === monthValue);
    if (!monthCategories || !monthReport) return false;

    return monthReport.totalAmount < monthCategories.budget;
}

// Render thống kê chi tiêu
function monthlySpendingStatistics() {
    statisticsSpendingBodyElement.innerHTML = "";
    monthlyReportsLocals = monthlyReportsLocals.filter(report => report.totalAmount > 0);
    saveToLocalStorage();

    const htmls = monthlyReportsLocals.map(report => {
        const monthCategories = monthlyCategoriesLocals.find(item => item.month === report.month);
        if (!monthCategories) return "";
        return `
            <tr>
                <td>${report.month}</td>
                <td>${report.totalAmount.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</td>
                <td>${monthCategories.budget.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</td>
                <td>${spendingStatisticsCheck(report.month) ? "✅ Đạt" : "Vượt"}</td>
            </tr>
        `;
    }).filter(Boolean).join("");

    statisticsSpendingBodyElement.innerHTML = htmls;
}

// Render ban đầu
function firstRender(monthValue) {
    const monthData = monthlyCategoriesLocals.find(item => item.month === monthValue);
    if (monthData) {
        remainingAmountElement.textContent = `${monthData.remainMoney.toLocaleString('vi', { style: 'currency', currency: 'VND' })}`;
        renderCategoriesData(monthValue);
        renderOption(monthValue);
        currentPage = 1;
        console.log("firstRender - reset currentPage to 1 for month:", monthValue);
        renderPaginatedHistory(currentPage);
    } else {
        remainingAmountElement.textContent = "0 VND";
        listCategoryElement.innerHTML = "";
        transactionListElement.innerHTML = "<li>Không có dữ liệu cho tháng này.</li>";
        paginationElement.innerHTML = "";
        currentPage = 1;
        console.log("firstRender - no data, reset currentPage to 1");
    }
}

// Load ban đầu
function load() {
    const date = new Date();
    const monthValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthInputElement.value = monthValue;

    remainingAmountElement.textContent = "0 VND";
    currentPage = 1;
    console.log("Initial load - reset currentPage to 1");
    monthlySpendingStatistics();
    firstRender(monthValue);
}

// Kiểm tra số tiền còn lại
function remainMoney(monthValue, amount) {
    const monthData = monthlyCategoriesLocals.find(item => item.month === monthValue);
    if (!monthData) return true;

    const newRemain = monthData.remainMoney - amount;
    if (newRemain < 0) {
        Swal.fire({
            title: "Lỗi!",
            text: "Số tiền còn lại không đủ!",
            icon: "error"
        });
        return true;
    }

    monthData.remainMoney = newRemain;
    remainingAmountElement.textContent = `${newRemain.toLocaleString('vi', { style: 'currency', currency: 'VND' })}`;
    saveToLocalStorage();
    return false;
}

// Kiểm tra giới hạn danh mục
function checkLimit(monthValue, newLimit) {
    const monthData = monthlyCategoriesLocals.find(item => item.month === monthValue);
    if (!monthData) return false;

    const totalLimit = monthData.categories.reduce((sum, cat) => sum + cat.limit, 0) + +newLimit;
    return totalLimit > monthData.budget || totalLimit > monthData.remainMoney;
}

// Sự kiện
saveMonthlyBudgetElement.addEventListener("click", function(e) {
    e.preventDefault();
    if (validateMonth() || validateBudget()) return;

    const monthValue = monthInputElement.value;
    const budgetValue = +monthlyBudgetInputElement.value.trim();

    let monthData = monthlyCategoriesLocals.find(item => item.month === monthValue);
    if (monthData) {
        monthData.budget = budgetValue;
        monthData.remainMoney = budgetValue;
    } else {
        monthData = { month: monthValue, budget: budgetValue, remainMoney: budgetValue, categories: [] };
        monthlyCategoriesLocals.push(monthData);
    }

    remainingAmountElement.textContent = `${monthData.remainMoney.toLocaleString('vi', { style: 'currency', currency: 'VND' })}`;
    monthlyBudgetInputElement.value = "";
    saveToLocalStorage();
    monthlySpendingStatistics();
    firstRender(monthValue);
});

monthInputElement.addEventListener("change", function() {
    const monthValue = monthInputElement.value;
    currentPage = 1;
    console.log("Month changed to:", monthValue, "reset currentPage to 1");
    firstRender(monthValue);
    monthlySpendingStatistics();
});

addCategoryElement.addEventListener("click", function(e) {
    e.preventDefault();
    if (validateMonth()) return;

    const monthValue = monthInputElement.value;
    const name = nameCategoryElement.value.trim();
    const limit = +limitMoneyElement.value.trim();

    if (!name) {
        Swal.fire("Lỗi!", "Vui lòng nhập tên danh mục!", "error");
        return;
    }
    if (isNaN(limit) || limit <= 0) {
        Swal.fire("Lỗi!", "Giới hạn không hợp lệ!", "error");
        return;
    }

    if ("monthIndex" in editState && "categoryIndex" in editState) {
        const monthData = monthlyCategoriesLocals[editState.monthIndex];
        if (checkLimit(monthValue, limit - monthData.categories[editState.categoryIndex].limit)) {
            Swal.fire("Lỗi!", "Giới hạn mới vượt quá ngân sách!", "error");
            return;
        }
        monthData.categories[editState.categoryIndex].name = name;
        monthData.categories[editState.categoryIndex].limit = limit;
        editState = {};
        addCategoryElement.textContent = "Thêm danh mục";
    } else {
        addCategory(monthValue, name, limit);
    }

    nameCategoryElement.value = "";
    limitMoneyElement.value = "";
    renderCategoriesData(monthValue);
    renderOption(monthValue);
    saveToLocalStorage();
});

saveAddSpendingElement.addEventListener("click", function(e) {
    e.preventDefault();
    if (!requireMonthSelected()) return;

    const monthValue = monthInputElement.value;
    const money = moneyInputaddSpendingElement.value.trim();
    const categoryId = spendingCategoryElement.value;
    const note = noteInputaddSpendingElement.value.trim();

    addSpending(monthValue, money, categoryId, note);
    moneyInputaddSpendingElement.value = "";
    noteInputaddSpendingElement.value = "";
    monthlySpendingStatistics();
});

submitHistoryButtonElement.addEventListener("click", function(e) {
    e.preventDefault();
    const searchValue = searchInputElement.value.trim();
    if (!searchValue) {
        Swal.fire("Lỗi!", "Vui lòng nhập nội dung tìm kiếm!", "error");
        return;
    }
    searchHistory(searchValue);
});

sortElement.addEventListener("change", function() {
    if (!requireMonthSelected()) return;
    const sortValue = sortElement.value;
    if (sortValue) sortHistory(sortValue);
});

// Đăng xuất
const accountOptions = document.getElementById("accountOptions");
accountOptions.addEventListener("change", function () {
    if (accountOptions.value === "logout") {
        Swal.fire({
            title: "Xác nhận đăng xuất",
            text: "Bạn chắc chắn muốn đăng xuất chứ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đúng, đăng xuất!",
            cancelButtonText: "Hủy"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Thành công!",
                    text: "Đăng xuất thành công",
                    icon: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("currentUser");
                    window.location.href = "../pages/login.html";
                });
            }
        });
    }
});

// Khởi chạy
load();