document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("sidebar-toggle");
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("sidebar-content");

    if (toggle
        && sidebar) {
        toggle.addEventListener("click", () => {
            sidebar.classList.toggle("hidden");
        })
    }

    //close sidebar when clicking outside
    document.addEventListener('click', (event) => {
        const isClickingInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggle = toggle.contains(event.target);

        if (!sidebar.classList.contains('hidden')
            && !isClickingInsideSidebar
            && !isClickOnToggle) {
            sidebar.classList.add('hidden');
        }
	})

	document.querySelectorAll('#sidebar-content li').forEach(li => {
		const level = parseInt(li.dataset.nest) || 0;
		li.style.setProperty('--nest-level', level);
	})

    //collapse/expand tree behavior
	const items = Array.from(content.querySelectorAll("li"));

	items.forEach((li, index) => {
		const depth = parseInt(li.dataset.nest || "0");
		const label = li.textContent.trim();
		const target = li.dataset.link;

		//clear li and create a wrapper
		li.textContent = "";
		li.style.display = "flex";
		li.style.alignItems = "center";
		li.style.gap = "5px";

		//create expand arrow if it has children
		const next = items[index + 1];
		const hasChildren = next && parseInt(next.dataset.nest) > depth;

		let arrow = null;
		let expanded = true;

		if (hasChildren) {
			arrow = document.createElement("span");
			arrow.classList.add("arrow-toggle");
			arrow.textContent = "▾";
			arrow.style.cursor = "pointer";
			arrow.addEventListener("click", (e) => {
				e.stopPropagation();
				expanded = !expanded;
				arrow.textContent = expanded ? "▾" : "▸";

				for (let i = index + 1; i < items.length; i++) {
					const child = items[i];
					const childDepth = parseInt(child.dataset.nest);
					if (childDepth <= depth) break;
					child.style.display = expanded ? "flex" : "none";
				}
			});
			li.appendChild(arrow);
		} else {
			const spacer = document.createElement("span");
			spacer.style.width = "1em";
			li.appendChild(spacer);
		}

		//create button
		const btn = document.createElement("span");
		btn.classList.add("button-general");
		if (depth > 0) btn.classList.add(`nested-level-${depth}`);
		btn.textContent = label;
		btn.dataset.link = target;

		//final level has no arrow, so its pushed manually
		if (!hasChildren && depth === 3) {
			btn.style.marginLeft = "3.5em";
		}

		btn.addEventListener("click", () => {
			if (target && target !== "#") window.location.href = target;
		});

		li.appendChild(btn);
	});
});