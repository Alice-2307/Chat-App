const chat = document.getElementById("chat");
const msg = document.getElementById("message");
const msgdetail = document.getElementById("message-data");
const message = document.getElementById("message");
const loginUser = localStorage.getItem('username');

chat.addEventListener("submit", async (e) => {
    try {
        e.preventDefault()
        const msgData = {
            message: msg.value
        }
        const token = document.cookie.split("=")[1];
        await axios.post("http://localhost:5000/message", msgData, { headers: { "Authorization": token } });
        const subElement = document.createElement("p");
        subElement.textContent = `You: ${msg.value}`;
        msgdetail.appendChild(subElement);
        msg.value = "";
    } catch (error) {
        if (error.response !== undefined && (error.response.status === 401 || error.response.status === 500)) {
            message.textContent = `Error: ${error.response.data.Error}`;
        }
        else {
            message.textContent = `Error: ${error.message}`
        }
    }
})

window.addEventListener("DOMContentLoaded", () => {
    loadMessage();
})

async function loadMessage() {
    try {
        const token = document.cookie.split("=")[1];
        const messageData = await axios.get("http://localhost:5000/message", { headers: { "Authorization": token } });
        msgdetail.textContent = "";
        for (let i = 0; i < messageData.data.Message.length; i++) {
            showMessage(messageData.data.Message[i], loginUser);
        }
    } catch (error) {
        if (error.response !== undefined && error.response.status === 500) {
            message.textContent = `Error: ${error.response.data.Error}`;
        }
        else {
            message.textContent = `Error: ${error.message}`
        }
    }
}

function showMessage(msgVal, checkUser) {
    const subElement = document.createElement("p");
    if (msgVal.username === checkUser) {
        subElement.textContent = `You: ${msgVal.message}`;
    }
    else {
        subElement.textContent = `${msgVal.sender}: ${msgVal.message}`;
    }
    msgdetail.appendChild(subElement);
}

setInterval(loadMessage, 1000);
