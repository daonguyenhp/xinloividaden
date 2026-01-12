class User {
    constructor() {
      // Không cần API nữa
    }
  
    // Đăng nhập
    doLogin(username, password) {
      localStorage.clear();
  
      // 1. Mảng dữ liệu user mẫu
      const users = [
        {
          phone: "0123456789",
          password: "123456",
          info: {
            name: "Teenshop.vn",
            phone: "0123456789",
            email: "teenshop2025@gmail.com",
            address: "Viet Nam",
            city: "Ho Chi Minh City",
            zip: "30-4"
          },
          token: "sample-access-token"
        },

        {
          phone: "ICEAM",
          password: "xinloividaden",
          info: {
            name: "Xin loi vi da den",
            phone: "0123456789",
            email: "Xinloividaden@iceam.com",
            address: "Viet Nam",
            city: "Ho Chi Minh City",
            zip: "30-4"
          },
          token: "sample-access-token-2"
        }
        // Sau này bạn có thể push thêm user khác vào đây
      ];
  
      // 2. Tìm user cho khớp username/password
      const u = users.find(u => u.phone === username && u.password === password);
      if (!u) {
        $(".loginMsg").html(`
            <div class="alert alert-danger" role="alert">
            Wrong username or password
            </div>
        `);
        // Sau 3 giây thì xoá hẳn nội dung để lần bấm tiếp nó sẽ hiển thị lại bình thường
        setTimeout(() => {
            $(".loginMsg").fadeOut("fast", function() {
            $(this).html("").show(); // xoá nội dung và reset lại container
            });
        }, 3000);
  
        return;
      }
  
      // 3. Lưu thông tin và redirect
      localStorage.setItem("user", JSON.stringify(u.info));
      localStorage.setItem("access_token", u.token);
      window.location.href = "/account.html";
    }
  }
  
  // Đảm bảo User class được load trước script này
  $(document).ready(function () {
    $("#loginForm").on("submit", function (e) {
      e.preventDefault();
      const username = $("#username").val().trim();
      const password = $("#password").val();
      new User().doLogin(username, password);
    });
  });
  