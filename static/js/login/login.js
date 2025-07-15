document.getElementById('login').addEventListener('click', async function() {
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    const res= await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    })
    data= await res.json()
    if(data.navigate_dashboard){
        window.location.href= '/dashboard'
    }
})