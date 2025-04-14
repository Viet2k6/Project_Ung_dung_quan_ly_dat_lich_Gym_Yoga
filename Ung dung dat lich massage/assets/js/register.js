document.addEventListener("DOMContentLoaded", function () {
    var hoTen = document.getElementById("hoTen");
    var email = document.getElementById("email");
    var matKhau = document.getElementById("matKhau");
    var xacNhanMatKhau = document.getElementById("xacNhanMatKhau");
    var btnDangKy = document.getElementById("btnDangKy");

    function showError(input, message) {
        var errorText = input.nextElementSibling;
        errorText.textContent = message;
        input.classList.add("error");
    }

    function clearError(input) {
        var errorText = input.nextElementSibling;
        errorText.textContent = "";
        input.classList.remove("error");
    }

    function isValidEmail(email) {
        return email.includes("@") && email.includes(".");
    }

    function validateForm() {
        var isValid = true;

        if (hoTen.value.trim() === "") {
            showError(hoTen, "Vui lòng nhập họ và tên.");
            isValid = false;
        } else {
            clearError(hoTen);
        }

        if (email.value.trim() === "") {
            showError(email, "Email không được để trống.");
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, "Email không hợp lệ.");
            isValid = false;
        } else {
            clearError(email);
        }

        if (matKhau.value.trim() === "") {
            showError(matKhau, "Mật khẩu không được để trống.");
            isValid = false;
        } else if (matKhau.value.length < 8) {
            showError(matKhau, "Mật khẩu phải có ít nhất 8 ký tự.");
            isValid = false;
        } else {
            clearError(matKhau);
        }

        if (xacNhanMatKhau.value.trim() === "") {
            showError(xacNhanMatKhau, "Vui lòng nhập lại mật khẩu.");
            isValid = false;
        } else if (xacNhanMatKhau.value !== matKhau.value) {
            showError(xacNhanMatKhau, "Mật khẩu không khớp.");
            isValid = false;
        } else {
            clearError(xacNhanMatKhau);
        }

        btnDangKy.disabled = !isValid;
    }

    hoTen.addEventListener("input", validateForm);
    email.addEventListener("input", validateForm);
    matKhau.addEventListener("input", validateForm);
    xacNhanMatKhau.addEventListener("input", validateForm);

    btnDangKy.addEventListener("click", function () {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        if (users.some(user => user.email === email.value.trim())) {
            showError(email, "Email đã được đăng ký!");
            return;
        }

        var userData = {
            hoTen: hoTen.value.trim(),
            email: email.value.trim(),
            matKhau: matKhau.value.trim(),
            isAdmin: false 
        };
        if (users.length === 0) {
            users.push({
                hoTen: "Admin",
                email: "trandangviet00@gmail.com",
                matKhau: "01102006",
                isAdmin: true
            });
        }
        users.push(userData);
        localStorage.setItem("users", JSON.stringify(users));
        alert("Đăng ký thành công!");
        window.location.href = "../../pages/auth/login.html";
    });
});