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
            showGroup(result.data.Group, result.data.isAdmin);
        } catch (error) {
            showError(error)
        }
    }
})

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const result = await axios.get("http://localhost:5000/groupname", { headers: { "Authorization": token } });
        console.log(result);
        localStorage.setItem('groupname', "")
        localStorage.setItem('groupid', "")
        localStorage.setItem('live', "")
        for (let i = 0; i < result.data.Message.length; i++) {
            showGroup(result.data.Message[i], result.data.Message[i].isAdmin);
        }
    } catch (error) {
        showError(error)
    }

})

function showGroup(group, isAdmin) {
    const groupList = document.getElementById("group-list");
    const subElement = document.createElement("li");

    const grpnNamebtn = document.createElement("input");
    grpnNamebtn.type = "button";
    grpnNamebtn.value = `${group.name}`;
    grpnNamebtn.style.backgroundColor = "none"
    grpnNamebtn.style.padding = "4px"
    grpnNamebtn.style.marginBottom = "8px"

    grpnNamebtn.onclick = () => {
        localStorage.setItem('groupid', group.id)
        localStorage.setItem('groupname', group.name);
        localStorage.setItem('live', group.name);
        localStorage.setItem('message', JSON.stringify([]));
        loadMessage()
    };
    subElement.appendChild(grpnNamebtn);
    if (isAdmin === true) {
        const inviteBtn = document.createElement("input");
        inviteBtn.type = "button";
        inviteBtn.value = "add user"
        inviteBtn.style.marginLeft = "5px"
        inviteBtn.style.backgroundColor = "blue"
        inviteBtn.style.color = "white"
        inviteBtn.onclick = () => {
            inviteUser(group);
        }
        subElement.appendChild(inviteBtn);
    }
    groupList.appendChild(subElement);
}
async function inviteUser(val) {
    try {
        const userEmail = prompt("Enter Your User Email:");
        if (userEmail) {
            const uI = ({
                groupId: val.id,
                userToInvite: userEmail,
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
        const gId = localStorage.getItem('groupid');
        e.preventDefault()
        const msgData = {
            message: msg.value,
            groupid: gId
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
        const groupName = document.getElementById("group-name");
        const groupname = localStorage.getItem('groupname')
        const groupid = localStorage.getItem('groupid');
        groupName.textContent = `Group ${groupname}`;
       
       
        const membersContainer = document.createElement("div");
        groupName.appendChild(membersContainer);

        const showGroupMembersbtn = document.createElement("input");
        showGroupMembersbtn.type = "button";
        showGroupMembersbtn.value = `Group members`;
        showGroupMembersbtn.onclick = async () => {
            showMembers(membersContainer, groupid)
            msgdetail.textContent = "";
        }
        groupName.appendChild(showGroupMembersbtn);

        const checkLocal = JSON.parse(localStorage.getItem('message'));
        let lastMessageId;

        if (checkLocal.length === 0) {
            lastMessageId = 0;
        } else {
            const lastMessage = checkLocal[checkLocal.length - 1];
            lastMessageId = lastMessage.id;
        }
        const messageData = await axios.get(`http://localhost:5000/message?lastmessageid=${lastMessageId}&groupid=${groupid}`, { headers: { "Authorization": token } });
        storedLocal(messageData.data.Message);
        
    } catch (error) {
        showError(error);
    }
}

let isOpen = false;

async function showMembers(membersContainer, groupid) {
    try {
        if (!isOpen) {
            const members = await axios.get(`http://localhost:5000/members?groupid=${groupid}`, { headers: { "Authorization": token } });
            console.log(members);
            localStorage.setItem('live', "")
            console.log(members.data.Members[0]);
            const currentUserIsAdmin = members.data.Result;

            for (let i = 0; i < members.data.Members.length; i++) {
                console.log("hy");
                const element = document.createElement("div");
                const isAdmin = members.data.Members[i].isAdmin;

                if (isAdmin) {
                    element.textContent = `Admin: ${members.data.Members[i].name}`;
                } else {
                    element.textContent = members.data.Members[i].name;

                    if (currentUserIsAdmin) {
                        const makeAdminBtn = document.createElement("input");
                        makeAdminBtn.type = "button";
                        makeAdminBtn.value = `Make Admin`;
                        makeAdminBtn.onclick = async () => {
                            await axios.get(`http://localhost:5000/makeadmin?groupid=${groupid}&userid=${members.data.Members[i].id}`, { headers: { "Authorization": token } });
                            alert("user admin succesfully");
                        }
                        element.appendChild(makeAdminBtn);
                        const deleteBtn = document.createElement("input");
                        deleteBtn.type = "button";
                        deleteBtn.value = `Delete user`;
                        deleteBtn.onclick = async () => {
                            await axios.delete(`http://localhost:5000/deleteuser?groupid=${groupid}&userid=${members.data.Members[i].id}`, { headers: { "Authorization": token } });
                            alert("Delete user successfully");
                        }
                        element.appendChild(deleteBtn);
                    }

                }
                membersContainer.appendChild(element);
            }
            isOpen = true;
        }
        else {
            const groupName = localStorage.getItem('groupname')
            localStorage.setItem('live', groupName)
            membersContainer.innerHTML = "";
            isOpen = false;
            showLocal();
        }
    } catch (error) {
        showError(error);
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

// setInterval(() => {
//     if (localStorage.getItem('live') !== "") {
//         loadMessage();
//     }
// }, 1000);
