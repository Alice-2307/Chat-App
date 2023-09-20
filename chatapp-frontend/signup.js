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
        let result = await axios.post("http://localhost:5000/user/signup", signupdata);
        message.textContent = `${result.data.Message}`

    } catch (error) {
        console.log(error);
        if (error.response !== undefined) {
            message.textContent = `${error.response.data.Error}`
        }
        else {
            message.textContent = `Error: ${error.message}`
        }
    }
})