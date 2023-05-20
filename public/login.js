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
  



  function sendResetLink() {
    var resetEmail = document.getElementById("resetEmail").value;
    // Perform the necessary actions to send the reset link
    // For example, you can use axios to make a request to your backend API
    axios.post("/password/forgotpassword", { email: resetEmail })
      .then(function (response) {
        // Handle the response after sending the reset link
        console.log(response.data);
        // Close the modal
        $("#resetPasswordModal").modal("hide");
        // Display a success message
        alert("Reset link sent successfully!");
      })
      .catch(function (error) {
        // Handle any errors that occurred during the request
        console.log(error);
        // Display an error message to the user
        alert("Failed to send reset link. Please try again.");
      });
  }