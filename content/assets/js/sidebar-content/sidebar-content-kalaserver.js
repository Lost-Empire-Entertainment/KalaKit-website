const sidebarItems = [
    { nest: 0, label: 'Manual', link: '#' },
    { nest: 1, label: 'placeholder', link: '#' },

    { nest: 0, label: 'API', link: '#' },
    { nest: 1, label: 'Client', link: '/kalaserver/client' },
    { nest: 2, label: 'HandleClient', link: '/kalaserver/client/handleclient' },
    { nest: 2, label: 'ExtractHeader', link: '/kalaserver/client/extractheader' },
    { nest: 2, label: 'ExtractHeaderValue', link: '/kalaserver/client/extractheadervalue' },
    { nest: 2, label: 'ParseByteRange', link: '/kalaserver/client/parsebyterange' },
    { nest: 2, label: 'ConnectionStart', link: '/kalaserver/client/connectionstart' },
    { nest: 2, label: 'CanConnect', link: '/kalaserver/client/canconnect' },
    { nest: 2, label: 'IsValidRoute', link: '/kalaserver/client/isvalidroute' },
    { nest: 2, label: 'SendEmail', link: '/kalaserver/client/sendemail' },
    { nest: 2, label: 'SocketCleanup', link: '/kalaserver/client/socketcleanup' },
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