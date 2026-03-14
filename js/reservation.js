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

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fillTimeOptions);
} else {
    fillTimeOptions();
}