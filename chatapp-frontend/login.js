const login = document.getElementById("login");
const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");


login.addEventListener("submit", async(e) => {
    try{
    e.preventDefault();
    const logindata = {
        email: email.value,
        password: password.value
    }
    await axios.post("http://localhost:5000/login", logindata);

} catch (error){
        console.log(error);
        message.textContent = `Something went wrong`
}
})
