function fillTimeOptions() {
    var hourSelect = document.getElementById("wedding_hour");
    var minuteSelect = document.getElementById("wedding_minute");
    if (!hourSelect || !minuteSelect) return;
    var i, opt;
    for (i = 0; i <= 23; i++) {
        opt = document.createElement("option");
        opt.value = i < 10 ? "0" + i : String(i);
        opt.textContent = i + "시";
        hourSelect.appendChild(opt);
    }
    for (i = 0; i <= 50; i += 10) {
        opt = document.createElement("option");
        opt.value = i < 10 ? "0" + i : String(i);
        opt.textContent = i + "분";
        minuteSelect.appendChild(opt);
    }
}

function validateInquiryLength(event) {
    var inquiry = document.getElementById("inquiry");
    if (!inquiry) return;

    if (inquiry.value.length > 500) {
        inquiry.setCustomValidity("기타 문의사항은 500자 이내로 입력해 주세요.");
        if (event) event.preventDefault();
        inquiry.reportValidity();
        inquiry.focus();
    } else {
        inquiry.setCustomValidity("");
    }
}

function handleReservationSubmit(event) {
    var form = document.querySelector(".reservation-form");
    if (!form) return;

    validateInquiryLength(event);
    if (event.defaultPrevented) return;

    if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
        return;
    }

    event.preventDefault();
    alert("예약 확정 되셨습니다. 빠른 시일 내에 확인 후 연락드리도록 하겠습니다!");
}

function updateSubmitButtonState() {
    var form = document.querySelector(".reservation-form");
    var submitButton = document.querySelector(".btn-submit");
    if (!form || !submitButton) return;

    submitButton.disabled = !form.checkValidity();
}

function updateInquiryCounter() {
    var inquiry = document.getElementById("inquiry");
    var counter = document.getElementById("inquiry-counter");
    if (!inquiry || !counter) return;

    var maxLength = 500;
    var remain = maxLength - inquiry.value.length;
    if (remain < 0) remain = 0;
    counter.textContent = remain + "자 남음";
}

function bindInquiryValidation() {
    var form = document.querySelector(".reservation-form");
    var inquiry = document.getElementById("inquiry");
    if (!form || !inquiry) return;

    inquiry.addEventListener("input", function () {
        if (inquiry.value.length > 500) {
            inquiry.setCustomValidity("기타 문의사항은 500자 이내로 입력해 주세요.");
        } else {
            inquiry.setCustomValidity("");
        }
        updateInquiryCounter();
        updateSubmitButtonState();
    });

    form.addEventListener("input", updateSubmitButtonState);
    form.addEventListener("change", updateSubmitButtonState);

    updateInquiryCounter();
    updateSubmitButtonState();

    form.addEventListener("submit", handleReservationSubmit);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
        fillTimeOptions();
        bindInquiryValidation();
    });
} else {
    fillTimeOptions();
    bindInquiryValidation();
}