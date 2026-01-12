// ----- js/init.js -----
/* $(function() { ... }); là shorthand của jQuery để chạy callback khi DOM đã load 
 — đảm bảo tất cả phần tử đã sẵn sàng trước khi tương tác.*/
$(function() {
    // 1. Auth redirect
    // Redirect to login page if not authenticated and on auth pages
    if (!localStorage.getItem("user") && $(".auth").length) {
      window.location.href = "/login.html"; // Redirect to login
      return;
    }

    
    // 2. Load categories via Fetch API + CORS proxy
    /*Sử dụng IIFE async để cho phép dùng await bên trong ngay trong hàm khởi tạo 
    — fetch danh mục qua proxy CORS.*/
    (async function() {
      try {
        const apiUrl = "https://teenshop.vn/api/categories"; //Biến apiUrl chứa endpoint gốc categories.

        // Tạo URL tới dịch vụ AllOrigins (hoặc bất kỳ CORS proxy nào) để bypass chính sách CORS của API.
        const proxyUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(apiUrl);

        // Gửi request GET đến proxyUrl — trả về response chứa body JSON gốc của API.
        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        // Phân tích JSON response thành object.
        const json = await res.json();

        // Nếu API trả 1 mảng thẳng, dùng mảng đó; nếu trả wrapper { data: [] }, lôi data ra.
        const categories = Array.isArray(json) ? json : (json.data || []);

        // Lấy thẻ chứa dropdown categories trong navigation template. Xóa nội dung cũ trước khi append các mục mới
        const container = document.querySelector('.categories');

        // Kiểm tra nếu phần tử tồn tại
        if (!container) {
          console.error('Element with class .categories not found');
          return;
        }
        container.innerHTML = '';

        // Duyệt từng cat và tạo thẻ <a> tương ứng, set href và text, sau đó append vào container.
        categories.forEach(cat => {
          const a = document.createElement('a');
          a.className = 'dropdown-item';
          a.href = `/category.html?category=${encodeURIComponent(cat.slug)}`;
          a.textContent = cat.name;
          container.appendChild(a);
        });
      } catch (err) {
        console.error('Error loading categories:', err);
        document.querySelector('.categories').innerHTML = '<p class="text-danger">Không thể tải danh mục. Vui lòng kiểm tra proxy.</p>';
      }
    })();
  
    // 3. Initialize Products loader (Kiểm tra xem class Products đã được định nghĩa chưa)
    if (typeof Products === 'function') {
      new Products().getNewProducts(8);
    }
  
    // 4. Load navigation template and account links
    // Dùng jQuery AJAX load template navigation từ server-side và inject vào #nav-placeholder.
    $.get("/templates/navigation.html", function(data) {

    // Nếu page có class .logout, nghĩa là user vừa logout, clear toàn bộ localStorage.
      if ($(".logout").length) localStorage.clear();
      $("#nav-placeholder").replaceWith(data);

      // Lấy thông tin user từ localStorage, nếu không tồn tại, parse thành null.
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const nav = $(".accountNav");

      // Thay nội dung HTML của nav tùy theo trạng thái user (có hay không).
      if (user) {
        nav.html(
          `<li class=\"nav-item\"><a class=\"nav-link text-white\" href=\"/account.html\">Hello, ${user.name}</a></li>` +
          `<li class=\"nav-item\"><a class=\"nav-link text-white\" href=\"/logout.html\">Log Out</a></li>`
        );
      } else {
        nav.html(
          `<li class=\"nav-item\"><a class=\"nav-link text-white\" href=\"/login.html\">Login</a></li>` +
          `<li class=\"nav-item\"><a class=\"nav-link text-white\" href=\"/signup.html\">Sign Up</a></li>`
        );
      }
    });
  
    // 5. Load footer template (Load footer template và inject vào #footer-placeholder.)
    $.get("/templates/footer.html", html => $("#footer-placeholder").replaceWith(html));
  });
  

  