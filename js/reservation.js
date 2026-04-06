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
    submitReservation(form);
}

function submitReservation(form) {
    var submitBtn = form.querySelector('.btn-submit');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '제출 중...';
    }

    var product = form.querySelector('[name="product"]').value;
    var reserverName = form.querySelector('[name="reserver_name"]').value;
    var reserverContact = form.querySelector('[name="reserver_contact"]').value;
    var spouseName = form.querySelector('[name="spouse_name"]').value;
    var spouseContact = form.querySelector('[name="spouse_contact"]').value;
    var weddingDate = form.querySelector('[name="wedding_date"]').value;
    var weddingHour = form.querySelector('[name="wedding_hour"]').value;
    var weddingMinute = form.querySelector('[name="wedding_minute"]').value;
    var venueName = form.querySelector('[name="venue_name"]').value;
    var hallName = form.querySelector('[name="hall_name"]').value;
    var snapCompany = form.querySelector('[name="snap_company"]').value;
    var email = form.querySelector('[name="email"]').value;
    var inquiry = form.querySelector('[name="inquiry"]').value;

    var pyebaekRadio = form.querySelector('[name="pyebaek"]:checked');
    var hasPyebaek = pyebaekRadio ? pyebaekRadio.value === 'yes' : false;

    var options = [];
    var optionCheckboxes = form.querySelectorAll('[name^="option_"]:checked');
    for (var i = 0; i < optionCheckboxes.length; i++) {
        var label = optionCheckboxes[i].parentElement.querySelector('span');
        if (label) {
            options.push(label.textContent.trim());
        }
    }

    var productTypeMap = {
        'basic': '본식영상 기본',
        'premium': '본식영상 프리미엄'
    };

    var weddingTime = null;
    if (weddingHour && weddingMinute) {
        weddingTime = weddingHour + ':' + weddingMinute + ':00';
    }

    var reservationData = {
        product_type: productTypeMap[product] || product,
        reserver_name: reserverName,
        reserver_phone: reserverContact,
        spouse_name: spouseName,
        spouse_phone: spouseContact,
        wedding_date: weddingDate || null,
        wedding_time: weddingTime,
        venue_name: venueName,
        venue_hall: hallName,
        option_type: options.length > 0 ? options.join(', ') : null,
        has_pyebaek: hasPyebaek,
        snap_company: snapCompany,
        reserver_email: email,
        inquiry: inquiry
    };

    supabase
        .from('reservations')
        .insert([reservationData])
        .then(function(response) {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = '예약 신청';
            }

            if (response.error) {
                console.error('Reservation error:', response.error);
                alert('예약 신청 중 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.');
                return;
            }

            alert('예약 신청이 완료되었습니다.\n확인 후 연락드리겠습니다.');
            form.reset();
            updateInquiryCounter();
            updateSubmitButtonState();
        })
        .catch(function(err) {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = '예약 신청';
            }
            console.error('Reservation error:', err);
            alert('예약 신청 중 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.');
        });
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
