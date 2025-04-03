const users = [
    { id: 1, username: "user1", password: "password123" },
    { id: 2, username: "user2", password: "password456" }
];

// Kiểm tra nếu Local Storage chưa có danh sách user thì lưu vào
if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(users));
}

document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Ngăn chặn gửi form mặc định

    // Lấy giá trị từ input
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document.getElementById("confirmPassword").value.trim();

    // Kiểm tra email

    document.getElementById("email").addEventListener("focus", function () {
        document.getElementById("emailError").style.display = "none";
    });

    let emailError = document.getElementById("emailError");

    if (email === "") {
        emailError.textContent = "Email không được để trống";
        emailError.style.display = "block"; // Hiển thị lỗi
        return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
        emailError.textContent ="Email phải đúng định dạng";
        emailError.style.display = "block";
        return;
    }

    // Kiểm tra mật khẩu
    if (password === "") {
        emailError.textContent = "Mật khẩu không được để trống";
        emailError.style.display = "block";
        return;
    }
    if (password.length < 6) {
        emailError.textContent = "Mật khẩu tối thiểu phải 6 kí tự trở lên";
        emailError.style.display = "block";
        return;
    }

    // Kiểm tra xác nhận mật khẩu
    if (confirmPassword === "") {
       emailError.textContent ="Mật khẩu xác nhận không được để trống";
       emailError.style.display = "block";
        return;
    }
    if (confirmPassword !== password) {
        emailError.textContent = "Mật khẩu xác nhận chưa trùng khớp";
        emailError.style.display = "block";
        return;
    }

    // Lấy danh sách người dùng hiện có từ Local Storage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Kiểm tra xem email đã tồn tại chưa
    let existingUser = users.find(user => user.username === email);
    if (existingUser) {
        emailError.textContent = "Email đã tồn tại";
        emailError.style.display = "block";
        return;
    }

    let newUser = {
        id: Math.ceil(Math.random() *10000),
        username: email,
        password: password
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Đăng ký thành công!");
    window.location.href = "login.html"; 
});
