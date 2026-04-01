// -----------------------------
// Portfolio + Terminal Integration
// -----------------------------
let currentSection = "welcome"; // "home"
const sections = ["about", "projects", "contact"];
const projectFiles = ["Printf", "Malloc", "Console", "MeditationBuddy"];

// -----------------------------
// Helpers
// -----------------------------
function showSection(id) {
  document.querySelectorAll("#right-panel section").forEach(sec => {
    sec.classList.add("hidden");
  });
  const target = document.getElementById(id);
  if (target) target.classList.remove("hidden");
  currentSection = id;

  // Update active tab
  document.querySelectorAll("#tabs .tab-link").forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + id);
  });
}

// Strip HTML for terminal cat command
function stripHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

// -----------------------------
// Terminal Commands
// -----------------------------
const Commands = {
  help: (term) => {
    term.print("> Available: ls, cd <dir>, cat, pwd, skills, clear, whoami");
  },

  ls: (term) => {
    let output = "";
    if (currentSection === "welcome") {
      output = sections.join("    ");
    } else if (currentSection === "about") {
      output = "about.txt";
    } else if (currentSection === "projects") {
      output = projectFiles.join("    ");
    } else if (currentSection === "contact") {
      output = "contact.txt";
    } else if (projectFiles.includes(currentSection)) {
      output = "README.txt";
    }
    term.print("> " + output);
  },

  cd: (term, args) => {
    if (!args[0]) return term.print("> usage: cd <dir>");

    const dir = args[0];

    if (dir === "..") {
      showSection("welcome");
      return term.print("> moved to home");
    }

    // Contextual navigation
    const context = {
      welcome: sections,
      projects: projectFiles,
      about: [],
      contact: [],
      Printf: [],
      Malloc: [],
      Console: [],
      MeditationBuddy: []
    };

    if (context[currentSection]?.includes(dir)) {
      showSection(dir.toLowerCase()); // lowercase mapping for right panel
      return term.print(`> changed to /${dir}`);
    }

    term.print("> directory not found");
  },

  pwd: (term) => {
    const dir = currentSection === "welcome" ? "~" : currentSection;
    term.print(`> /${dir}`);
  },

  cat: (term, args) => {
    const section = args[0] || currentSection;

    if (section === "welcome") return term.print("> No file to read here.");
    if (!sections.includes(section)) {
      if (!projectFiles.includes(section)) return term.print("> file not found");
    }

    const content = stripHTML(
      document.getElementById(section.toLowerCase())?.innerHTML || `File: ${section}`
    );
    term.print(`> opening ${section} → see right panel`);
    showSection(section.toLowerCase());
  },

  skills: (term) => {
    const skillsList = [
      "JavaScript, React, Node.js",
      "Swift, iOS Development",
      "Python, ML Basics"
    ];
    term.print("> Skills:\n" + skillsList.join("\n"));
  },

  whoami: (term) => {
    term.print("> Karena - Full Stack Developer");
  },

  clear: (term) => {
    term.output.innerHTML = "";
  }
};

// -----------------------------
// Terminal Object
// -----------------------------
const Terminal = {
  init() {
    this.input = document.getElementById("command-input");
    this.output = document.getElementById("output");
    this.prompt = document.getElementById("prompt");
    this.updatePrompt();

    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const command = this.input.value.trim();
        if (!command) return;
        this.print(`${this.prompt.textContent} ${command}`);
        this.handle(command);
        this.input.value = "";
        this.updatePrompt();
      }
    });

    this.typeWelcome();
  },

  updatePrompt() {
    const dir = currentSection === "welcome" ? "" : currentSection;
    this.prompt.textContent = `visitor@terminal:~${dir ? "/" + dir : ""}$`;
  },

  print(text) {
    const line = document.createElement("div");
    line.innerHTML = text;
    this.output.appendChild(line);
    window.scrollTo(0, document.body.scrollHeight);
  },

  handle(input) {
    const [command, ...args] = input.split(" ");
    if (Commands[command]) Commands[command](this, args);
    else this.print(`> command not found: ${command}`);
  },

  // -----------------------------
  // Typewriter animation on right panel
  // -----------------------------
  typeWelcome() {
    const target = document.getElementById("welcome-animation");
    const lines = [
      { text: "hello", backspace: true, delay: 300 },
      { text: "你好", backspace: true, delay: 300 },
      { text: "I'm Karena", backspace: false, delay: 300 }
    ];

    let idx = 0;

    const typeLine = () => {
      if (idx >= lines.length) return;

      const line = lines[idx];
      let text = line.text;
      let i = 0;

      const typeChar = () => {
        if (i <= text.length) {
          target.textContent = text.slice(0, i);
          i++;
          setTimeout(typeChar, 100);
        } else if (line.backspace) {
          setTimeout(() => this.backspace(target, text, () => {
            idx++;
            setTimeout(typeLine, line.delay);
          }), 500);
        } else {
          idx++;
          setTimeout(typeLine, line.delay);
        }
      };

      typeChar();
    };

    typeLine();
  },

  backspace(el, text, callback) {
    let i = text.length;
    const erase = () => {
      if (i >= 0) {
        el.textContent = text.slice(0, i);
        i--;
        setTimeout(erase, 50);
      } else callback();
    };
    erase();
  }
};

// -----------------------------
// Tabs
// -----------------------------
document.querySelectorAll("#tabs .tab-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const id = link.getAttribute("href").substring(1);
    showSection(id);
  });
});

// -----------------------------
// Initialize
// -----------------------------
window.onload = () => Terminal.init();