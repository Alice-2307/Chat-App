const chat = document.getElementById("chat");
const msg = document.getElementById("message");
const msgdetail = document.getElementById("message-data")

chat.addEventListener("submit", (e) =>{
    e.preventDefault()
    const subElement = document.createElement("p");
    subElement.textContent = `You: ${msg.value}`;
    msgdetail.appendChild(subElement);
    msg.value = "";
})

