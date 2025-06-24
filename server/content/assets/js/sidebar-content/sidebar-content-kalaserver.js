const sidebarItems = [
    { nest: 0, label: 'Manual', link: '#' },
    { nest: 1, label: 'placeholder', link: '#' },
    { nest: 0, label: 'API', link: '#' },
    { nest: 1, label: 'Client', link: '/kalaserver/client' },
];

function createSidebar() {
    const existingSidebar = document.getElementById('sidebar');
    if (!existingSidebar) return;

    const ul = document.createElement('ul');
    ul.id = 'sidebar-content';

    for (const item of sidebarItems) {
        const li = document.createElement('li');
        li.dataset.nest = item.nest;
        li.dataset.link = item.link;
        li.textContent = item.label;
        ul.appendChild(li);
    }

    existingSidebar.appendChild(ul);

    //apply nesting level styles after appending
    document.querySelectorAll('#sidebar-content li').forEach(li => {
        const level = parseInt(li.dataset.nest) || 0;
        li.style.setProperty('--nest-level', level);
    })
}

document.addEventListener('DOMContentLoaded', createSidebar);