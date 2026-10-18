// Edit the titles and messages here ✏️
const things = [
  { title: "bghet djaja feya joe",   text: "Write your own message here..." },
  { title: "bghet djaja khra mazal feya joe ",  text: "Write your own message here..." },
  { title: "nsit la sauce",            text: "Write your own message here..." },
  { title: "rouz o djaja",         text: "Write your own message here..." },
  { title: "kun gha tzadit btriq",  text: "Write your own message here..." },
  { title: "ana atir",      text: "Write your own message here..." },
  { title: "fen ana o fen nta", text: "Write your own message here..." },
  { title: "someday somehow",             text: "Write your own message here..." },
  { title: "jani joe eawed",         text: "Write your own message here..." },
  { title: "welah ta feya joe", text: "Write your own message here..." },
];

const list = document.getElementById("list");

// Left column = odd numbers, right column = even (matches the screenshot order)
things.forEach((t, i) => {
  const item = document.createElement("div");
  item.className = "item";
  item.innerHTML = `
    <button type="button" aria-expanded="false">
      <span>${i + 1}. ${t.title}</span>
      <span class="plus">+</span>
    </button>
    <div class="answer">${t.text}</div>
  `;
  item.querySelector("button").addEventListener("click", (e) => {
    const open = item.classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", open);
  });
  list.appendChild(item);
});
