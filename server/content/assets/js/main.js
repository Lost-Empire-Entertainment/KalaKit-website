document.addEventListener("DOMContentLoaded", () => {

    //
    // ADJUST FOOTER POSITION
    //

    const footer = document.querySelector(".footer");

    function adjustFooterPosition() {
        const bodyHeight = document.body.scrollHeight;
        const windowHeight = window.innerHeight;

        if (bodyHeight <= windowHeight) {
            footer.classList.add("fixed");
        } else {
            footer.classList.remove("fixed");
        }
    }

    adjustFooterPosition();
    window.addEventListener("resize", adjustFooterPosition);

    //
    // ROUTE/URL BUTTON CLICK
    //

    const navButtons = document.querySelectorAll(".footer-button[data-link]");

    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            const href = button.getAttribute("data-link");
            const openNewTab = button.getAttribute("data-newtab") === "true";

            if (href) {
                if (openNewTab) {
                    window.open(href, "_blank", "noopener,noreferrer");
                } else {
                    window.location.href = href;
                }
            }
        });
    });
});