if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]));
}

document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document.getElementById("confirmPassword").value.trim();

    // Xóa thông báo lỗi cũ khi người dùng nhập lại
    document.getElementById("email").addEventListener("focus", function () {
        document.getElementById("emailError").style.display = "none";
    });
    document.getElementById("password").addEventListener("focus", function () {
        document.getElementById("passwordError").style.display = "none";
    });
    document.getElementById("confirmPassword").addEventListener("focus", function () {
        document.getElementById("confirmPasswordError").style.display = "none";
    });

    let emailError = document.getElementById("emailError");
    let passwordError = document.getElementById("passwordError");
    let confirmPasswordError = document.getElementById("confirmPasswordError");

    // Kiểm tra email có đuôi @gmail.com
    if (email === "") {
        emailError.textContent = "Email không được để trống";
        emailError.style.display = "block";
        return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
        emailError.textContent = "Email phải có đuôi @gmail.com (VD: example@gmail.com)";
        emailError.style.display = "block";
        return;
    }

    // Kiểm tra mật khẩu
    if (password === "") {
        passwordError.textContent = "Mật khẩu không được để trống";
        passwordError.style.display = "block";
        return;
    }
    if (password.length < 6) {
        passwordError.textContent = "Mật khẩu phải có ít nhất 6 ký tự";
        passwordError.style.display = "block";
        return;
    }

    // Kiểm tra xác nhận mật khẩu
    if (confirmPassword === "") {
        confirmPasswordError.textContent = "Mật khẩu xác nhận không được để trống";
        confirmPasswordError.style.display = "block";
        return;
    }
    if (confirmPassword !== password) {
        confirmPasswordError.textContent = "Mật khẩu xác nhận không khớp";
        confirmPasswordError.style.display = "block";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Kiểm tra xem email đã tồn tại chưa
    let existingUser = users.find(user => user.username === email);
    if (existingUser) {
        emailError.textContent = "Email đã được sử dụng";
        emailError.style.display = "block";
        return;
    }

    let newUser = {
        id: Date.now(),
        username: email,
        password: btoa(password) // Mã hóa mật khẩu
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    Swal.fire({
        title: "Đăng ký tài khoản thành công",
        icon: "success",
        draggable: true
      });
    window.location.href = "login.html";
});
