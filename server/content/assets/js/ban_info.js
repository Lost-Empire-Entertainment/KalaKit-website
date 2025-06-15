window.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const ip = body.dataset.ip;
    const reason = body.dataset.reason;
    const target = body.dataset.target;

    //fill visible fields
    document.getElementById("bannedIP").textContent = ip;
    document.getElementById("banReason").textContent = reason;

    const emailBody = 
        `Hello,%0A%0A` +
        `I was banned from your server.%0A` +
        `My IP: ${ip}%0A` +
        `Reason: ${reason}%0A%0A` +
        `Please review my request.%0AThank you.`;

    document.getElementById("emailLink").href =
        `mailto:${target}?subject=Unban%20Request&body=${emailBody}`;
})