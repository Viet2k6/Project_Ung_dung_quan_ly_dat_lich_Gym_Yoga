const initialScheduleData = [
    { className: "Gym", date: "2025-04-01", time: "11:00", name: "Nguyễn Văn Nam", email: "vannam007@gmail.com" },
    { className: "Yoga", date: "2025-04-23", time: "19:57", name: "Trần Thị Lan", email: "lantran2k3@gmail.com" },
];

if (!localStorage.getItem("scheduleList")) {
    localStorage.setItem("scheduleList", JSON.stringify(initialScheduleData));
}

function showSection(sectionId) {
    try {
        const scheduleSection = document.getElementById("schedule-section");
        const serviceSection = document.getElementById("service-section");

        if (!scheduleSection || !serviceSection) {
            throw new Error("One or more sections not found in the DOM.");
        }

        scheduleSection.classList.add("hidden");
        serviceSection.classList.add("hidden");

        const targetSection = document.getElementById(`${sectionId}-section`);
        if (!targetSection) {
            throw new Error(`Section with ID ${sectionId}-section not found.`);
        }
        targetSection.classList.remove("hidden");
    } catch (error) {
        console.error("Error in showSection:", error);
        // Optionally show an error message to the user
        const messageModal = document.getElementById("messageModal");
        const messageText = document.getElementById("messageText");
        if (messageModal && messageText) {
            messageModal.style.display = "block";
            messageText.textContent = "Lỗi khi chuyển section: " + error.message;
        }
    }
}

function updateStatistics() {
    const scheduleList = JSON.parse(localStorage.getItem("scheduleList")) || [];
    const gymCount = scheduleList.filter(item => item.className === "Gym").length;
    const yogaCount = scheduleList.filter(item => item.className === "Yoga").length;
    const zumbaCount = scheduleList.filter(item => item.className === "Zumba").length;

    document.querySelector(".card-gym span").textContent = gymCount;
    document.querySelector(".card-yoga span").textContent = yogaCount;
    document.querySelector(".card-zumba span").textContent = zumbaCount;
}

