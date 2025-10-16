// Pharmacy Management System - Main JavaScript File

// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';
const ADMIN_AUTH_TOKEN = () => sessionStorage.getItem('adminAuth');

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
    // Default view: cards
    toggleMedicineView('cards');
}

function showInventoryManagement() {
    hideAllSections();
    document.getElementById('inventory-section').style.display = 'block';
    currentSection = 'inventory';
    updateActiveNavLink('inventory');
    loadInventory();
    // Default view: cards
    toggleInventoryView('cards');
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
    const cards = document.getElementById('medicine-cards');
    
    if (medicinesToShow.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    <i class="bi bi-inbox"></i> Không có dữ liệu
                </td>
            </tr>
        `;
        cards.innerHTML = '';
        return;
    }
    
    tbody.innerHTML = medicinesToShow.map(medicine => `
        <tr>
            <td><strong>${medicine.code}</strong></td>
            <td>
                ${medicine.imageUrl ? `<img src="${medicine.imageUrl}" alt="${medicine.name}" style="width:32px;height:32px;object-fit:cover;border-radius:4px;margin-right:8px;vertical-align:middle;" onerror="this.style.display='none'">` : ''}
                <span>${medicine.name}</span>
            </td>
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

    cards.innerHTML = medicinesToShow.map(medicine => `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <div class="card h-100" role="button" onclick="openMedicineModal(${medicine.id})">
                ${medicine.imageUrl ? `<img src="${medicine.imageUrl}" class="card-img-top" alt="${medicine.name}" style="height:160px;object-fit:cover;">` : ''}
                <div class="card-body">
                    <h6 class="card-title mb-1">${medicine.name}</h6>
                    <div class="text-muted small mb-2">${medicine.code}</div>
                    <div class="mb-2">${getStatusBadge(medicine.status)}</div>
                    <div class="fw-semibold">${formatCurrency(medicine.price)}</div>
                </div>
                <div class="card-footer bg-transparent border-top-0 pb-3">
                    <div class="btn-group w-100" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="event.stopPropagation(); editMedicine(${medicine.id})"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-info" onclick="event.stopPropagation(); openMedicineModal(${medicine.id})"><i class="bi bi-eye"></i></button>
                        <button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation(); deleteMedicine(${medicine.id})"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function openMedicineModal(id) {
    fetch(`${API_BASE_URL}/medicines/${id}`)
        .then(res => res.json())
        .then(m => {
            document.getElementById('medicineDetailTitle').textContent = m.name || 'Chi tiết thuốc';
            document.getElementById('medicineDetailCode').textContent = m.code || '';
            document.getElementById('medicineDetailGeneric').textContent = m.genericName || '-';
            document.getElementById('medicineDetailUnit').textContent = m.unit || '';
            document.getElementById('medicineDetailPrice').textContent = formatCurrency(m.price || 0);
            document.getElementById('medicineDetailStatus').innerHTML = getStatusBadge(m.status);
            document.getElementById('medicineDetailDesc').textContent = m.description || '';
            const img = document.getElementById('medicineDetailImage');
            if (m.imageUrl) {
                img.src = m.imageUrl;
                img.style.display = 'block';
            } else {
                img.style.display = 'none';
            }
            const editBtn = document.getElementById('medicineDetailEditBtn');
            editBtn.onclick = () => editMedicine(m.id);
            const modal = new bootstrap.Modal(document.getElementById('medicineDetailModal'));
            modal.show();
        })
        .catch(() => showAlert('Không tải được chi tiết thuốc', 'danger'));
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
    const cards = document.getElementById('inventory-cards');
    
    if (inventoryToShow.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    <i class="bi bi-inbox"></i> Không có dữ liệu
                </td>
            </tr>
        `;
        cards.innerHTML = '';
        return;
    }
    
    tbody.innerHTML = inventoryToShow.map(item => {
        const stockStatus = getStockStatus(item.currentStock, item.minStock, item.maxStock);
        
        return `
            <tr>
                <td><strong>${item.medicineCode}</strong></td>
                <td>${item.medicineName}</td>
                <td><span class="badge ${stockStatus.badgeClass}">${item.currentStock}</span></td>
                <td>${item.minStock}</td>
                <td>${item.maxStock}</td>
                <td>${stockStatus.badge}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-success" onclick="adjustStock(${item.medicineId}, 'add')">
                            <i class="bi bi-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-warning" onclick="adjustStock(${item.medicineId}, 'reduce')">
                            <i class="bi bi-dash"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="viewInventoryDetails(${item.medicineId})">
                            <i class="bi bi-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    cards.innerHTML = inventoryToShow.map(item => {
        const stockStatus = getStockStatus(item.currentStock, item.minStock, item.maxStock);
        return `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card h-100" role="button" onclick="openInventoryModal('${item.medicineCode}')">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <div class="fw-semibold">${item.medicineName}</div>
                                <div class="text-muted small mb-2">${item.medicineCode}</div>
                            </div>
                            <div>${stockStatus.badge}</div>
                        </div>
                        <div class="mt-2 small">Tồn: <span class="badge ${stockStatus.badgeClass}">${item.currentStock}</span></div>
                        <div class="text-muted small">Min/Max: ${item.minStock}/${item.maxStock}</div>
                    </div>
                    <div class="card-footer bg-transparent border-top-0 pb-3">
                        <div class="btn-group w-100" role="group">
                            <button class="btn btn-sm btn-outline-success" onclick="event.stopPropagation(); adjustStock(${item.medicineId}, 'add')"><i class="bi bi-plus"></i></button>
                            <button class="btn btn-sm btn-outline-warning" onclick="event.stopPropagation(); adjustStock(${item.medicineId}, 'reduce')"><i class="bi bi-dash"></i></button>
                            <button class="btn btn-sm btn-outline-info" onclick="event.stopPropagation(); openInventoryModal('${item.medicineCode}')"><i class="bi bi-eye"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openInventoryModal(medicineCode) {
    // Try to find medicine image by code
    const med = Array.isArray(medicines) ? medicines.find(m => m.code === medicineCode) : null;
    const img = document.getElementById('inventoryDetailImage');
    if (med && med.imageUrl) {
        img.src = med.imageUrl;
        img.style.display = 'block';
    } else {
        img.style.display = 'none';
    }
    // Fetch inventory details for more accurate numbers
    fetch(`${API_BASE_URL}/inventory/search?keyword=${encodeURIComponent(medicineCode)}`)
        .then(res => res.json())
        .then(list => {
            const item = Array.isArray(list) ? list.find(x => x.medicineCode === medicineCode) : null;
            if (item) {
                const stockStatus = getStockStatus(item.currentStock, item.minStock, item.maxStock);
                document.getElementById('inventoryDetailTitle').textContent = item.medicineName || 'Chi tiết tồn kho';
                document.getElementById('inventoryDetailCode').textContent = item.medicineCode || '';
                document.getElementById('inventoryDetailName').textContent = item.medicineName || '';
                document.getElementById('inventoryDetailCurrent').textContent = item.currentStock;
                document.getElementById('inventoryDetailMinMax').textContent = `${item.minStock}/${item.maxStock}`;
                document.getElementById('inventoryDetailStatus').innerHTML = stockStatus.badge;
            }
            const modal = new bootstrap.Modal(document.getElementById('inventoryDetailModal'));
            modal.show();
        })
        .catch(() => {
            // fallback: just open modal without details
            const modal = new bootstrap.Modal(document.getElementById('inventoryDetailModal'));
            modal.show();
        });
}

function toggleMedicineView(mode) {
    const tableWrapper = document.getElementById('medicine-table-wrapper');
    const cards = document.getElementById('medicine-cards');
    if (mode === 'cards') {
        tableWrapper.style.display = 'none';
        cards.style.display = 'flex';
    } else {
        tableWrapper.style.display = 'block';
        cards.style.display = 'none';
    }
}

function toggleInventoryView(mode) {
    const tableWrapper = document.getElementById('inventory-table-wrapper');
    const cards = document.getElementById('inventory-cards');
    if (mode === 'cards') {
        tableWrapper.style.display = 'none';
        cards.style.display = 'flex';
    } else {
        tableWrapper.style.display = 'block';
        cards.style.display = 'none';
    }
}

function searchInventory() {
    const keyword = document.getElementById('inventory-search').value.trim();
    if (keyword === '') {
        displayInventory(inventory);
        return;
    }
    
    const filtered = inventory.filter(item => 
        item.medicineName.toLowerCase().includes(keyword.toLowerCase()) ||
        item.medicineGenericName?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.medicineCode.toLowerCase().includes(keyword.toLowerCase())
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
            imageUrl: document.getElementById('medicine-image-url').value,
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

async function updateMedicine() {
    const modalEl = document.getElementById('editMedicineModal');
    const id = modalEl.getAttribute('data-edit-id');
    if (!id) return;

    const payload = {
        name: document.getElementById('edit-medicine-name').value,
        genericName: document.getElementById('edit-medicine-generic-name').value,
        unit: document.getElementById('edit-medicine-unit').value,
        price: parseFloat(document.getElementById('edit-medicine-price').value),
        costPrice: parseFloat(document.getElementById('edit-medicine-cost-price').value),
        barcode: document.getElementById('edit-medicine-barcode').value,
        imageUrl: document.getElementById('edit-medicine-image-url').value,
        strength: document.getElementById('edit-medicine-strength').value,
        description: document.getElementById('edit-medicine-description').value,
        categoryId: document.getElementById('edit-medicine-category').value ? Number(document.getElementById('edit-medicine-category').value) : null,
        manufacturerId: document.getElementById('edit-medicine-manufacturer').value ? Number(document.getElementById('edit-medicine-manufacturer').value) : null
    };

    try {
        const res = await fetch(`${API_BASE_URL}/medicines/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            showAlert('Cập nhật thuốc thành công', 'success');
            bootstrap.Modal.getInstance(modalEl).hide();
            await loadMedicines();
        } else {
            showAlert('Cập nhật thuốc thất bại', 'danger');
        }
    } catch (e) {
        console.error(e);
        showAlert('Cập nhật thuốc thất bại', 'danger');
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
        const response = await fetch(`${API_BASE_URL}/inventory/medicine/${medicineId}/add-stock`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity })
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
        const response = await fetch(`${API_BASE_URL}/inventory/medicine/${medicineId}/reduce-stock`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity })
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

// Image upload for medicines
async function uploadMedicineImage() {
    const fileInput = document.getElementById('medicine-image-file');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        showAlert('Vui lòng chọn một file ảnh', 'warning');
        return;
    }
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
        const res = await fetch(`${API_BASE_URL}/admin/upload-image`, {
            method: 'POST',
            headers: ADMIN_AUTH_TOKEN() ? { 'Authorization': `Basic ${ADMIN_AUTH_TOKEN()}` } : {},
            body: formData
        });
        if (!res.ok) {
            throw new Error('Upload thất bại');
        }
        const data = await res.json();
        const url = data.url;
        if (url) {
            const urlInput = document.getElementById('medicine-image-url');
            urlInput.value = url.startsWith('http') ? url : `${window.location.origin}${url}`;
            showAlert('Tải ảnh thành công', 'success');
        } else {
            showAlert('Không nhận được URL ảnh', 'danger');
        }
    } catch (e) {
        console.error('Upload error:', e);
        showAlert('Tải ảnh thất bại', 'danger');
    }
}

async function uploadEditMedicineImage() {
    const fileInput = document.getElementById('edit-medicine-image-file');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        showAlert('Vui lòng chọn một file ảnh', 'warning');
        return;
    }
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
        const res = await fetch(`${API_BASE_URL}/admin/upload-image`, {
            method: 'POST',
            headers: ADMIN_AUTH_TOKEN() ? { 'Authorization': `Basic ${ADMIN_AUTH_TOKEN()}` } : {},
            body: formData
        });
        if (!res.ok) throw new Error('Upload thất bại');
        const data = await res.json();
        const url = data.url;
        if (url) {
            const urlInput = document.getElementById('edit-medicine-image-url');
            urlInput.value = url.startsWith('http') ? url : `${window.location.origin}${url}`;
            showAlert('Tải ảnh thành công', 'success');
        } else {
            showAlert('Không nhận được URL ảnh', 'danger');
        }
    } catch (e) {
        console.error('Upload error:', e);
        showAlert('Tải ảnh thất bại', 'danger');
    }
}

// Placeholder functions for future implementation
function editMedicine(id) {
    fetch(`${API_BASE_URL}/medicines/${id}`)
        .then(res => res.json())
        .then(m => {
            Promise.all([
                fetch(`${API_BASE_URL}/categories`).then(r => r.json()),
                fetch(`${API_BASE_URL}/manufacturers`).then(r => r.json())
            ]).then(([cats, mans]) => {
                const catSelect = document.getElementById('edit-medicine-category');
                const manSelect = document.getElementById('edit-medicine-manufacturer');
                catSelect.innerHTML = '<option value="">-- Chọn danh mục --</option>';
                manSelect.innerHTML = '<option value="">-- Chọn nhà sản xuất --</option>';
                cats.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.id;
                    opt.textContent = c.name;
                    if (m.categoryId && Number(m.categoryId) === Number(c.id)) opt.selected = true;
                    catSelect.appendChild(opt);
                });
                mans.forEach(ma => {
                    const opt = document.createElement('option');
                    opt.value = ma.id;
                    opt.textContent = ma.name;
                    if (m.manufacturerId && Number(m.manufacturerId) === Number(ma.id)) opt.selected = true;
                    manSelect.appendChild(opt);
                });
            }).catch(() => {});
            document.getElementById('edit-medicine-code').value = m.code || '';
            document.getElementById('edit-medicine-name').value = m.name || '';
            document.getElementById('edit-medicine-generic-name').value = m.genericName || '';
            document.getElementById('edit-medicine-unit').value = m.unit || '';
            document.getElementById('edit-medicine-price').value = m.price || 0;
            document.getElementById('edit-medicine-cost-price').value = m.costPrice || 0;
            document.getElementById('edit-medicine-barcode').value = m.barcode || '';
            document.getElementById('edit-medicine-image-url').value = m.imageUrl || '';
            document.getElementById('edit-medicine-strength').value = m.strength || '';
            document.getElementById('edit-medicine-description').value = m.description || '';
            const modal = new bootstrap.Modal(document.getElementById('editMedicineModal'));
            modal.show();
            document.getElementById('editMedicineModal').setAttribute('data-edit-id', String(id));
        })
        .catch(() => showAlert('Không tải được dữ liệu thuốc', 'danger'));
}

function viewMedicineDetails(id) {
    // Simple viewer: fetch and alert details; could be upgraded to modal
    fetch(`${API_BASE_URL}/medicines/${id}`)
        .then(res => res.json())
        .then(m => {
            const info = `Mã: ${m.code}\nTên: ${m.name}\nĐơn vị: ${m.unit}\nGiá: ${formatCurrency(m.price)}\nTrạng thái: ${m.status}`;
            showAlert(info.replaceAll('\n', '<br>'), 'info');
        })
        .catch(() => showAlert('Không tải được chi tiết thuốc', 'danger'));
}

function deleteMedicine(id) {
    if (confirm('Bạn có chắc chắn muốn xóa thuốc này?')) {
        fetch(`${API_BASE_URL}/medicines/${id}`, { method: 'DELETE' })
            .then(res => {
                if (res.ok) {
                    showAlert('Đã xóa thuốc', 'success');
                    loadMedicines();
                } else {
                    showAlert('Xóa thuốc thất bại', 'danger');
                }
            })
            .catch(() => showAlert('Xóa thuốc thất bại', 'danger'));
    }
}

function adjustStock(id, action) {
    const qty = prompt(`Nhập số lượng cần ${action === 'add' ? 'thêm' : 'giảm'}:`);
    const quantity = parseInt(qty || '0');
    if (!quantity || quantity <= 0) return;
    const endpoint = action === 'add' ? 'add-stock' : 'reduce-stock';
    fetch(`${API_BASE_URL}/inventory/medicine/${id}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
    }).then(res => {
        if (res.ok) {
            showAlert('Cập nhật tồn kho thành công', 'success');
            loadInventory();
            loadDashboardData();
        } else {
            showAlert('Cập nhật tồn kho thất bại', 'danger');
        }
    }).catch(() => showAlert('Cập nhật tồn kho thất bại', 'danger'));
}

function viewInventoryDetails(id) {
    fetch(`${API_BASE_URL}/inventory/medicine/${id}`)
        .then(res => res.json())
        .then(inv => {
            const stockStatus = getStockStatus(inv.currentStock, inv.minStock, inv.maxStock);
            const info = `Thuốc: ${inv.medicineName} (${inv.medicineCode})\nTồn: ${inv.currentStock}\nMin/Max: ${inv.minStock}/${inv.maxStock}`;
            showAlert(info.replaceAll('\n', '<br>'), 'info');
        })
        .catch(() => showAlert('Không tải được chi tiết tồn kho', 'danger'));
}
