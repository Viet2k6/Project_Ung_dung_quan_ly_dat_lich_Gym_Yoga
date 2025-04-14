document.addEventListener("DOMContentLoaded", function () {
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    var btnDangNhap = document.querySelector("button[type='submit']");
  
    function showError(input, message) {
        var parent = input.parentNode;
        var errorText = parent.querySelector(".error-text");
  
        if (!errorText) {
            errorText = document.createElement("p");
            errorText.className = "error-text";
            parent.appendChild(errorText);
        }
  
        errorText.textContent = message;
        input.classList.add("error");
    }
  
    function clearError(input) {
        var parent = input.parentNode;
        var errorText = parent.querySelector(".error-text");
  
        if (errorText) {
            errorText.remove();
        }
  
        input.classList.remove("error");
    }
  
    function isValidEmail(email) {
        return email.includes("@") && email.includes(".");
    }
  
    function validateForm() {
        var isValid = true;
  
        if (email.value.trim() === "") {
            showError(email, "Email không được để trống.");
            isValid = false;
        } else if (!isValidEmail(email.value.trim())) {
            showError(email, "Email không hợp lệ.");
            isValid = false;
        } else {
            clearError(email);
        }
  
        if (password.value.trim() === "") {
            showError(password, "Mật khẩu không được để trống.");
            isValid = false;
        } else {
            clearError(password);
        }
  
        return isValid;
    }
  
    email.addEventListener("input", validateForm);
    password.addEventListener("input", validateForm);
  
    btnDangNhap.addEventListener("click", function (event) {
        event.preventDefault();
  
        if (!validateForm()) return;
        let users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.email === email.value.trim());
  
        if (!user) {
            showError(email, "Email không tồn tại.");
            return;
        }
  
        if (user.matKhau !== password.value.trim()) {
            showError(password, "Mật khẩu không đúng.");
            return;
        }
  
        localStorage.setItem("currentUser", JSON.stringify(user));
  
        alert("Đăng nhập thành công!");
  
        if (user.isAdmin) {
            window.location.href = "../../pages/admin/dashboard.html"; 
        } else {
            window.location.href = "../../index.html"; 
        }
    });
  });