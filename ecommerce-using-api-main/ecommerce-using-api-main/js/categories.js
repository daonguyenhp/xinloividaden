class Categories {
	constructor() {
	  this.apiUrl = "https://teenshop.vn/api/categories"; // URL API cần được kiểm tra
	}
  
	getAllCategories() {
	  // Dữ liệu tĩnh thay thế cho API khi có lỗi
	  const staticCategories = [
		{ name: "Thời trang", slug: "thoi-trang" },
		{ name: "Điện thoại", slug: "dien-thoai" },
		{ name: "Laptop", slug: "laptop" }
	  ];
  
	  $(".categories").empty(); // Xóa các danh mục cũ
	  staticCategories.forEach(function (category) {
		$(".categories").append(
		  `<a class="dropdown-item" href="/category.html?category=${encodeURIComponent(category.slug)}">${category.name}</a>`
		);
	  });
	}
  
	getSingleCategory(categorySlug) {
	  // Giả sử lấy sản phẩm theo danh mục
	  console.log("Fetching products for category: " + categorySlug);
	  // Giả lập fetch sản phẩm theo danh mục
	  // Lấy sản phẩm theo slug categorySlug
	  this.getProductsByCategory(categorySlug);
	}
  
	getProductsByCategory(categorySlug) {
	  // Giả lập sản phẩm theo danh mục (dữ liệu tĩnh)
	  const products = [
		{
		  name: "Đầm Đen Cổ Yếm",
		  price: 100000,
		  thumbnail: "products/CJ9kn8B41nguMZnV3EDXjPTIcjHr1TjvyjStZWjQ.jpg",
		  category: categorySlug
		},
		{
		  name: "Áo Voan Hồng Loang Nhún Bí Kèm Nơ",
		  price: 120000,
		  thumbnail: "products/J3dkYZrzLBkDr8YNrWVOdNPc6BkyOUcT7pgtUEFn.jpg",
		  category: categorySlug
		}
	  ];
  
	  $(".products.new").empty(); // Xóa sản phẩm cũ
	  products.forEach(function (product) {
		$(".products.new").append(`
		  <div class="col-md-3">
			<div class="product">
			  <a href="/product.html?productid=${product.name}">
				<div class="image">
				  <img src="https://api.teenshop.vn/media/products/${product.thumbnail}" class="img-fluid" alt="${product.name}">
				</div>
				<div class="info">
				  <div class="title">${product.name}</div>
				  <div class="price">${product.price} VND</div>
				</div>
			  </a>
			</div>
		  </div>
		`);
	  });
	}
  }
  