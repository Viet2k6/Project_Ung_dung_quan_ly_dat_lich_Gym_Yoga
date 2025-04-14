const scheduleData = [
    { className: "Gym", date: "2025-04-01", time: "11:00", name: "Nguyễn Văn Nam", email: "vannam007@gmail.com" },
    { className: "Yoga", date: "2025-04-23", time: "19:57", name: "Trần Thị Lan", email: "lantran2k3@gmail.com" },
];

if (!localStorage.getItem("scheduleList")) {
    localStorage.setItem("scheduleList", JSON.stringify(scheduleData));
}

function fetchScheduleList() {
    const data = JSON.parse(localStorage.getItem("scheduleList")) || [];
    const scheduleList = document.getElementById("scheduleList");
    scheduleList.innerHTML = "";

    data.forEach((schedule, index) => {
        const row = document.createElement("tr");
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
        scheduleList.appendChild(row);
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
        alert("Email không hợp lệ. Vui lòng nhập đúng định dạng email.");
        return false;
    }

    const isConflict = scheduleList.some((item, index) =>
        index !== currentIndex &&
        item.email === email &&
        item.date === date &&
        item.time === time
    );

    if (isConflict) {
        alert("Bạn đã có lịch tập vào khung giờ này trong ngày.");
        return false;
    }

    return true;
}

function showModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "block";
}

function hideModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
}

let deleteIndex = null;

function deleteSchedule(index) {
    deleteIndex = index;
    showModal("deleteModal");
}

document.getElementById("confirmDelete").addEventListener("click", () => {
    const scheduleList = JSON.parse(localStorage.getItem("scheduleList")) || [];
    if (deleteIndex !== null) {
        scheduleList.splice(deleteIndex, 1);
        localStorage.setItem("scheduleList", JSON.stringify(scheduleList));
        fetchScheduleList();
        showModal("successModal");
    }
    hideModal("deleteModal");
    deleteIndex = null;
});

document.getElementById("cancelDelete").addEventListener("click", () => {
    hideModal("deleteModal");
    deleteIndex = null;
});

document.getElementById("closeDeleteModal").addEventListener("click", () => {
    hideModal("deleteModal");
    deleteIndex = null;
});

document.getElementById("closeSuccessModal").addEventListener("click", () => {
    hideModal("successModal");
});

document.getElementById("openModal").addEventListener("click", () => {
    clearForm();
    currentEditIndex = null;
    showModal("modal");
});

document.getElementById("closeModal").addEventListener("click", () => {
    hideModal("modal");
});

document.getElementById("closeAddedModal").addEventListener("click", () => {
    hideModal("addedModal");
});

document.getElementById("closeEditedModal").addEventListener("click", () => {
    hideModal("editedModal");
});

let currentEditIndex = null;

document.querySelector("form").addEventListener("submit", event => {
    event.preventDefault();
    const scheduleList = JSON.parse(localStorage.getItem("scheduleList")) || [];

    const schedule = {
        className: document.querySelector("select").value,
        date: document.querySelector("input[type='date']").value,
        time: document.querySelector("input[type='time']").value,
        name: document.querySelector("input[type='text']").value,
        email: document.querySelector("input[type='email']").value,
    };

    if (validateSchedule(schedule, scheduleList, currentEditIndex)) {
        if (currentEditIndex === null) {
            // Thêm mới
            scheduleList.push(schedule);
            localStorage.setItem("scheduleList", JSON.stringify(scheduleList));
            fetchScheduleList();
            hideModal("modal");
            showModal("addedModal");
        } else {
            // Sửa
            scheduleList[currentEditIndex] = schedule;
            localStorage.setItem("scheduleList", JSON.stringify(scheduleList));
            fetchScheduleList();
            hideModal("modal");
            showModal("editedModal");
            currentEditIndex = null;
        }
    }
});

function editSchedule(index) {
    const scheduleList = JSON.parse(localStorage.getItem("scheduleList")) || [];
    const schedule = scheduleList[index];
    currentEditIndex = index;

    document.querySelector("select").value = schedule.className;
    document.querySelector("input[type='date']").value = schedule.date;
    document.querySelector("input[type='time']").value = schedule.time;
    document.querySelector("input[type='text']").value = schedule.name;
    document.querySelector("input[type='email']").value = schedule.email;

    showModal("modal");
}

function clearForm() {
    document.querySelector("select").value = "Gym";
    document.querySelector("input[type='date']").value = "";
    document.querySelector("input[type='time']").value = "";
    document.querySelector("input[type='text']").value = "";
    document.querySelector("input[type='email']").value = "";
}

fetchScheduleList();
