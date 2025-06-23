document.addEventListener("DOMContentLoaded", () =>
{
    const toggle = document.getElementById("sidebar-toggle");
    const sidebar = document.getElementById("sidebar");

    if (toggle
        && sidebar)
    {
        toggle.addEventListener("click", () =>
        {
            sidebar.classList.toggle("hidden");
        })
    }

    //close sidebar when clicking outside
    document.addEventListener('click', (event) =>
    {
        const isClickingInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggle = toggle.contains(event.target);

        if (!sidebar.classList.contains('hidden')
            && !isClickingInsideSidebar
            && !isClickOnToggle)
        {
            sidebar.classList.add('hidden');
        }
    })
})