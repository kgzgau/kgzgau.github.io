// State
let currentSection = "welcome";

const sections = ["about", "projects", "contact"];
const projects = ["printf", "malloc", "console", "meditationbuddy"];

//nav
function showSection(id) {
  document.querySelectorAll("#right-panel section").forEach(sec => {
    sec.classList.add("hidden");
  });

  const target = document.getElementById(id);
  if (target) target.classList.remove("hidden");

  currentSection = id;

  document.querySelectorAll(".tab-link").forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + id);
  });
}

//terminal
const Commands = {
  help: (t) => t.print("> ls, cd <dir>, cat, pwd, clear"),

  ls: (t) => {
    if (currentSection === "welcome") return t.print("> " + sections.join(" "));
    if (currentSection === "projects") return t.print("> " + projects.join(" "));
    t.print("> nothing here");
  },

  cd: (t, args) => {
    const dir = args[0];
    if (!dir) return t.print("> cd <dir>");

    if (dir === "..") {
      showSection("welcome");
      return;
    }

    if (sections.includes(dir) || projects.includes(dir)) {
      showSection(dir);
      return;
    }

    t.print("> not found");
  },

  pwd: (t) => t.print("> /" + currentSection),

  clear: (t) => (t.output.innerHTML = "")
};

//terminal cont.
const Terminal = {
  init() {
    this.input = document.getElementById("command-input");
    this.output = document.getElementById("output");
    this.prompt = document.getElementById("prompt");

    this.updatePrompt();

    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = this.input.value.trim();
        this.print(this.prompt.textContent + " " + cmd);
        this.handle(cmd);
        this.input.value = "";
        this.updatePrompt();
      }
    });
  },

  updatePrompt() {
    this.prompt.textContent = `visitor@site:~/${currentSection}$`;
  },

  print(text) {
    const line = document.createElement("div");
    line.innerHTML = text;
    this.output.appendChild(line);
  },

  handle(input) {
    const [cmd, ...args] = input.split(" ");
    Commands[cmd]
      ? Commands[cmd](this, args)
      : this.print("> command not found");
  }
};

//click to nav
document.querySelectorAll(".tab-link").forEach(link => {
  link.onclick = (e) => {
    e.preventDefault();
    showSection(link.getAttribute("href").substring(1));
  };
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("project-link")) {
    e.preventDefault();
    showSection(e.target.getAttribute("href").substring(1));
  }
});

//init
window.onload = () => Terminal.init();