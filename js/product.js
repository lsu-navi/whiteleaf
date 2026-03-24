(function () {
    var modal = document.getElementById("productVideoModal");
    var iframe = document.getElementById("productVideoIframe");
    var closeBtn = modal && modal.querySelector(".product-video-close");
    var backdrop = modal && modal.querySelector(".product-video-backdrop");

    function openModal(videoId) {
        if (!modal || !iframe || !videoId) return;
        iframe.src = "https://www.youtube-nocookie.com/embed/" + videoId + "?autoplay=1&mute=1&rel=0";
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        if (!modal || !iframe) return;
        iframe.src = "about:blank";
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    document.addEventListener("click", function (e) {
        var link = e.target.closest(".product-video-link[data-youtube-id]");
        if (link) {
            e.preventDefault();
            openModal(link.getAttribute("data-youtube-id"));
        }
        if (e.target === closeBtn || e.target === backdrop) {
            closeModal();
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal && modal.getAttribute("aria-hidden") === "false") {
            closeModal();
        }
    });
})();