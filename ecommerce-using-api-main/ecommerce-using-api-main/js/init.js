$(function () {
    // Kiểm tra xem người dùng đã đăng nhập chưa, nếu chưa thì chuyển hướng đến trang đăng nhập
    if (localStorage.getItem("user") == null && $(".auth").length) {
        window.location.href = "/login.html"; // Redirect if not logged in
    }
    // Tải các script cần thiết
    loadScript("js/categories.js", categoriesSetup);
    loadScript("js/products.js", productsSetup);
    loadScript("js/user.js", userInfo);
    loadScript("js/cart.js", cartInfo);
});

$.get("/templates/navigation.html", function (data) {
    if ($(".logout").length) {
        localStorage.clear();
    }
    $("#nav-placeholder").replaceWith(data);

    // Kiểm tra nếu người dùng đã đăng nhập và hiển thị thông tin tài khoản
    if (localStorage.getItem("user") === null) {
        $(".accountNav").html(
            '<li class="nav-item"><a class="nav-link text-white" href="/login.html">Login</a> </li>'
        );
    } else {
        $(".accountNav").html(
            '<li class="nav-item"><a class="nav-link text-white" href="/account.html">Account</a></li><li class="nav-item"><a class="nav-link text-white" href="/logout.html">Log Out</a></li>'
        );
    }
});

$.get("/templates/footer.html", function (data) {
    $("#footer-placeholder").replaceWith(data);
});
