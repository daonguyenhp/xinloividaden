class User {
    constructor() {
        this.apiUrl = "https://teenshop.vn/api/"; // Cập nhật base URL của TeenShop
    }

    // Đăng nhập
    doLogin(username, password) {
        localStorage.clear(); // Xóa thông tin cũ trong localStorage

        // Kiểm tra tài khoản và mật khẩu mẫu
        if (username === "0123456789" && password === "123456") {
            // Nếu thông tin đăng nhập đúng, lưu thông tin người dùng và token vào localStorage
            let user = {
                name: "Xin loi vi da den",
                phone: "0123456789",
                email: "Xinloividaden@iceam.com",
                address: "Viet Nam",
                city: "Ho Chi Minh City",
                zip: "30-4"
            };

            // Tạo giả lập một token (hoặc lấy từ API nếu có)
            let token = "sample-access-token";

            // Lưu thông tin người dùng và access_token vào localStorage
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("access_token", token);

            // Chuyển hướng đến trang tài khoản
            window.location.href = "/account.html";
        } else {
            $(".loginMsg").html('<div class="alert alert-danger" role="alert">Incorrect username or password. Please try again.</div>');
        }
    }
}
