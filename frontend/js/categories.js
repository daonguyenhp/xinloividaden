// Class Categories chịu trách nhiệm lấy và render dropdown danh mục
(function() {
	if (window.Categories) return;  // Nếu đã load rồi thì thôi
  
	class Categories {
	  constructor() {
		// URL gốc của endpoint categories
		this.apiUrl = 'https://teenshop.vn/api/categories';
		// Proxy để bypass CORS (AllOrigins)
		this.proxy = 'https://api.allorigins.win/raw?url=';
	  }
  
	  /**
	   * Lấy danh sách categories và render vào <div class="categories">
	   */
	  async getAllCategories() {
		const container = document.querySelector('.categories');
		container.innerHTML = '';  // Clear trước khi render
  
		try {
		  // Gọi fetch qua proxy
		  const response = await fetch(this.proxy + encodeURIComponent(this.apiUrl));
		  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  
		  // AllOrigins trả raw text, nên đọc text rồi JSON.parse
		  const text = await response.text();
		  const data = JSON.parse(text);
		  // Data có thể là array hoặc object { data: [...] }
		  const list = Array.isArray(data) ? data : (data.data || []);
  
		  // Render từng category
		  list.forEach(cat => {
			const a = document.createElement('a');
			a.className = 'dropdown-item';
			a.href = `/category.html?category=${encodeURIComponent(cat.slug)}`;
			a.textContent = cat.name;
			container.appendChild(a);
		  });
  
		  // Nếu không có category nào
		  if (list.length === 0) {
			container.innerHTML = '<p class="text-warning">Chưa có danh mục.</p>';
		  }
  
		} catch (err) {
		  console.error('Error loading categories:', err);
		  container.innerHTML = '<p class="text-danger">Không thể tải danh mục. Vui lòng kiểm tra proxy.</p>';
		}
	  }
	}
  
	window.Categories = Categories;
  })();
  