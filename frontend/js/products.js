// IIFE: chạy ngay lập tức khi file load, tránh xung đột biến toàn cục
(function() {
    // Nếu Products đã được định nghĩa, không redeclare
    if (window.Products) return;
  
    class Products {
      /**
       * Constructor: thiết lập base API và proxy URL
       */
      constructor() {
        // Endpoint gốc để fetch products
        this.apiBase = "https://teenshop.vn/api/products";
        // Proxy để bypass CORS
        this.proxy = "https://api.allorigins.win/raw?url=";
      }
  
      /**
       * Fetch và render danh sách sản phẩm mới
       * @param {number} limit Số lượng sản phẩm cần lấy
       */
      async getNewProducts(limit = 8) {
        try {
          // Tạo URL đầy đủ với query params
          const target = `${this.apiBase}?page=1&limit=${limit}`;
          // Fetch qua proxy để tránh CORS
          const res = await fetch(this.proxy + encodeURIComponent(target));
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
  
          // Đọc response dưới dạng text vì AllOrigins trả raw
          const txt = await res.text();
          // Parse sang JSON
          const parsed = JSON.parse(txt);
  
          // Dữ liệu có thể là mảng hoặc object chứa trường data
          const list = Array.isArray(parsed) ? parsed : (parsed.data || []);
          const container = document.querySelector('.products.new');
          // Xóa nội dung cũ
          container.innerHTML = '';
  
          if (list.length > 0) {
            // Render từng product
            // Giải thích từng phần của snippet:
            // <div class="col-lg-3">: xác định cột chiếm 3/12 grid trên màn hình lớn.
            // <div class="product">: wrapper cho thẻ sản phẩm.
            // <a href="...">: làm cả card thành link tới trang chi tiết.
            // <div class="image"> chứa <img>: hiển thị ảnh thumbnail, class="img-fluid" để responsive, alt để accessibility.
            // <div class="info"> wrapper cho text info:
            //   <div class="title">: tên sản phẩm.
            //   <div class="price">: giá format VND.
            //   <div class="category">: tên danh mục hoặc fallback 'Không rõ'.
            list.forEach(p => {
              const html = `
                <div class="col-lg-3">
                  <div class="product">
                    <a href="/product.html?productid=${p.id}">
                      <div class="image">
                        <img src="https://api.teenshop.vn/media/${p.thumbnail}" 
                             class="img-fluid" alt="${p.name}">
                      </div>
                      <div class="info">
                        <div class="title">${p.name}</div>
                        <div class="price">${p.price.toLocaleString('vi-VN')} VND</div>
                        <div class="category">${p.category?.name || 'Không rõ'}</div>
                      </div>
                    </a>
                  </div>
                </div>`;
              // Chèn HTML vào DOM
              container.insertAdjacentHTML('beforeend', html);
            });
          } else {
            // Trường hợp không có sản phẩm
            container.innerHTML = '<p class="text-warning">Không có sản phẩm mới.</p>';
          }
        } catch (e) {
          // Bắt và hiển thị lỗi
          console.error('Fetch products error:', e);
          document.querySelector('.products.new').innerHTML = '<p class="text-danger">Không thể tải sản phẩm. Vui lòng kiểm tra proxy.</p>';
        }
      }
    }
  
    // Đăng ký Products thành global để init.js có thể dùng
    window.Products = Products;
  })();
  