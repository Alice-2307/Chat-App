const chat = document.getElementById("chat");
const msg = document.getElementById("message");
const msgdetail = document.getElementById("message-data");
const message = document.getElementById("message");
const loginUser = localStorage.getItem('username');
const token = document.cookie.split("=")[1];

const groupBtn = document.getElementById("create-group").addEventListener("click", async () => {
    const groupName = prompt("Enter Your Group Name:");
    if (groupName) {
        try {
            const grpName = {
                name: groupName
            }
            const result = await axios.post("http://localhost:5000/groupname", grpName, { headers: { "Authorization": token } });
            showGroup(result.data.Message);
        } catch (error) {
            showError(error)
        }
    }
})

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const result = await axios.get("http://localhost:5000/groupname", { headers: { "Authorization": token } });
        localStorage.setItem('group', "")
        for (let i = 0; i < result.data.Message.length; i++) {
            showGroup(result.data.Message[i]);
        }
    } catch (error) {
        showError(error)
    }
})

function showGroup(result) {
    const save = result.name;
    const groupList = document.getElementById("group-list");
    const subElement = document.createElement("li");

    const grpnNamebtn = document.createElement("input");
    const inviteBtn = document.createElement("input");

    grpnNamebtn.type = "button";
    grpnNamebtn.value = `${save}`;
    grpnNamebtn.style.backgroundColor = "none"
    grpnNamebtn.style.padding = "4px"
    grpnNamebtn.style.marginBottom = "8px"

    inviteBtn.type = "button";
    inviteBtn.value = "add user"
    inviteBtn.style.marginLeft = "5px"
    inviteBtn.style.backgroundColor = "blue"
    inviteBtn.style.color = "white"

    grpnNamebtn.onclick = () => {
        localStorage.setItem('group', save)
        localStorage.setItem('message', JSON.stringify([]));
        loadMessage()
    };
    inviteBtn.onclick = () => {
        inviteUser(result);
    }

    subElement.appendChild(grpnNamebtn);
    subElement.appendChild(inviteBtn);
    groupList.appendChild(subElement);
}
async function inviteUser(val) {
    try {
        const userEmail = prompt("Enter Your User Email:");
        if (userEmail) {
            const uI = ({
                groupName: val.name,
                userToInvite: userEmail
            })
            const result = await axios.post("http://localhost:5000/invite", uI, { headers: { "Authorization": token } });
            alert(result.data.Message)
        }
    } catch (error) {
        showError(error)
    }
}

chat.addEventListener("submit", async (e) => {
    try {
        const gpName = localStorage.getItem('group');
        e.preventDefault()
        const msgData = {
            message: msg.value,
            group: gpName
        }
        await axios.post("http://localhost:5000/message", msgData, { headers: { "Authorization": token } });
        msg.value = "";
        loadMessage();
    } catch (error) {
        showError(error)
    }
})

async function loadMessage() {
    try {
        const g = localStorage.getItem('group');
        document.getElementById("group-name").textContent = `Group ${g}`
        const checkLocal = JSON.parse(localStorage.getItem('message'))
        let lastMessageId;
        if (checkLocal.length === 0) {
            lastMessageId = 0;
        }
        else {
            const lastMessage = checkLocal[checkLocal.length - 1]
            lastMessageId = lastMessage.id
        }
        const messageData = await axios.get(`http://localhost:5000/message?lastmessageid=${lastMessageId}&groupname=${g}`, { headers: { "Authorization": token } });
        storedLocal(messageData.data.Message);

    } catch (error) {
        showError(error)
    }
}

function storedLocal(val) {
    const checkLocal = JSON.parse(localStorage.getItem('message'))

    for (let i = 0; i < val.length; i++) {
        checkLocal.push({ id: val[i].id, message: val[i].message, sender: val[i].sender, username: val[i].username })
        localStorage.setItem('message', JSON.stringify(checkLocal))
        console.log(checkLocal.length)
    }
    showLocal();
}

function showLocal() {
    msgdetail.textContent = "";
    const checkLocal = JSON.parse(localStorage.getItem('message'))
    while (checkLocal.length > 10) {
        checkLocal.shift();
    }
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
    else if (msgVal.username === loginUser) {
        subElement.textContent = `You: ${msgVal.message}`;
    }
    else {
        subElement.textContent = `${msgVal.sender}: ${msgVal.message}`;
    }
    msgdetail.appendChild(subElement);

}

function showError(error) {
    if (error.response !== undefined && (error.response.status === 401 || error.response.status === 500 || error.response.status === 400)) {
        alert(error.response.data.Error);
    }
    else {
        alert(`Error: ${error.message}`);
    }
}

setInterval(() => {
    if (localStorage.getItem('group') !== "") {
        loadMessage();
    }
}, 1000);