function fetchScheduleList(filterClass = "Tất cả", searchEmail = "", filterDate = "") {
    const scheduleList = JSON.parse(localStorage.getItem("scheduleList")) || [];
    const table = document.querySelector("#schedule-section table");

    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    const filteredList = scheduleList.filter(schedule => {
        const classMatch = filterClass === "Tất cả" || schedule.className === filterClass;
        const emailMatch = schedule.email.toLowerCase().includes(searchEmail.toLowerCase());
        const dateMatch = !filterDate || schedule.date === filterDate;
        return classMatch && emailMatch && dateMatch;
    });

    filteredList.forEach((schedule, index) => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${schedule.className}</td>
            <td>${schedule.date}</td>
            <td>${schedule.time}</td>
            <td>${schedule.name}</td>
            <td>${schedule.email}</td>
            <td>
                <button class="edit-btn" onclick="editSchedule(${index})">Sửa</button>
                <button class="delete-btn" onclick="deleteSchedule(${index})">Xóa</button>
            </td>
        `;
    });

    updateStatistics();
}

function setupFilters() {
    const filterSelect = document.querySelector(".filter-container select");
    const searchInput = document.querySelector(".filter-container input[type='text']");
    const dateInput = document.querySelector(".filter-container input[type='date']");

    filterSelect.addEventListener("change", () => {
        fetchScheduleList(filterSelect.value, searchInput.value, dateInput.value);
    });

    searchInput.addEventListener("input", () => {
        fetchScheduleList(filterSelect.value, searchInput.value, dateInput.value);
    });

    dateInput.addEventListener("change", () => {
        fetchScheduleList(filterSelect.value, searchInput.value, dateInput.value);
    });
}

function validateSchedule(schedule, scheduleList, currentIndex = null) {
    const { className, date, time, name, email } = schedule;
    if (!className || !date || !time || !name || !email) {
        alert("Vui lòng không để trống bất kỳ trường nào.");
        return false;
    }

    const emailParts = email.split("@");
    if (emailParts.length !== 2 || emailParts[0] === "" || emailParts[1] === "" || !emailParts[1].includes(".")) {
        alert("Email không hợp lệ. Vui lòng nhập đúng định dạng email (ví dụ: example@domain.com).");
        return false;
    }

    const duplicate = scheduleList.some((item, index) =>
        index !== currentIndex &&
        item.email === email &&
        item.date === date &&
        item.time === time
    );

    if (duplicate) {
        alert("Người dùng này đã có lịch tập vào khung giờ này trong ngày.");
        return false;
    }

    return true;
}

function editSchedule(index) {
    const scheduleList = JSON.parse(localStorage.getItem("scheduleList")) || [];
    const schedule = scheduleList[index];
    document.querySelector("#modal select").value = schedule.className;
    document.querySelector("#modal input[type='date']").value = schedule.date;
    document.querySelector("#modal input[type='time']").value = schedule.time;
    document.querySelector("#modal input[type='text']").value = schedule.name;
    document.querySelector("#modal input[type='email']").value = schedule.email;

    document.getElementById("modal").style.display = "block";

    document.querySelector("#modal form").onsubmit = function(event) {
        event.preventDefault();

        schedule.className = document.querySelector("#modal select").value;
        schedule.date = document.querySelector("#modal input[type='date']").value;
        schedule.time = document.querySelector("#modal input[type='time']").value;
        schedule.name = document.querySelector("#modal input[type='text']").value;
        schedule.email = document.querySelector("#modal input[type='email']").value;

        if (validateSchedule(schedule, scheduleList, index)) {
            scheduleList[index] = schedule;
            localStorage.setItem("scheduleList", JSON.stringify(scheduleList));
            fetchScheduleList();
            document.getElementById("modal").style.display = "none";
            showEditedModal(); 
        }
    };
}

let deleteIndex = null;

function deleteSchedule(index) {
    deleteIndex = index;
    document.getElementById("deleteModal").style.display = "block";
}

function closeDeleteModal() {
    document.getElementById("deleteModal").style.display = "none";
    deleteIndex = null;
}

function showSuccessModal() {
    document.getElementById("successModal").style.display = "block";
}

function closeSuccessModal() {
    document.getElementById("successModal").style.display = "none";
}

function showEditedModal() {
    document.getElementById("editedModal").style.display = "block";
}

function closeEditedModal() {
    document.getElementById("editedModal").style.display = "none";
}

// Service Management Functions
function getServices() {
    try {
        let services = JSON.parse(localStorage.getItem("services"));
        if (!services || services.length === 0) {
            services = [
                { name: "Gym", description: "Tập luyện thể hình", image: "https://mms.img.susercontent.com/vn-11134210-7r98o-lxdrc7kctsrd25" },
                { name: "Yoga", description: "Thư giãn và linh hoạt", image: "https://static.vecteezy.com/system/resources/thumbnails/023/221/657/small_2x/yoga-day-banner-design-file-vector.jpg" },
                { name: "Zumba", description: "Nhảy múa vui vẻ", image: "https://img.freepik.com/free-psd/zumba-lifestyle-banner-template_23-2149193901.jpg" },
            ];
            saveServices(services);
        }
        return services;
    } catch (error) {
        showMessage("Lỗi khi lấy dữ liệu dịch vụ!");
        return [];
    }
}

function saveServices(services) {
    try {
        localStorage.setItem("services", JSON.stringify(services));
    } catch (error) {
        showMessage("Lỗi khi lưu dữ liệu dịch vụ!");
    }
}

function renderServiceList() {
    try {
        const services = getServices();
        const table = document.querySelector("#service-section table");
        const tbody = table.querySelector("tbody");
        tbody.innerHTML = "";

        services.forEach((service, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${service.name}</td>
                <td>${service.description}</td>
                <td><img src="${service.image}" class="service-image" alt="${service.name}"></td>
                <td>
                    <button class="edit-btn" data-index="${index}">Sửa</button>
                    <button class="delete-btn" data-index="${index}">Xóa</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        showMessage("Lỗi khi hiển thị danh sách dịch vụ!");
    }
}

function openServiceModal() {
    try {
        const serviceModal = document.getElementById("serviceModal");
        const serviceModalTitle = document.getElementById("serviceModalTitle");
        const serviceName = document.getElementById("serviceName");
        const serviceDescription = document.getElementById("serviceDescription");
        const serviceImage = document.getElementById("serviceImage");
        const previewImg = document.getElementById("previewImg");

        serviceModal.style.display = "block";
        serviceModalTitle.textContent = "Thêm dịch vụ";
        serviceName.value = "";
        serviceDescription.value = "";
        serviceImage.value = "";
        previewImg.style.display = "none";
        window.editServiceIndex = null; // Use a global variable to track the edit index
    } catch (error) {
        showMessage("Lỗi khi mở modal dịch vụ!");
    }
}

function showMessage(message) {
    const messageModal = document.getElementById("messageModal");
    const messageText = document.getElementById("messageText");
    messageModal.style.display = "block";
    messageText.textContent = message;
}

function showConfirm(message, onYes) {
    try {
        const confirmModal = document.getElementById("confirmModal");
        const confirmText = document.getElementById("confirmText");
        const confirmYes = document.getElementById("confirmYes");

        confirmModal.style.display = "block";
        confirmText.textContent = message;
        confirmYes.onclick = function () {
            onYes();
            confirmModal.style.display = "none";
        };
    } catch (error) {
        showMessage("Lỗi khi hiển thị xác nhận!");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("closeModal").addEventListener("click", () => {
        document.getElementById("modal").style.display = "none";
    });

    document.getElementById("confirmDelete").addEventListener("click", () => {
        const scheduleList = JSON.parse(localStorage.getItem("scheduleList")) || [];
        if (deleteIndex !== null) {
            scheduleList.splice(deleteIndex, 1);
            localStorage.setItem("scheduleList", JSON.stringify(scheduleList));
            fetchScheduleList();
            showSuccessModal();
        }
        closeDeleteModal();
    });

    document.getElementById("cancelDelete").addEventListener("click", closeDeleteModal);
    document.getElementById("closeDeleteModal").addEventListener("click", closeDeleteModal);
    document.getElementById("closeSuccessModal").addEventListener("click", closeSuccessModal);
    document.getElementById("closeEditedModal").addEventListener("click", closeEditedModal);

    const serviceTable = document.getElementById("serviceTable");
    const addServiceBtn = document.getElementById("addServiceBtn");
    const serviceModal = document.getElementById("serviceModal");
    const serviceImage = document.getElementById("serviceImage");
    const previewImg = document.getElementById("previewImg");
    const saveService = document.getElementById("saveService");
    const cancelService = document.getElementById("cancelService");
    const confirmNo = document.getElementById("confirmNo");
    const closeMessage = document.getElementById("closeMessage");

    addServiceBtn.addEventListener("click", openServiceModal);

    serviceImage.addEventListener("input", function() {
        try {
            const imageUrl = serviceImage.value.trim();
            if (imageUrl) {
                previewImg.src = imageUrl;
                previewImg.style.display = "block";
                previewImg.onerror = function() {
                    previewImg.style.display = "none";
                    showMessage("Không thể tải ảnh từ URL này!");
                };
            } else {
                previewImg.style.display = "none";
            }
        } catch (error) {
            showMessage("Lỗi khi hiển thị ảnh xem trước!");
        }
    });

    saveService.addEventListener("click", function () {
        try {
            const serviceName = document.getElementById("serviceName");
            const serviceDescription = document.getElementById("serviceDescription");
            const serviceImage = document.getElementById("serviceImage");

            const name = serviceName.value.trim();
            const description = serviceDescription.value.trim();
            const image = serviceImage.value.trim();

            if (!name || !description || !image) {
                showMessage("Vui lòng điền đầy đủ thông tin!");
                return;
            }

            const services = getServices();
            const isDuplicate = services.some((s, i) => 
                i !== window.editServiceIndex && 
                s.name === name
            );

            if (isDuplicate) {
                showMessage("Dịch vụ này đã tồn tại!");
                return;
            }

            const newService = { name, description, image };
            if (window.editServiceIndex !== null) {
                services[window.editServiceIndex] = newService;
            } else {
                services.push(newService);
            }
            saveServices(services);
            renderServiceList();
            serviceModal.style.display = "none";
        } catch (error) {
            showMessage("Lỗi khi lưu dịch vụ!");
        }
    });

    cancelService.addEventListener("click", function () {
        try {
            serviceModal.style.display = "none";
        } catch (error) {
            showMessage("Lỗi khi hủy modal dịch vụ!");
        }
    });

    closeMessage.addEventListener("click", function () {
        try {
            document.getElementById("messageModal").style.display = "none";
        } catch (error) {
            showMessage("Lỗi khi đóng thông báo!");
        }
    });

    confirmNo.addEventListener("click", function () {
        try {
            document.getElementById("confirmModal").style.display = "none";
        } catch (error) {
            showMessage("Lỗi khi hủy xác nhận!");
        }
    });

    serviceTable.addEventListener("click", function (e) {
        try {
            const services = getServices();
            if (e.target.classList.contains("edit-btn")) {
                const index = parseInt(e.target.dataset.index);
                const service = services[index];
                const serviceModal = document.getElementById("serviceModal");
                const serviceModalTitle = document.getElementById("serviceModalTitle");
                const serviceName = document.getElementById("serviceName");
                const serviceDescription = document.getElementById("serviceDescription");
                const serviceImage = document.getElementById("serviceImage");
                const previewImg = document.getElementById("previewImg");

                serviceModal.style.display = "block";
                serviceModalTitle.textContent = "Sửa dịch vụ";
                serviceName.value = service.name;
                serviceDescription.value = service.description;
                serviceImage.value = service.image;
                previewImg.src = service.image;
                previewImg.style.display = "block";
                window.editServiceIndex = index;
            } else if (e.target.classList.contains("delete-btn")) {
                const index = parseInt(e.target.dataset.index);
                showConfirm("Bạn có chắc chắn muốn xóa dịch vụ này không?", function () {
                    services.splice(index, 1);
                    saveServices(services);
                    renderServiceList();
                });
            }
        } catch (error) {
            showMessage("Lỗi khi thao tác với dịch vụ!");
        }
    });

    fetchScheduleList();
    setupFilters();
    renderServiceList();
    showSection("schedule");
});