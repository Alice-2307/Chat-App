const login = document.getElementById("login");
const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");


login.addEventListener("submit", async (e) => {
    try {
        e.preventDefault();
        const logindata = {
            email: email.value,
            password: password.value
        }
        localStorage.setItem('username',email.value)
        const result = await axios.post("http://localhost:5000/login", logindata);
        document.cookie = `token=${result.data.token}`
        alert("Login successfully");
        window.location.href = "./chat.html";

    } catch (error) {
        if (error.response !== undefined && (error.response.status === 401 || error.response.status === 404 || error.response.status === 500)) {
            alert(`${error.response.data.Error}`);
        }
        else {
            message.textContent = `Error: ${error.message}`
        }
    }
})
