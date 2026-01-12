class Cart {
	constructor() {
		this.apiUrl = "https://teenshop.vn/api/"; // Cập nhật base URL của API TeenShop
	}

	// Lấy thông tin giỏ hàng của người dùng
	getCart(userID) {
		var i = 0;
		var apiUrl = this.apiUrl;
		var count = 0;
		var carts = [];
		$.ajax({
			type: "GET",
			url: apiUrl + "cart", // Endpoint cho giỏ hàng của người dùng
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_token") // Thêm Authorization Bearer token
			},
			success: function (data) {
				// Duyệt qua các sản phẩm trong giỏ hàng
				$(data).each(function (index, cart) {
					count += cart.products.length;
					$(cart.products).each(function (index, productData) {
						var singleProduct = {};
						// Lấy thông tin sản phẩm từ API TeenShop
						$.ajax({
							type: "GET",
							url: apiUrl + "shop/products/" + productData.product_id, // Endpoint chi tiết sản phẩm
							headers: {
								"Authorization": "Bearer " + localStorage.getItem("access_token") // Thêm Authorization Bearer token
							},
							success: function (product) {
								singleProduct["productId"] = product.id;
								singleProduct["productURL"] =
									"/product.html?productid=" + product.id;
								singleProduct["title"] = product.name; // Sử dụng `name` cho sản phẩm
								singleProduct["price"] = product.price;
								singleProduct["image"] = product.thumbnail; // Sử dụng `thumbnail` cho hình ảnh
								carts.push(singleProduct);
								localStorage.setItem("cart", JSON.stringify(carts));
							},
						});
					});
				});
				// Cập nhật số lượng sản phẩm trong giỏ
				localStorage.setItem("cartCount", count);
				$("span.cartCount.badge").html(count);
			},
			error: function (xhr, status, error) {
				console.log("Error fetching cart data:", error);
			}
		});
	}

	// Lấy thông tin sản phẩm đơn lẻ trong giỏ hàng
	getSingleProductCart(id) {
		$.ajax({
			type: "GET",
			url: this.apiUrl + "shop/products/" + id, // Endpoint lấy sản phẩm từ TeenShop
			headers: {
				"Authorization": "Bearer " + localStorage.getItem("access_token") // Thêm Authorization Bearer token
			},
			success: function (data) {
				console.log(data); // Đưa ra thông tin sản phẩm chi tiết
			},
			error: function (xhr, status, error) {
				console.log("Error fetching single product:", error);
			}
		});
	}

	// Hiển thị giỏ hàng trên giao diện
	getCartDisplay(products) {
		var price = 0;
		$(products).each(function (index, product) {
			price += product.price;
			$(".cartDisplay").prepend(
				'<li class="list-group-item d-flex justify-content-between lh-sm"><img src="' +
					product.image +
					'" class="img-thumbnail" style="max-width:50px;"><div><h6>' +
					product.title +
					'</h6></div> <span class="text-muted">$' +
					product.price.toFixed(2) +
					"</span> </li>"
			);
		});
		$(".price").html(price); // Hiển thị tổng giá
	}
}
