const chat = document.getElementById("chat");
const msg = document.getElementById("message");
const msgdetail = document.getElementById("message-data");
const message = document.getElementById("message");
const loginUser = localStorage.getItem('username');
const checkLocal = JSON.parse(localStorage.getItem('message')) || [];
const token = document.cookie.split("=")[1];

chat.addEventListener("submit", async (e) => {
    try {
        e.preventDefault()
        const msgData = {
            message: msg.value
        }
        const result = await axios.post("http://localhost:5000/message", msgData, { headers: { "Authorization": token } });
        postMessage(result.data.Message);
    } catch (error) {
        showError(error)
    }
})
function postMessage(msgVal) {

    msg.value = "";
    checkLocal.push({ id: msgVal.id, message: msgVal.message })
    localStorage.setItem('message', JSON.stringify(checkLocal))
    if (checkLocal.length > 10) {
        checkLocal.shift();
    }
    showLocal();
}

window.addEventListener("DOMContentLoaded", () => {
    loadMessage();
})

async function loadMessage() {
    try {
        let lastMessageId;
        if (checkLocal.length === 0) {
            lastMessageId = 0;
        }
        else {
            const lastMessage = checkLocal[checkLocal.length - 1]
            lastMessageId = lastMessage.id
        }
        const messageData = await axios.get(`http://localhost:5000/message?lastmessageid=${lastMessageId}`, { headers: { "Authorization": token } });
        storedLocal(messageData.data.Message);

    } catch (error) {
        showError(error)
    }
}
function storedLocal(val) {
    for (let i = 0; i < val.length; i++) {
        checkLocal.push({ id: val[i].id, message: val[i].message, sender: val[i].sender, username: val[i].username })
        localStorage.setItem('message', JSON.stringify(checkLocal))
        if (checkLocal.length > 10) {
            checkLocal.shift();
        }
    }
    showLocal();
}

function showLocal() {

    msgdetail.textContent = "";
    for (let i = 0; i < checkLocal.length; i++) {
        showMessage(checkLocal[i]);
    }
}

function showMessage(msgVal) {

    const subElement = document.createElement("p");
    if (msgVal.message === 'joined') {
        if (msgVal.username === undefined || msgVal.username === loginUser) {
            subElement.textContent = `You ${msgVal.message}`;
        }
        else {
            subElement.textContent = `${msgVal.sender} ${msgVal.message}`;
        }
    }
    else if (msgVal.username === undefined) {
        subElement.textContent = `You: ${msgVal.message}`;
    }
    else {
        subElement.textContent = `${msgVal.sender}: ${msgVal.message}`;
    }
    msgdetail.appendChild(subElement);

}

function showError(error) {
    if (error.response !== undefined && (error.response.status === 401 || error.response.status === 500)) {
        message.textContent = `Error: ${error.response.data.Error}`;
    }
    else {
        message.textContent = `Error: ${error.message}`
    }
}


setInterval(loadMessage, 1000);
