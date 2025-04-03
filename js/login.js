document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let loginEmail = document.getElementById("loginEmail").value.trim();
    let loginPassword = document.getElementById("loginPassword").value.trim();
    let loginError = document.getElementById("loginError");

    document.getElementById("loginEmail").addEventListener("focus",function () {
        document.getElementById("loginError").style.display = "none";
    })
    document.getElementById("loginPassword").addEventListener("focus",function () {
        document.getElementById("loginError").style.display = "none";
    })

    if (!loginEmail || !loginPassword) {
        loginError.textContent = "Vui lòng nhập đầy đủ thông tin!";
        loginError.style.display = "block";
        return;
    }

    // Lấy danh sách user từ Local Storage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Kiểm tra xem username và password có khớp không
    let user = users.find(u => u.username === loginEmail && u.password === loginPassword);

    if (!user) {
        loginError.textContent = "Sai tài khoản hoặc mật khẩu!";
        loginError.style.display = "block";
        return;
    }

    // Lưu trạng thái đăng nhập
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(user));

    alert("Đăng nhập thành công!");
    window.location.href = "../index.html";
});
