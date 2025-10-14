// Pharmacy Management System - Main JavaScript File

// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Global Variables
let currentSection = 'dashboard';
let medicines = [];
let inventory = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load initial data
    loadDashboardData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Show dashboard by default
    showDashboard();
}

function setupEventListeners() {
    // Search functionality
    document.getElementById('medicine-search').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchMedicines();
        }
    });
    
    document.getElementById('inventory-search').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchInventory();
        }
    });
    
    // Filter functionality
    document.getElementById('medicine-status-filter').addEventListener('change', function() {
        filterMedicines();
    });
    
    document.getElementById('inventory-status-filter').addEventListener('change', function() {
        filterInventory();
    });
}

// Navigation Functions
function showDashboard() {
    hideAllSections();
    document.getElementById('dashboard-section').style.display = 'block';
    currentSection = 'dashboard';
    updateActiveNavLink('dashboard');
    loadDashboardData();
}

function showMedicineManagement() {
    hideAllSections();
    document.getElementById('medicine-section').style.display = 'block';
    currentSection = 'medicine';
    updateActiveNavLink('medicine');
    loadMedicines();
}

function showInventoryManagement() {
    hideAllSections();
    document.getElementById('inventory-section').style.display = 'block';
    currentSection = 'inventory';
    updateActiveNavLink('inventory');
    loadInventory();
}

function hideAllSections() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
}

function updateActiveNavLink(section) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[onclick="show${section.charAt(0).toUpperCase() + section.slice(1)}${section === 'dashboard' ? '' : 'Management'}()"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        // Load medicine statistics
        const medicineStats = await fetch(`${API_BASE_URL}/medicines/stats/count`).then(res => res.json());
        document.getElementById('total-medicines').textContent = medicineStats.totalMedicines || 0;
        document.getElementById('active-medicines').textContent = medicineStats.activeMedicines || 0;
        
        // Load inventory statistics
        const inventoryStats = await fetch(`${API_BASE_URL}/inventory/stats`).then(res => res.json());
        document.getElementById('low-stock-items').textContent = inventoryStats.lowStockItems || 0;
        document.getElementById('out-of-stock-items').textContent = inventoryStats.outOfStockItems || 0;
        
        // Load recent activities (mock data for now)
        loadRecentActivities();
        
        // Load inventory stats
        loadInventoryStats(inventoryStats);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showAlert('Lỗi khi tải dữ liệu dashboard', 'danger');
    }
}

function loadRecentActivities() {
    const activitiesHtml = `
        <div class="list-group list-group-flush">
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <i class="bi bi-box-arrow-in-down text-success"></i>
                    <span class="ms-2">Nhập kho Amoxicillin 500mg</span>
                </div>
                <small class="text-muted">2 giờ trước</small>
            </div>
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <i class="bi bi-box-arrow-up text-warning"></i>
                    <span class="ms-2">Xuất kho Paracetamol 500mg</span>
                </div>
                <small class="text-muted">4 giờ trước</small>
            </div>
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <i class="bi bi-plus-circle text-primary"></i>
                    <span class="ms-2">Thêm thuốc mới Vitamin C</span>
                </div>
                <small class="text-muted">1 ngày trước</small>
            </div>
        </div>
    `;
    document.getElementById('recent-activities').innerHTML = activitiesHtml;
}

function loadInventoryStats(stats) {
    const statsHtml = `
        <div class="row text-center">
            <div class="col-6">
                <h4 class="text-primary">${stats.totalInventoryValue ? stats.totalInventoryValue.toLocaleString('vi-VN') : '0'} VNĐ</h4>
                <p class="text-muted mb-0">Tổng giá trị kho</p>
            </div>
            <div class="col-6">
                <h4 class="text-warning">${stats.lowStockItems || 0}</h4>
                <p class="text-muted mb-0">Sản phẩm sắp hết</p>
            </div>
        </div>
    `;
    document.getElementById('inventory-stats').innerHTML = statsHtml;
}

// Medicine Management Functions
async function loadMedicines() {
    try {
        showLoading('medicine-table-body');
        const response = await fetch(`${API_BASE_URL}/medicines/active`);
        medicines = await response.json();
        displayMedicines(medicines);
    } catch (error) {
        console.error('Error loading medicines:', error);
        showError('medicine-table-body', 'Lỗi khi tải danh sách thuốc');
        showAlert('Lỗi khi tải danh sách thuốc', 'danger');
    }
}

