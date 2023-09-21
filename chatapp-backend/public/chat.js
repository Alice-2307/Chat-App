const chat = document.getElementById("chat");
const msg = document.getElementById("message");
const msgdetail = document.getElementById("message-data");
const message = document.getElementById("message");

chat.addEventListener("submit", async (e) => {
    try {
        e.preventDefault()
        const msgData = {
            message: msg.value
        }
        const token = document.cookie.split("=")[1];
        const messageData = await axios.post("http://localhost:5000/message", msgData, { headers: { "Authorization": token } });
        showMessage(messageData.data.Message)
    } catch (error) {
        if (error.response !== undefined && (error.response.status === 401 || error.response.status === 500)) {
            message.textContent = `Error: ${error.response.data.Error}`;
        }
        else {
            message.textContent = `Error: ${error.message}`
        }
    }
})

function showMessage(msgVal) {
    const subElement = document.createElement("p");
    subElement.textContent = `You: ${msgVal.message}`;
    msgdetail.appendChild(subElement);
    msg.value = "";
}
