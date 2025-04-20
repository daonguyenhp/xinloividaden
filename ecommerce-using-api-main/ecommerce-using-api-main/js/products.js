class Products {
    constructor() {
        this.apiUrl = "https://teenshop.vn/api/"; // Cập nhật API URL nếu cần
    }

    // Fetch and display new products
    getNewProducts(limit) {
        $.ajax({
            type: "GET",
            url: `${this.apiUrl}products?page=1&limit=${limit}`,
            success: function (response) {
                console.log(response); // Kiểm tra dữ liệu trả về
                if (response.data && response.data.length > 0) {
                    // Clear existing products before appending new ones
                    $(".products.new").empty();

                    // Loop through the products and append them to the DOM
                    response.data.forEach(function (product) {
                        $(".products.new").append(`
                            <div class="col-md-3">
                                <div class="product">
                                    <a href="/product.html?productid=${product.id}">
                                        <div class="image">
                                            <!-- Update the image URL to match the required format -->
                                            <img src="https://api.teenshop.vn/media/products/${product.thumbnail}" class="img-fluid" alt="${product.name}">
                                        </div>
                                        <div class="info">
                                            <div class="title">${product.name}</div>
                                            <div class="price">${product.price} VND</div>
                                            <div class="category">${product.category.name}</div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        `);
                    });
                    
                } else {
                    $(".products.new").html('<div class="alert alert-warning">No new products available at the moment.</div>');
                }
            },
            error: function (xhr, status, error) {
                console.log("Error fetching products:", error);
                $(".products.new").html('<div class="alert alert-danger">Error fetching products. Please try again later.</div>');
            }
        });
    }
}
