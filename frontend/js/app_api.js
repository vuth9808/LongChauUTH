/* === KHAI BÁO BIẾN TOÀN CỤC === */
const BASE_URL = 'http://localhost:8080'; // API Backend
const TOKEN_KEY = 'lc_token_v2'; // Đổi key để tránh xung đột
const USER_KEY = 'lc_user_v2';

const STORAGE = {
    token: TOKEN_KEY,
    users_demo: 'lc_users_demo_v2',
    medicines: 'lc_meds_v2',
    categories: 'lc_cats_v2',
    units: 'lc_units_v2',
    suppliers: 'lc_suppliers_v2',
    employees: 'lc_employees_v2',
    batches: 'lc_batches_v2',
    activities: 'lc_activities_v2'
};

async function apiFetch(path, opts = {}) {
    const headers = opts.headers || {};
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    const token = sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    if (token) headers['Authorization'] = 'Bearer ' + token;
    try {
        const res = await fetch(BASE_URL + path, { ...opts, headers });
        if (res.status === 401) {
            alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
            logout();
            throw new Error('unauthorized');
        }
        if (!res.ok) {
            const text = await res.text();
            let json;
            try { json = JSON.parse(text); } catch (e) { json = { message: text }; }
            const err = new Error('HTTP ' + res.status);
            err.status = res.status; err.body = json;
            throw err;
        }
        if (res.status === 204) return null;
        return await res.json();
    } catch (err) {
        console.error('API Fetch Error:', err);
        throw err;
    }
}

async function loginApi(username, password) {
    const body = JSON.stringify({ username, password });
    return await apiFetch('/api/auth/login', { method: 'POST', body });
}

function saveSessionFromApi(token, profile) {
    sessionStorage.setItem(TOKEN_KEY, token);
    if (profile) sessionStorage.setItem(USER_KEY, JSON.stringify(profile));
    else sessionStorage.removeItem(USER_KEY);
}

function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    window.location = 'index.html';
}

function getCurrentUser() {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
}

function seedFallback() {
    if (!localStorage.getItem(STORAGE.users_demo)) {
        localStorage.setItem(STORAGE.users_demo, JSON.stringify([
            { username: 'admin', password: 'admin', role: 'admin', name: 'Quản trị viên' },
            { username: 'manager', password: 'manager', role: 'manager', name: 'Quản lý Kho' },
            { username: 'staff', password: 'staff', role: 'staff', name: 'Nhân viên Bán hàng' }
        ]));
    }

    // Nhóm thuốc
    if (!localStorage.getItem(STORAGE.categories)) {
        localStorage.setItem(STORAGE.categories, JSON.stringify([
            { id: 1, name: 'Kháng sinh' },
            { id: 2, name: 'Giảm đau - Hạ sốt' },
            { id: 3, name: 'Vitamin & Khoáng chất' }
        ]));
    }

    // Đơn vị tính
    if (!localStorage.getItem(STORAGE.units)) {
        localStorage.setItem(STORAGE.units, JSON.stringify([
            { id: 1, name: 'Vỉ' },
            { id: 2, name: 'Hộp' },
            { id: 3, name: 'Chai' },
            { id: 4, name: 'Ống' }
        ]));
    }

    // Nhà cung cấp
    if (!localStorage.getItem(STORAGE.suppliers)) {
        localStorage.setItem(STORAGE.suppliers, JSON.stringify([
            { id: 1, name: 'Dược Hậu Giang', phone: '02923891433', email: 'info@dhgpharma.com.vn', address: 'Cần Thơ' },
            { id: 2, name: 'Traphaco', phone: '18006612', email: 'info@traphaco.com.vn', address: 'Hà Nội' }
        ]));
    }

    // Nhân viên (Giống demo users)
    if (!localStorage.getItem(STORAGE.employees)) {
        localStorage.setItem(STORAGE.employees, JSON.stringify([
            { id: 1, username: 'admin', role: 'admin', name: 'Quản trị viên' },
            { id: 2, username: 'manager', role: 'manager', name: 'Quản lý Kho' },
            { id: 3, username: 'staff', role: 'staff', name: 'Nhân viên Bán hàng' }
        ]));
    }

    // Danh mục thuốc (với nhiều trường mới)
    if (!localStorage.getItem(STORAGE.medicines)) {
        localStorage.setItem(STORAGE.medicines, JSON.stringify([
            {
                id: 1,
                code: 'P001',
                name: 'Paracetamol 500mg',
                activeIngredient: 'Paracetamol',
                formulation: 'Viên nén',
                concentration: '500mg',
                packaging: 'Hộp 10 vỉ x 10 viên',
                unitId: 1, // Vỉ
                categoryId: 2, // Giảm đau
                price: 15000,
                wholesalePrice: 12000,
                type: 'Không kê đơn',
                manufacturer: 'Dược Hậu Giang',
                country: 'Việt Nam'
            },
            {
                id: 2,
                code: 'A002',
                name: 'Amoxicillin 250mg',
                activeIngredient: 'Amoxicillin',
                formulation: 'Viên nang',
                concentration: '250mg',
                packaging: 'Hộp 10 vỉ x 10 viên',
                unitId: 1, // Vỉ
                categoryId: 1, // Kháng sinh
                price: 30000,
                wholesalePrice: 25000,
                type: 'Kê đơn',
                manufacturer: 'Traphaco',
                country: 'Việt Nam'
            }
        ]));
    }

    // Lô thuốc (Kho)
    if (!localStorage.getItem(STORAGE.batches)) {
        // HSD: 1 = sắp hết hạn (dưới 30 ngày), 2 = xa
        let nearExpiryDate = new Date();
        nearExpiryDate.setDate(nearExpiryDate.getDate() + 15); //15 ngày
        let farExpiryDate = new Date();
        farExpiryDate.setFullYear(farExpiryDate.getFullYear() + 1); // Hết hạn trong 1 năm

        localStorage.setItem(STORAGE.batches, JSON.stringify([
            {
                id: 101,
                medId: 1, // Paracetamol
                batchCode: 'L001-P',
                expiryDate: farExpiryDate.toISOString().split('T')[0],
                stock: 100, // Tồn 100
                importPrice: 10000,
                supplierId: 1
            },
            {
                id: 102,
                medId: 2, // Amoxicillin
                batchCode: 'L002-A',
                expiryDate: nearExpiryDate.toISOString().split('T')[0], // Sắp hết hạn
                stock: 50, // Tồn 50
                importPrice: 20000,
                supplierId: 2
            },
            {
                id: 103,
                medId: 1, // Paracetamol (lô khác)
                batchCode: 'L003-P',
                expiryDate: farExpiryDate.toISOString().split('T')[0],
                stock: 8, // Sắp hết hàng
                importPrice: 11000,
                supplierId: 1
            }
        ]));
    }

    // Nhật ký
    if (!localStorage.getItem(STORAGE.activities)) {
        localStorage.setItem(STORAGE.activities, JSON.stringify([]));
    }
}

