const signup = document.getElementById('signup')
const name = document.getElementById('name')
const email = document.getElementById('email')
const phonenumber = document.getElementById('phonenumber')
const password = document.getElementById('password')
const message = document.getElementById('message');

signup.addEventListener('submit', async (e) => {
    try {
        e.preventDefault();
        const signupdata = {
            name: name.value,
            email: email.value,
            phonenumber: phonenumber.value,
            password: password.value,
        }
        await axios.post("http://3.26.144.193:5000/signup", signupdata);
        alert("Successfully signed up");
        window.location.href = "./login.html";

    } catch (error) {
        if (error.response!== undefined && (error.response.status === 403 || error.response.status === 500)) {
            alert(`${error.response.data.Error}`);
        }
        else{
            message.textContent = `Error: ${error.message}`
        }
    }
})