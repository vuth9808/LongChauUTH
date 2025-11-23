const API_URL = '../Backend_PHP/api.php'; 

const app = {
    data: [],
    isEditing: false,
    currentView: 'list',

    init: function() {
        this.loadData();
        // Active link styles initial
        this.switchView('list');
    },

    // --- FETCH DATA FROM BACKEND ---
    loadData: function() {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                this.data = data;
                this.updateUI();
                this.updateStats();
            })
            .catch(error => {
                console.error('Error:', error);
                this.showToast('Lỗi kết nối Server!', 'error');
            });
    },

    updateUI: function() {
        if(this.currentView === 'list') this.renderList();
        else this.renderInventory();
    },

    // --- NAVIGATION ---
    switchView: function(viewName) {
        this.currentView = viewName;
        document.getElementById('view-list').classList.add('hidden');
        document.getElementById('view-inventory').classList.add('hidden');
        document.getElementById('nav-list').classList.remove('bg-blue-50', 'text-blue-700');
        document.getElementById('nav-inventory').classList.remove('bg-blue-50', 'text-blue-700');
        document.getElementById('nav-list').classList.add('text-gray-600');
        document.getElementById('nav-inventory').classList.add('text-gray-600');

        if (viewName === 'list') {
            document.getElementById('view-list').classList.remove('hidden');
            document.getElementById('nav-list').classList.add('bg-blue-50', 'text-blue-700');
            document.getElementById('nav-list').classList.remove('text-gray-600');
            this.renderList();
        } else {
            document.getElementById('view-inventory').classList.remove('hidden');
            document.getElementById('nav-inventory').classList.add('bg-blue-50', 'text-blue-700');
            document.getElementById('nav-inventory').classList.remove('text-gray-600');
            this.renderInventory();
        }
    },

    // --- RENDER ---
    renderList: function(searchQuery = '') {
        const grid = document.getElementById('drugGrid');
        grid.innerHTML = '';
        
        const filtered = this.data.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.sku.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filtered.length === 0) {
            document.getElementById('emptyState').classList.remove('hidden');
        } else {
            document.getElementById('emptyState').classList.add('hidden');
            filtered.forEach(item => {
                const card = `
                    <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col h-full group">
                        <div class="relative h-48 overflow-hidden bg-gray-100 cursor-pointer" onclick="app.showDetail(${item.id})">
                            <img src="${item.image || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                                 onerror="this.src='https://via.placeholder.com/300x200?text=Error'"
                                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                            <div class="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-600 shadow-sm">${item.sku}</div>
                            ${item.quantity <= 10 ? '<div class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold shadow-sm">Sắp hết</div>' : ''}
                        </div>
                        <div class="p-4 flex-1 flex flex-col">
                            <div class="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">${item.category}</div>
                            <h3 class="font-bold text-gray-800 text-lg mb-1 line-clamp-2 hover:text-blue-600 cursor-pointer" onclick="app.showDetail(${item.id})">${item.name}</h3>
                            <div class="mt-auto flex items-end justify-between border-t pt-3">
                                <div>
                                    <span class="block text-xs text-gray-400">Giá bán</span>
                                    <span class="text-blue-700 font-bold text-lg">${item.price.toLocaleString('vi-VN')}đ</span>
                                    <span class="text-gray-500 text-xs">/${item.unit}</span>
                                </div>
                                <div class="flex gap-2">
                                    <button onclick="app.editDrug(${item.id})" class="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50"><i class="fa-solid fa-pen"></i></button>
                                    <button onclick="app.deleteDrug(${item.id})" class="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50"><i class="fa-solid fa-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>`;
                grid.innerHTML += card;
            });
        }
    },

    renderInventory: function() {
        const tbody = document.getElementById('inventoryTableBody');
        tbody.innerHTML = '';
        this.data.forEach(item => {
            const statusClass = item.quantity > 10 ? 'bg-green-100 text-green-800' : (item.quantity > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800');
            const statusText = item.quantity > 10 ? 'Còn hàng' : (item.quantity > 0 ? 'Sắp hết' : 'Hết hàng');
            
            const row = `
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.sku}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div class="flex items-center gap-3">
                            <img class="h-8 w-8 rounded object-cover border" src="${item.image || 'https://via.placeholder.com/100'}" onerror="this.src='https://via.placeholder.com/100'">
                            ${item.name}
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.unit}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toLocaleString('vi-VN')}đ</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-bold ${item.quantity <= 10 ? 'text-red-600' : 'text-gray-700'}">${item.quantity}</td>
                    <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">${statusText}</span></td>
                </tr>`;
            tbody.innerHTML += row;
        });
    },

    updateStats: function() {
        document.getElementById('stat-total').innerText = this.data.length;
        document.getElementById('stat-warning').innerText = this.data.filter(i => i.quantity <= 10).length;
    },

    handleSearch: function() {
        const query = document.getElementById('searchInput').value;
        this.renderList(query);
    },

    // --- CRUD ---
    openModal: function() {
        this.isEditing = false;
        document.getElementById('drugForm').reset();
        document.getElementById('drugId').value = '';
        document.getElementById('modalTitle').innerText = 'Thêm thuốc mới';
        document.getElementById('drugModal').classList.remove('hidden');
    },

    closeModal: function() {
        document.getElementById('drugModal').classList.add('hidden');
    },

    saveDrug: function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            sku: document.getElementById('sku').value,
            category: document.getElementById('category').value,
            price: document.getElementById('price').value,
            quantity: document.getElementById('quantity').value,
            unit: document.getElementById('unit').value,
            form: document.getElementById('form').value,
            image: document.getElementById('image').value,
            ingredients: document.getElementById('ingredients').value,
            manufacturer: document.getElementById('manufacturer').value,
            specification: document.getElementById('specification').value,
            description: document.getElementById('description').value,
            usage_instruction: document.getElementById('usage_instruction').value,
            storage_instruction: document.getElementById('storage_instruction').value
        };

        let method = 'POST';
        let bodyData = formData;

        if (this.isEditing) {
            method = 'PUT';
            bodyData = { ...formData, id: document.getElementById('drugId').value };
        }

        fetch(API_URL, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        })
        .then(response => response.json())
        .then(data => {
            if(data.message.includes("Lỗi")) {
                 this.showToast(data.message, 'error');
            } else {
                this.showToast(this.isEditing ? 'Đã cập nhật!' : 'Đã thêm mới!');
                this.closeModal();
                this.loadData();
            }
        });
    },

    editDrug: function(id) {
        const item = this.data.find(d => d.id === id);
        if (!item) return;

        this.isEditing = true;
        document.getElementById('modalTitle').innerText = 'Chỉnh sửa thuốc';
        document.getElementById('drugId').value = item.id;
        
        // Fill form
        const fields = ['name', 'sku', 'category', 'price', 'quantity', 'unit', 'form', 'image', 'ingredients', 'manufacturer', 'specification', 'description', 'usage_instruction', 'storage_instruction'];
        fields.forEach(field => {
            if(document.getElementById(field)) document.getElementById(field).value = item[field] || '';
        });

        document.getElementById('drugModal').classList.remove('hidden');
    },

    deleteDrug: function(id) {
        if(confirm('Bạn có chắc chắn muốn xóa thuốc này?')) {
            fetch(`${API_URL}?id=${id}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    this.showToast('Đã xóa thuốc!');
                    this.loadData();
                });
        }
    },

    showDetail: function(id) {
        const item = this.data.find(d => d.id === id);
        if (!item) return;

        const content = `
            <div class="flex flex-col md:flex-row h-full">
                <div class="md:w-2/5 bg-gray-100 p-4 flex items-center justify-center">
                     <img src="${item.image || 'https://via.placeholder.com/300'}" class="max-h-64 md:max-h-80 object-contain shadow-lg rounded-lg">
                </div>
                <div class="md:w-3/5 p-6 overflow-y-auto">
                    <div class="mb-4">
                        <span class="text-blue-600 font-bold text-sm uppercase">${item.category}</span>
                        <h2 class="text-2xl font-bold text-gray-800 mt-1">${item.name}</h2>
                        <p class="text-gray-500 text-sm">SKU: ${item.sku}</p>
                    </div>
                    <div class="flex items-end gap-2 mb-6 pb-6 border-b">
                        <span class="text-3xl font-bold text-blue-700">${item.price.toLocaleString('vi-VN')}đ</span>
                        <span class="text-gray-500 mb-1">/${item.unit}</span>
                        <span class="ml-auto text-sm ${item.quantity > 0 ? 'text-green-600' : 'text-red-500'} font-bold">
                            ${item.quantity > 0 ? `Còn hàng (${item.quantity})` : 'Hết hàng'}
                        </span>
                    </div>
                    <div class="space-y-4">
                        <div><h4 class="font-bold text-gray-700 text-sm">Thành phần</h4><p class="text-gray-600 text-sm">${item.ingredients}</p></div>
                        <div><h4 class="font-bold text-gray-700 text-sm">Công dụng</h4><p class="text-gray-600 text-sm">${item.description}</p></div>
                        <div class="grid grid-cols-2 gap-4">
                            <div><h4 class="font-bold text-gray-700 text-sm">Quy cách</h4><p class="text-gray-600 text-sm">${item.specification}</p></div>
                            <div><h4 class="font-bold text-gray-700 text-sm">Nhà sản xuất</h4><p class="text-gray-600 text-sm">${item.manufacturer}</p></div>
                        </div>
                    </div>
                </div>
            </div>`;
        document.getElementById('detailContent').innerHTML = content;
        document.getElementById('detailModal').classList.remove('hidden');
    },

    showToast: function(message, type = 'success') {
        const toast = document.getElementById('toast');
        document.getElementById('toastMessage').innerText = message;
        document.getElementById('toastIcon').className = type === 'success' ? 'fa-solid fa-check-circle text-green-400' : 'fa-solid fa-exclamation-circle text-red-400';
        toast.classList.remove('translate-y-20', 'opacity-0');
        setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => { app.init(); });
// Close modals on outside click
window.onclick = function(event) {
    if (event.target == document.getElementById('drugModal')) app.closeModal();
    if (event.target == document.getElementById('detailModal')) document.getElementById('detailModal').classList.add('hidden');
}