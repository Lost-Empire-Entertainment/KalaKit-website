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

    const navButtons = document.querySelectorAll(".button-general[data-link]");

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

    //
    // BACK TO PARENT
    //

    const backButton = document.querySelector(".back-to-parent");

    if (backButton) {
        backButton.addEventListener("click", () => {
            const currentURL = window.location.pathname;
            const segments = currentURL.split("/").filter(Boolean);
            if (segments.length > 0) {
                segments.pop(); //remove last segment
                const parentPath = "/" + segments.join("/");
                window.location.href = parentPath || "/";
            }
        })
    }
});