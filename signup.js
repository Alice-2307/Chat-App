const signup = document.getElementById('signup')
const name = document.getElementById('name')
const email = document.getElementById('email')
const phonenumber = document.getElementById('phonenumber')
const password = document.getElementById('password')


signup.addEventListener('submit', (e) => {
    e.preventDefault();
    const signupdata ={
        name: name.value,
        email: email.vlaue,
        phonenumber: phonenumber.value,
        password: password.value,
    }
    alert("successfully signup")
})