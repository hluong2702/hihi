// Đăng xuất
const accountOptions = document.getElementById("accountOptions");
    accountOptions.addEventListener("change", function () {
        if (accountOptions.value === "logout") {
            let confirmLogOut = confirm("Bạn chắc chắn muốn đăng xuất chứ?");
            if (confirmLogOut) {
                alert("Đăng xuất thành công");
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("currentUser");
                window.location.href = "../pages/login.html";
            }
        }
    });

// Tháng chi tiêu
    