// Hàm ghi Nhật ký (Bảo mật)
function pushActFallback(text) {
    const user = getCurrentUser()?.name || 'System';
    const acts = JSON.parse(localStorage.getItem(STORAGE.activities) || '[]');
    acts.unshift(`${new Date().toLocaleString()} - [${user}] - ${text}`); // Thêm vào đầu
    localStorage.setItem(STORAGE.activities, JSON.stringify(acts.slice(0, 100))); // Giữ 100 log
}

// Hàm trợ giúp: Lấy dữ liệu (API hoặc Fallback)
async function getData(apiPath, storageKey) {
    try {
        return await apiFetch(apiPath);
    } catch (e) {
        return JSON.parse(localStorage.getItem(storageKey) || '[]');
    }
}
async function postData(apiPath, storageKey, payload) {
    try {
        return await apiFetch(apiPath, { method: 'POST', body: JSON.stringify(payload) });
    } catch (e) {
        let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const newId = items.length ? Math.max(...items.map(m => m.id)) + 1 : 1;
        const newItem = { ...payload, id: newId };
        items.push(newItem);
        localStorage.setItem(storageKey, JSON.stringify(items));
        return newItem;
    }
}
async function putData(apiPath, storageKey, id, payload) {
    try {
        return await apiFetch(`${apiPath}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    } catch (e) {
        let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
        items = items.map(m => (m.id === parseInt(id)) ? { ...m, ...payload, id: parseInt(id) } : m);
        localStorage.setItem(storageKey, JSON.stringify(items));
    }
}
async function deleteData(apiPath, storageKey, id) {
    try {
        await apiFetch(`${apiPath}/${id}`, { method: 'DELETE' });
    } catch (e) {
        let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
        items = items.filter(m => m.id !== parseInt(id));
        localStorage.setItem(storageKey, JSON.stringify(items));
    }
}
// Hàm trợ giúp: Lấy tên
function findNameById(id, list) {
    return list.find(x => x.id === id)?.name || '-';
}
// Hàm trợ giúp: Render <select>
function renderSelectOptions(elementId, items, placeholder) {
    const select = document.getElementById(elementId);
    if (select) {
        select.innerHTML = `<option value="">${placeholder}</option>` +
            items.map(item => `<option value="${item.id}">${item.name}</option>`).join('');
    }
}

/* === LOGIC TRANG ĐĂNG NHẬP (index.html) === */
if (document.getElementById('loginForm')) {
    seedFallback(); // Khởi tạo dữ liệu mẫu
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const u = document.getElementById('username').value.trim();
        const p = document.getElementById('password').value;
        try {
            const res = await loginApi(u, p);
            const token = res.token || res.accessToken;
            let profile = res.user || (await apiFetch('/api/users/me')).catch(() => ({ name: u }));
            saveSessionFromApi(token, profile);
            pushActFallback('Đăng nhập thành công');
            window.location = 'dashboard.html';
        } catch (err) {
            // Fallback to local demo users
            const users = JSON.parse(localStorage.getItem(STORAGE.users_demo) || '[]');
            const user = users.find(x => x.username === u && x.password === p);
            if (user) {
                sessionStorage.setItem(TOKEN_KEY, 'demo-token-' + user.role); // Token giả
                sessionStorage.setItem(USER_KEY, JSON.stringify(user));
                pushActFallback('Đăng nhập (Demo) thành công');
                window.location = 'dashboard.html';
            } else {
                alert('Đăng nhập thất bại. Vui lòng kiểm tra lại.');
            }
        }
    });
}

/* === LOGIC NAVBAR CHUNG & PHÂN QUYỀN === */
function commonNavbarSetup() {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
        window.location = 'index.html';
        return false;
    }

    // Hiển thị thông tin user
    const user = getCurrentUser();
    const el = document.getElementById('loggedUser');
    if (el) el.textContent = `${user?.name || 'User'} (${user?.role || 'user'})`;

    // Nút đăng xuất
    document.querySelectorAll('#logoutBtn').forEach(b => b.addEventListener('click', () => {
        pushActFallback('Đăng xuất');
        logout();
    }));

    // !! PHÂN QUYỀN TRÊN GIAO DIỆN !!
    // Chỉ 'admin' mới thấy trang Nhân viên
    if (user?.role !== 'admin') {
        document.querySelectorAll('a[href="employees.html"]').forEach(a => a.style.display = 'none');
    }
    // 'staff' (Nhân viên bán thuốc) không được vào Quản lý kho, NCC
    if (user?.role === 'staff') {
        document.querySelectorAll('a[href="inventory.html"], a[href="suppliers.html"], a[href="categories.html"], a[href="units.html"]').forEach(a => a.style.display = 'none');
    }
    return true;
}

/* === TRANG TỔNG QUAN (dashboard.html) === */
if (document.getElementById('statTotalStock')) {
    if (!commonNavbarSetup()) throw '';

    (async () => {
        // Lấy dữ liệu
        const batches = await getData('/api/batches', STORAGE.batches);
        const activities = await getData('/api/activities', STORAGE.activities);

        // Thống kê
        const totalStock = batches.reduce((sum, b) => sum + b.stock, 0);
        const lowStock = batches.filter(b => b.stock <= 10).length;

        // Cảnh báo hết hạn (dưới 30 ngày)
        const now = new Date();
        const expiryLimit = new Date(now.setDate(now.getDate() + 30));
        const nearExpiry = batches.filter(b => new Date(b.expiryDate) < expiryLimit).length;

        document.getElementById('statTotalStock').textContent = totalStock;
        document.getElementById('statLowStock').textContent = lowStock;
        document.getElementById('statNearExpiry').textContent = nearExpiry;
        document.getElementById('statSales').textContent = '0'; // Tạm thời

        // Render Nhật ký
        const recentList = document.getElementById('recentList');
        recentList.innerHTML = activities.map(a => `<li class="list-group-item small">${a}</li>`).join('');
    })();
}

/* === TRANG QUẢN LÝ THUỐC (medicines.html) === */
if (document.getElementById('medTable')) {
    if (!commonNavbarSetup()) throw '';

    const tableBody = document.querySelector('#medTable tbody');
    const modal = new bootstrap.Modal(document.getElementById('medModal'));
    const form = document.getElementById('medForm');
    let allMeds = [], allCats = [], allUnits = [], allBatches = [];

    // Load các select options
    async function loadMedOptions() {
        renderSelectOptions('medCategoryId', allCats, 'Chọn nhóm thuốc');
        renderSelectOptions('medUnitId', allUnits, 'Chọn đơn vị');
    }

    // Render bảng
    async function renderTable() {
        allMeds = await getData('/api/medicines', STORAGE.medicines);
        allCats = await getData('/api/categories', STORAGE.categories);
        allUnits = await getData('/api/units', STORAGE.units);
        allBatches = await getData('/api/batches', STORAGE.batches);

        tableBody.innerHTML = allMeds.map(med => {
            const category = findNameById(med.categoryId, allCats);
            const unit = findNameById(med.unitId, allUnits);
            // Tính tổng tồn kho từ tất cả các lô
            const totalStock = allBatches
                .filter(b => b.medId === med.id)
                .reduce((sum, b) => sum + b.stock, 0);

            return `<tr>
        <td>${med.code}</td>
        <td>${med.name}</td>
        <td>${med.activeIngredient || '-'}</td>
        <td>${category}</td>
        <td>${unit}</td>
        <td>${(med.price || 0).toLocaleString()}</td>
        <td>${totalStock}</td>
        <td>
          <button class="btn btn-sm btn-primary edit-btn" data-id="${med.id}">Sửa</button>
          <button class="btn btn-sm btn-danger del-btn" data-id="${med.id}">Xóa</button>
        </td>
      </tr>`;
        }).join('');

        // Gán sự kiện cho nút Sửa/Xóa
        tableBody.querySelectorAll('.edit-btn').forEach(b => b.addEventListener('click', () => openEdit(b.dataset.id)));
        tableBody.querySelectorAll('.del-btn').forEach(b => b.addEventListener('click', () => deleteItem(b.dataset.id)));
    }

    // Mở modal Sửa
    function openEdit(id) {
        const med = allMeds.find(m => m.id === parseInt(id));
        if (!med) return;

        document.getElementById('medId').value = med.id;
        document.getElementById('medCode').value = med.code;
        document.getElementById('medName').value = med.name;
        document.getElementById('medActiveIngredient').value = med.activeIngredient;
        document.getElementById('medFormulation').value = med.formulation;
        document.getElementById('medConcentration').value = med.concentration;
        document.getElementById('medPackaging').value = med.packaging;
        document.getElementById('medCategoryId').value = med.categoryId;
        document.getElementById('medUnitId').value = med.unitId;
        document.getElementById('medType').value = med.type;
        document.getElementById('medPrice').value = med.price;
        document.getElementById('medWholesalePrice').value = med.wholesalePrice;
        document.getElementById('medManufacturer').value = med.manufacturer;
        document.getElementById('medCountry').value = med.country;

        modal.show();
    }

    // Xóa
    async function deleteItem(id) {
        if (!confirm('Xác nhận xóa thuốc? (Sẽ xóa cả các lô liên quan)')) return;

        await deleteData('/api/medicines', STORAGE.medicines, id);
        // Xóa các lô (batches) liên quan
        let batches = await getData('/api/batches', STORAGE.batches);
        batches = batches.filter(b => b.medId !== parseInt(id));
        localStorage.setItem(STORAGE.batches, JSON.stringify(batches)); // Cập nhật fallback

        pushActFallback(`Xóa thuốc ID ${id}`);
        await renderTable();
    }

    // Nút Thêm mới
    document.getElementById('newMedBtn').addEventListener('click', () => {
        form.reset();
        document.getElementById('medId').value = '';
        modal.show();
    });

    // Submit Form
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const id = document.getElementById('medId').value;
        const payload = {
            code: document.getElementById('medCode').value,
            name: document.getElementById('medName').value,
            activeIngredient: document.getElementById('medActiveIngredient').value,
            formulation: document.getElementById('medFormulation').value,
            concentration: document.getElementById('medConcentration').value,
            packaging: document.getElementById('medPackaging').value,
            categoryId: parseInt(document.getElementById('medCategoryId').value),
            unitId: parseInt(document.getElementById('medUnitId').value),
            type: document.getElementById('medType').value,
            price: parseFloat(document.getElementById('medPrice').value),
            wholesalePrice: parseFloat(document.getElementById('medWholesalePrice').value),
            manufacturer: document.getElementById('medManufacturer').value,
            country: document.getElementById('medCountry').value,
        };

        if (id) {
            await putData('/api/medicines', STORAGE.medicines, id, payload);
            pushActFallback(`Cập nhật thuốc ${payload.name}`);
        } else {
            await postData('/api/medicines', STORAGE.medicines, payload);
            pushActFallback(`Thêm thuốc ${payload.name}`);
        }

        modal.hide();
        await renderTable();
    });

    // Khởi chạy
    (async () => {
        await renderTable(); // Render bảng trước
        await loadMedOptions(); // Sau đó load options
    })();
}

/* === TRANG QUẢN LÝ KHO (inventory.html) === */
if (document.getElementById('inventoryTable')) {
    if (!commonNavbarSetup()) throw '';

    const tableBody = document.querySelector('#inventoryTable tbody');
    const importModal = new bootstrap.Modal(document.getElementById('importModal'));
    const exportModal = new bootstrap.Modal(document.getElementById('exportModal'));
    const importForm = document.getElementById('importForm');
    const exportForm = document.getElementById('exportForm');
    let allMeds = [], allSuppliers = [], allBatches = [];

    // Render bảng tồn kho theo lô
    async function renderInventoryTable() {
        allMeds = await getData('/api/medicines', STORAGE.medicines);
        allSuppliers = await getData('/api/suppliers', STORAGE.suppliers);
        allBatches = await getData('/api/batches', STORAGE.batches);

        // Cảnh báo hết hạn (dưới 30 ngày)
        const now = new Date();
        const expiryLimit = new Date(new Date().setDate(now.getDate() + 30));

        tableBody.innerHTML = allBatches.map(batch => {
            const med = allMeds.find(m => m.id === batch.medId);
            const supplier = allSuppliers.find(s => s.id === batch.supplierId);

            const isNearExpiry = new Date(batch.expiryDate) < expiryLimit;
            const isLowStock = batch.stock <= 10;
            let rowClass = '';
            if (isNearExpiry) rowClass = 'table-danger'; // Hết hạn
            else if (isLowStock) rowClass = 'table-warning'; // Hết hàng

            return `<tr class="${rowClass}">
        <td>${med?.name || 'Lỗi'}</td>
        <td>${batch.batchCode}</td>
        <td>${new Date(batch.expiryDate).toLocaleDateString('vi-VN')} ${isNearExpiry ? '(Sắp hết hạn!)' : ''}</td>
        <td>${batch.stock} ${isLowStock ? '(Sắp hết!)' : ''}</td>
        <td>${(batch.importPrice || 0).toLocaleString()}</td>
        <td>${supplier?.name || '-'}</td>
      </tr>`;
        }).join('');
    }

    // Load options cho các modal
    async function loadInventoryOptions() {
        renderSelectOptions('importMedId', allMeds, 'Chọn thuốc...');
        renderSelectOptions('importSupplierId', allSuppliers, 'Chọn NCC...');

        // Render select cho modal xuất kho
        const exportSelect = document.getElementById('exportBatchId');
        exportSelect.innerHTML = '<option value="">Chọn lô cần xuất...</option>' +
            allBatches.map(batch => {
                const med = allMeds.find(m => m.id === batch.medId);
                return `<option value="${batch.id}">${med?.name} (Lô: ${batch.batchCode}, Tồn: ${batch.stock})</option>`;
            }).join('');
    }

    // Nút Nhập kho
    document.getElementById('newImportBtn').addEventListener('click', () => {
        importForm.reset();
        importModal.show();
    });

    // Nút Xuất kho
    document.getElementById('newExportBtn').addEventListener('click', () => {
        exportForm.reset();
        exportModal.show();
    });

    // Submit Form Nhập kho
    importForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const payload = {
            medId: parseInt(document.getElementById('importMedId').value),
            supplierId: parseInt(document.getElementById('importSupplierId').value),
            batchCode: document.getElementById('importBatchCode').value,
            expiryDate: document.getElementById('importExpiryDate').value,
            stock: parseInt(document.getElementById('importStock').value),
            importPrice: parseFloat(document.getElementById('importPrice').value),
        };

        // TODO: Xử lý logic gộp lô nếu trùng

        await postData('/api/batches', STORAGE.batches, payload);
        pushActFallback(`Nhập kho lô ${payload.batchCode}, SL: ${payload.stock}`);

        importModal.hide();
        await renderInventoryTable();
        await loadInventoryOptions(); // Tải lại select
    });

    // Submit Form Xuất kho
    exportForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const batchId = parseInt(document.getElementById('exportBatchId').value);
        const exportStock = parseInt(document.getElementById('exportStock').value);
        const reason = document.getElementById('exportReason').value;

        const batch = allBatches.find(b => b.id === batchId);
        if (!batch) {
            alert('Không tìm thấy lô');
            return;
        }
        if (exportStock > batch.stock) {
            alert('Số lượng xuất vượt quá tồn kho!');
            return;
        }

        // Trừ kho
        batch.stock -= exportStock;
        await putData('/api/batches', STORAGE.batches, batchId, batch);
        pushActFallback(`Xuất/Hủy kho lô ${batch.batchCode}, SL: ${exportStock}, Lý do: ${reason}`);

        exportModal.hide();
        await renderInventoryTable();
        await loadInventoryOptions(); // Tải lại select
    });

    // Khởi chạy
    (async () => {
        await renderInventoryTable();
        await loadInventoryOptions();
    })();
}

/* === TRANG BÁN HÀNG (sales.html) === */
if (document.getElementById('posSearchInput')) {
    if (!commonNavbarSetup()) throw '';

    const searchInput = document.getElementById('posSearchInput');
    const searchResultsBody = document.getElementById('posSearchResults');
    const cartBody = document.getElementById('posCartBody');
    const totalEl = document.getElementById('posTotal');
    const submitBtn = document.getElementById('posSubmitBtn');

    let allMeds = [], allBatches = [];
    let cart = []; // Giỏ hàng

    // Load dữ liệu
    (async () => {
        allMeds = await getData('/api/medicines', STORAGE.medicines);
        allBatches = await getData('/api/batches', STORAGE.batches);
        renderSearchResults(allMeds); // Hiển thị tất cả ban đầu
    })();

    // Render kết quả tìm kiếm
    function renderSearchResults(meds) {
        searchResultsBody.innerHTML = meds.map(med => {
            // Tính tổng tồn kho
            const totalStock = allBatches
                .filter(b => b.medId === med.id)
                .reduce((sum, b) => sum + b.stock, 0);

            return `
        <tr>
          <td>${med.name}</td>
          <td>${med.activeIngredient || '-'}</td>
          <td>${(med.price || 0).toLocaleString()}</td>
          <td>${totalStock}</td>
          <td>
            <button class="btn btn-sm btn-success add-to-cart-btn" data-id="${med.id}" ${totalStock <= 0 ? 'disabled' : ''}>
              +
            </button>
          </td>
        </tr>
      `;
        }).join('');

        // Gán sự kiện
        searchResultsBody.querySelectorAll('.add-to-cart-btn').forEach(b => {
            b.addEventListener('click', () => addToCart(b.dataset.id));
        });
    }

    // Xử lý tìm kiếm
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        if (!query) {
            renderSearchResults(allMeds);
            return;
        }
        const filtered = allMeds.filter(m =>
            m.name.toLowerCase().includes(query) ||
            m.code.toLowerCase().includes(query) ||
            (m.activeIngredient && m.activeIngredient.toLowerCase().includes(query))
        );
        renderSearchResults(filtered);
    });

    // Thêm vào giỏ hàng
    function addToCart(medId) {
        medId = parseInt(medId);
        const med = allMeds.find(m => m.id === medId);
        if (!med) return;

        // Kiểm tra tồn kho tổng
        const totalStock = allBatches
            .filter(b => b.medId === medId)
            .reduce((sum, b) => sum + b.stock, 0);

        const existingItem = cart.find(item => item.medId === medId);

        if (existingItem) {
            if (existingItem.quantity + 1 > totalStock) {
                alert('Đã đạt số lượng tồn kho tối đa!');
                return;
            }
            existingItem.quantity++;
        } else {
            if (1 > totalStock) {
                alert('Hết hàng!');
                return;
            }
            cart.push({ medId: medId, name: med.name, price: med.price, quantity: 1 });
        }
        renderCart();
    }

    // Render giỏ hàng
    function renderCart() {
        cartBody.innerHTML = cart.map((item, index) => `
      <tr>
        <td>${item.name}</td>
        <td>
          <input type="number" class="form-control form-control-sm cart-qty" data-index="${index}" value="${item.quantity}" min="1">
        </td>
        <td>${(item.price || 0).toLocaleString()}</td>
        <td>${((item.price || 0) * item.quantity).toLocaleString()}</td>
        <td>
          <button class="btn btn-sm btn-danger remove-from-cart-btn" data-index="${index}">X</button>
        </td>
      </tr>
    `).join('');

        // Cập nhật tổng tiền
        const total = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
        totalEl.textContent = total.toLocaleString() + ' VNĐ';

        // Gán sự kiện
        cartBody.querySelectorAll('.cart-qty').forEach(input => {
            input.addEventListener('change', (e) => updateCartQuantity(e.target.dataset.index, e.target.value));
        });
        cartBody.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => removeFromCart(e.target.dataset.index));
        });
    }

    // Cập nhật số lượng
    function updateCartQuantity(index, newQty) {
        const item = cart[index];
        newQty = parseInt(newQty);
        if (newQty <= 0) {
            removeFromCart(index);
            return;
        }

        // Kiểm tra tồn kho
        const totalStock = allBatches
            .filter(b => b.medId === item.medId)
            .reduce((sum, b) => sum + b.stock, 0);
        if (newQty > totalStock) {
            alert('Vượt quá số lượng tồn kho!');
            item.quantity = totalStock; // Set về max
        } else {
            item.quantity = newQty;
        }
        renderCart();
    }

    // Xóa khỏi giỏ
    function removeFromCart(index) {
        cart.splice(index, 1);
        renderCart();
    }

    // Thanh toán
    submitBtn.addEventListener('click', async () => {
        if (cart.length === 0) {
            alert('Chưa có sản phẩm trong giỏ');
            return;
        }

        // Logic trừ kho (FIFO - Lấy lô cũ nhất còn hàng)
        // Đây là phần phức tạp, mô phỏng:
        try {
            let log = `Tạo đơn hàng (Khách: ${document.getElementById('posCustomerName').value}): `;

            for (const item of cart) {
                let remainingQty = item.quantity;
                // Lấy các lô của thuốc này, sắp xếp theo HSD
                let batchesForMed = allBatches
                    .filter(b => b.medId === item.medId && b.stock > 0)
                    .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

                for (const batch of batchesForMed) {
                    if (remainingQty <= 0) break;

                    const qtyToTake = Math.min(remainingQty, batch.stock);
                    batch.stock -= qtyToTake;
                    remainingQty -= qtyToTake;

                    // Cập nhật lại lô này
                    await putData('/api/batches', STORAGE.batches, batch.id, batch);
                    log += `[Thuốc ${item.name}, Lô ${batch.batchCode}, SL: ${qtyToTake}] `;
                }
                if (remainingQty > 0) {
                    throw new Error(`Không đủ tồn kho cho ${item.name}`);
                }
            }

            pushActFallback(log);
            alert('Thanh toán thành công! Đã tự động trừ kho.');
            cart = [];
            renderCart();
            renderSearchResults(allMeds); // Cập nhật lại số tồn

        } catch (e) {
            alert('Lỗi khi thanh toán: ' + e.message);
            // Rollback không được mô phỏng ở đây
        }
    });

    // Nút quét barcode (mô phỏng)
    document.getElementById('posBarcodeBtn').addEventListener('click', () => {
        const fakeBarcode = prompt('Mô phỏng quét Barcode (Nhập mã P001 hoặc A002):');
        if(fakeBarcode) {
            searchInput.value = fakeBarcode;
            searchInput.dispatchEvent(new Event('input')); // Kích hoạt sự kiện tìm kiếm
        }
    });
}

/* === CÁC TRANG CRUD ĐƠN GIẢN (Categories, Units, Suppliers, Employees) === */

// Hàm tạo logic CRUD chung
function createSimpleCrudPage(config) {
    if (!document.getElementById(config.listId)) return; // Không phải trang này
    if (!commonNavbarSetup()) throw '';

    const list = document.getElementById(config.listId);
    const modal = new bootstrap.Modal(document.getElementById(config.modalId));
    const form = document.getElementById(config.formId);

    async function render() {
        const items = await getData(config.apiPath, config.storageKey);
        list.innerHTML = items.map(item => config.renderRow(item)).join('');

        list.querySelectorAll('.edit-btn').forEach(b => b.addEventListener('click', () => openEdit(parseInt(b.dataset.id))));
        list.querySelectorAll('.del-btn').forEach(b => b.addEventListener('click', () => deleteItem(parseInt(b.dataset.id))));
    }

    async function openEdit(id) {
        const items = await getData(config.apiPath, config.storageKey);
        const item = items.find(x => x.id === id);
        if(item) {
            config.fillForm(item);
            modal.show();
        }
    }

    async function deleteItem(id) {
        if (!confirm(config.deleteConfirm)) return;
        await deleteData(config.apiPath, config.storageKey, id);
        pushActFallback(`${config.logPrefix} (ID: ${id}) đã bị xóa`);
        await render();
    }

    document.getElementById(config.newBtnId).addEventListener('click', () => {
        form.reset();
        document.getElementById(config.idField).value = '';
        modal.show();
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const id = document.getElementById(config.idField).value;
        const payload = config.getPayload();

        if (id) {
            await putData(config.apiPath, config.storageKey, id, payload);
            pushActFallback(`${config.logPrefix} "${payload.name || ''}" đã được cập nhật`);
        } else {
            await postData(config.apiPath, config.storageKey, payload);
            pushActFallback(`${config.logPrefix} "${payload.name || ''}" đã được thêm mới`);
        }
        modal.hide();
        await render();
    });

    render();
}

// 1. Trang Nhóm thuốc (categories.html)
createSimpleCrudPage({
    listId: 'catList',
    modalId: 'catModal',
    formId: 'catForm',
    newBtnId: 'newCatBtn',
    idField: 'catId',
    apiPath: '/api/categories',
    storageKey: STORAGE.categories,
    deleteConfirm: 'Xác nhận xóa nhóm thuốc?',
    logPrefix: 'Nhóm thuốc',
    renderRow: (item) => `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      ${item.name}
      <div>
        <button class="btn btn-sm btn-primary edit-btn" data-id="${item.id}">Sửa</button>
        <button class="btn btn-sm btn-danger del-btn" data-id="${item.id}">Xóa</button>
      </div>
    </li>`,
    fillForm: (item) => {
        document.getElementById('catId').value = item.id;
        document.getElementById('catName').value = item.name;
    },
    getPayload: () => ({
        name: document.getElementById('catName').value.trim()
    })
});

// 2. Trang Đơn vị tính (units.html)
createSimpleCrudPage({
    listId: 'unitList',
    modalId: 'unitModal',
    formId: 'unitForm',
    newBtnId: 'newUnitBtn',
    idField: 'unitId',
    apiPath: '/api/units',
    storageKey: STORAGE.units,
    deleteConfirm: 'Xác nhận xóa đơn vị tính?',
    logPrefix: 'Đơn vị tính',
    renderRow: (item) => `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      ${item.name}
      <div>
        <button class="btn btn-sm btn-primary edit-btn" data-id="${item.id}">Sửa</button>
        <button class="btn btn-sm btn-danger del-btn" data-id="${item.id}">Xóa</button>
      </div>
    </li>`,
    fillForm: (item) => {
        document.getElementById('unitId').value = item.id;
        document.getElementById('unitName').value = item.name;
    },
    getPayload: () => ({
        name: document.getElementById('unitName').value.trim()
    })
});

// 3. Trang Nhà cung cấp (suppliers.html)
createSimpleCrudPage({
    listId: 'supplierTable', // ID của tbody
    modalId: 'supplierModal',
    formId: 'supplierForm',
    newBtnId: 'newSupplierBtn',
    idField: 'supplierId',
    apiPath: '/api/suppliers',
    storageKey: STORAGE.suppliers,
    deleteConfirm: 'Xác nhận xóa nhà cung cấp?',
    logPrefix: 'Nhà cung cấp',
    renderRow: (item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.phone || '-'}</td>
      <td>${item.email || '-'}</td>
      <td>${item.address || '-'}</td>
      <td>
        <button class="btn btn-sm btn-primary edit-btn" data-id="${item.id}">Sửa</button>
        <button class="btn btn-sm btn-danger del-btn" data-id="${item.id}">Xóa</button>
      </div>
    </tr>`,
    fillForm: (item) => {
        document.getElementById('supplierId').value = item.id;
        document.getElementById('supplierName').value = item.name;
        document.getElementById('supplierPhone').value = item.phone;
        document.getElementById('supplierEmail').value = item.email;
        document.getElementById('supplierAddress').value = item.address;
    },
    getPayload: () => ({
        name: document.getElementById('supplierName').value.trim(),
        phone: document.getElementById('supplierPhone').value.trim(),
        email: document.getElementById('supplierEmail').value.trim(),
        address: document.getElementById('supplierAddress').value.trim()
    })
});

// 4. Trang Nhân viên (employees.html)
createSimpleCrudPage({
    listId: 'employeeTable', // ID của tbody
    modalId: 'employeeModal',
    formId: 'employeeForm',
    newBtnId: 'newEmployeeBtn',
    idField: 'empId',
    apiPath: '/api/employees',
    storageKey: STORAGE.employees,
    deleteConfirm: 'Xác nhận xóa nhân viên?',
    logPrefix: 'Nhân viên',
    renderRow: (item) => `
    <tr>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.username}</td>
      <td>${item.role}</td>
      <td>
        <button class="btn btn-sm btn-primary edit-btn" data-id="${item.id}">Sửa</button>
        <button class="btn btn-sm btn-danger del-btn" data-id="${item.id}">Xóa</button>
      </div>
    </tr>`,
    fillForm: (item) => {
        document.getElementById('empId').value = item.id;
        document.getElementById('empName').value = item.name;
        document.getElementById('empUsername').value = item.username;
        document.getElementById('empRole').value = item.role;
        document.getElementById('empPassword').value = ''; // Luôn làm trống mật khẩu
    },
    getPayload: () => {
        const payload = {
            name: document.getElementById('empName').value.trim(),
            username: document.getElementById('empUsername').value.trim(),
            role: document.getElementById('empRole').value,
        };
        const password = document.getElementById('empPassword').value;
        if (password) {
            payload.password = password; // Chỉ thêm pass nếu được nhập
        }
        return payload;
    }
});