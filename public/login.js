const postLogin = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(email, password);
  
    axios
      .post('/admin/login', { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => {
        // Extract the email from the response
        const token = response.data.token;
        // const email = response.data.email;
        
        // Store the email in local storage
        localStorage.setItem('token', token);
        // localStorage.setItem('email', email);
  
        alert('Login successful');
        // Perform any necessary actions after successful login
        // For example, redirect to a new page
        window.location.href = "/expense";
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code outside the 2xx range
          alert('Error during login: ' + error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          alert('No response received from the server');
        } else {
          // Something happened in setting up the request that triggered an error
          alert('Error during login: ' + error.message);
        }
      });
  };
  