function highlightCPP() {
    document.querySelectorAll('code.language-cpp').forEach(block => {
        let html = block.textContent;

        html = html
            //strings
            .replace(/"(.*?)"/g, '<span class="cpp-string">"$1"</span>')

            //comments (must come before keywords)
            .replace(/\/\/(.*)/g, '<span class="cpp-comment">//$1</span>')

            //keywords
            .replace(/\b(class|return|if|else|for|while|const|void|public|private|namespace|using|new|delete|true|false|nullptr)\b/g,
                '<span class="cpp-keyword">$1</span>')

            //types
            .replace(/\b(int|size_t|uintptr_t|string|bool|float|double|char|void)\b/g,
                '<span class="cpp-type">$1</span>')

            //function name (basic heuristic: word before open paren)
            .replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g,
                '<span class="cpp-func">$1</span>');

        block.innerHTML = html;
    });
}

document.addEventListener("DOMContentLoaded", highlightCPP);