function displayMedicines(medicinesToShow) {
    const tbody = document.getElementById('medicine-table-body');
    
    if (medicinesToShow.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    <i class="bi bi-inbox"></i> Không có dữ liệu
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = medicinesToShow.map(medicine => `
        <tr>
            <td><strong>${medicine.code}</strong></td>
            <td>${medicine.name}</td>
            <td>${medicine.genericName || '-'}</td>
            <td>${medicine.unit}</td>
            <td>${formatCurrency(medicine.price)}</td>
            <td>${getStatusBadge(medicine.status)}</td>
            <td>
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-primary" onclick="editMedicine(${medicine.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info" onclick="viewMedicineDetails(${medicine.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteMedicine(${medicine.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function searchMedicines() {
    const keyword = document.getElementById('medicine-search').value.trim();
    if (keyword === '') {
        displayMedicines(medicines);
        return;
    }
    
    const filtered = medicines.filter(medicine => 
        medicine.name.toLowerCase().includes(keyword.toLowerCase()) ||
        medicine.genericName?.toLowerCase().includes(keyword.toLowerCase()) ||
        medicine.code.toLowerCase().includes(keyword.toLowerCase())
    );
    
    displayMedicines(filtered);
}

function filterMedicines() {
    const status = document.getElementById('medicine-status-filter').value;
    if (status === '') {
        displayMedicines(medicines);
        return;
    }
    
    const filtered = medicines.filter(medicine => medicine.status === status);
    displayMedicines(filtered);
}

// Inventory Management Functions
async function loadInventory() {
    try {
        showLoading('inventory-table-body');
        const response = await fetch(`${API_BASE_URL}/inventory/in-stock`);
        inventory = await response.json();
        displayInventory(inventory);
    } catch (error) {
        console.error('Error loading inventory:', error);
        showError('inventory-table-body', 'Lỗi khi tải danh sách tồn kho');
        showAlert('Lỗi khi tải danh sách tồn kho', 'danger');
    }
}

function displayInventory(inventoryToShow) {
    const tbody = document.getElementById('inventory-table-body');
    
    if (inventoryToShow.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    <i class="bi bi-inbox"></i> Không có dữ liệu
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = inventoryToShow.map(item => {
        const medicine = item.medicine;
        const stockStatus = getStockStatus(item.currentStock, item.minStock, item.maxStock);
        
        return `
            <tr>
                <td><strong>${medicine.code}</strong></td>
                <td>${medicine.name}</td>
                <td><span class="badge ${stockStatus.badgeClass}">${item.currentStock}</span></td>
                <td>${item.minStock}</td>
                <td>${item.maxStock}</td>
                <td>${stockStatus.badge}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-success" onclick="adjustStock(${item.id}, 'add')">
                            <i class="bi bi-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-warning" onclick="adjustStock(${item.id}, 'reduce')">
                            <i class="bi bi-dash"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="viewInventoryDetails(${item.id})">
                            <i class="bi bi-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function searchInventory() {
    const keyword = document.getElementById('inventory-search').value.trim();
    if (keyword === '') {
        displayInventory(inventory);
        return;
    }
    
    const filtered = inventory.filter(item => 
        item.medicine.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.medicine.genericName?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.medicine.code.toLowerCase().includes(keyword.toLowerCase())
    );
    
    displayInventory(filtered);
}

function filterInventory() {
    const status = document.getElementById('inventory-status-filter').value;
    if (status === '') {
        displayInventory(inventory);
        return;
    }
    
    let filtered = [];
    switch (status) {
        case 'in-stock':
            filtered = inventory.filter(item => item.currentStock > 0);
            break;
        case 'low-stock':
            filtered = inventory.filter(item => item.currentStock <= item.minStock && item.currentStock > 0);
            break;
        case 'out-of-stock':
            filtered = inventory.filter(item => item.currentStock === 0);
            break;
    }
    
    displayInventory(filtered);
}

// Modal Functions
function showAddMedicineModal() {
    const modal = new bootstrap.Modal(document.getElementById('addMedicineModal'));
    modal.show();
}

function showImportModal() {
    loadMedicineOptions('import-medicine');
    const modal = new bootstrap.Modal(document.getElementById('importModal'));
    modal.show();
}

function showExportModal() {
    loadMedicineOptions('export-medicine');
    const modal = new bootstrap.Modal(document.getElementById('exportModal'));
    modal.show();
}

async function loadMedicineOptions(selectId) {
    try {
        const response = await fetch(`${API_BASE_URL}/medicines/active`);
        const medicines = await response.json();
        
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">-- Chọn thuốc --</option>';
        
        medicines.forEach(medicine => {
            const option = document.createElement('option');
            option.value = medicine.id;
            option.textContent = `${medicine.code} - ${medicine.name}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading medicine options:', error);
    }
}

// CRUD Operations
async function addMedicine() {
    const form = document.getElementById('add-medicine-form');
    const formData = new FormData(form);
    
    const medicineData = {
        code: document.getElementById('medicine-code').value,
        name: document.getElementById('medicine-name').value,
        genericName: document.getElementById('medicine-generic-name').value,
        unit: document.getElementById('medicine-unit').value,
        price: parseFloat(document.getElementById('medicine-price').value),
        costPrice: parseFloat(document.getElementById('medicine-cost-price').value),
        barcode: document.getElementById('medicine-barcode').value,
        strength: document.getElementById('medicine-strength').value,
        description: document.getElementById('medicine-description').value,
        status: 'ACTIVE'
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/medicines`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(medicineData)
        });
        
        if (response.ok) {
            showAlert('Thêm thuốc thành công!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('addMedicineModal')).hide();
            form.reset();
            loadMedicines();
            loadDashboardData();
        } else {
            showAlert('Lỗi khi thêm thuốc', 'danger');
        }
    } catch (error) {
        console.error('Error adding medicine:', error);
        showAlert('Lỗi khi thêm thuốc', 'danger');
    }
}

async function importStock() {
    const medicineId = document.getElementById('import-medicine').value;
    const quantity = parseInt(document.getElementById('import-quantity').value);
    const unitPrice = parseFloat(document.getElementById('import-unit-price').value);
    const batchNumber = document.getElementById('import-batch-number').value;
    const notes = document.getElementById('import-notes').value;
    
    if (!medicineId || !quantity || !unitPrice) {
        showAlert('Vui lòng điền đầy đủ thông tin bắt buộc', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/inventory/medicine/${medicineId}/add-stock?quantity=${quantity}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            showAlert('Nhập kho thành công!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('importModal')).hide();
            document.getElementById('import-form').reset();
            loadInventory();
            loadDashboardData();
        } else {
            showAlert('Lỗi khi nhập kho', 'danger');
        }
    } catch (error) {
        console.error('Error importing stock:', error);
        showAlert('Lỗi khi nhập kho', 'danger');
    }
}

async function exportStock() {
    const medicineId = document.getElementById('export-medicine').value;
    const quantity = parseInt(document.getElementById('export-quantity').value);
    const unitPrice = parseFloat(document.getElementById('export-unit-price').value);
    const customer = document.getElementById('export-customer').value;
    const notes = document.getElementById('export-notes').value;
    
    if (!medicineId || !quantity || !unitPrice) {
        showAlert('Vui lòng điền đầy đủ thông tin bắt buộc', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/inventory/medicine/${medicineId}/reduce-stock?quantity=${quantity}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            showAlert('Xuất kho thành công!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('exportModal')).hide();
            document.getElementById('export-form').reset();
            loadInventory();
            loadDashboardData();
        } else {
            showAlert('Lỗi khi xuất kho', 'danger');
        }
    } catch (error) {
        console.error('Error exporting stock:', error);
        showAlert('Lỗi khi xuất kho', 'danger');
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function getStatusBadge(status) {
    const statusMap = {
        'ACTIVE': { class: 'bg-success', text: 'Hoạt động' },
        'INACTIVE': { class: 'bg-secondary', text: 'Không hoạt động' },
        'EXPIRED': { class: 'bg-danger', text: 'Hết hạn' }
    };
    
    const statusInfo = statusMap[status] || { class: 'bg-secondary', text: status };
    return `<span class="badge ${statusInfo.class}">${statusInfo.text}</span>`;
}

function getStockStatus(current, min, max) {
    if (current === 0) {
        return {
            badge: '<span class="badge bg-danger">Hết hàng</span>',
            badgeClass: 'bg-danger'
        };
    } else if (current <= min) {
        return {
            badge: '<span class="badge bg-warning">Sắp hết</span>',
            badgeClass: 'bg-warning'
        };
    } else if (current >= max) {
        return {
            badge: '<span class="badge bg-info">Đầy kho</span>',
            badgeClass: 'bg-info'
        };
    } else {
        return {
            badge: '<span class="badge bg-success">Bình thường</span>',
            badgeClass: 'bg-success'
        };
    }
}

function showLoading(elementId) {
    document.getElementById(elementId).innerHTML = `
        <tr>
            <td colspan="7" class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                </div>
            </td>
        </tr>
    `;
}

function showError(elementId, message) {
    document.getElementById(elementId).innerHTML = `
        <tr>
            <td colspan="7" class="text-center text-danger">
                <i class="bi bi-exclamation-triangle"></i> ${message}
            </td>
        </tr>
    `;
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Placeholder functions for future implementation
function editMedicine(id) {
    showAlert('Chức năng chỉnh sửa đang được phát triển', 'info');
}

function viewMedicineDetails(id) {
    showAlert('Chức năng xem chi tiết đang được phát triển', 'info');
}

function deleteMedicine(id) {
    if (confirm('Bạn có chắc chắn muốn xóa thuốc này?')) {
        showAlert('Chức năng xóa đang được phát triển', 'info');
    }
}

function adjustStock(id, action) {
    showAlert(`Chức năng ${action === 'add' ? 'thêm' : 'giảm'} tồn kho đang được phát triển`, 'info');
}

function viewInventoryDetails(id) {
    showAlert('Chức năng xem chi tiết tồn kho đang được phát triển', 'info');
}
