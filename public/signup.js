const postSignup= () => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(name, email, password);
  
    axios
      .post('./admin/signup', { name, email, password }, {
        headers: { 'Content-Type': 'application/json' }
      })
      .then(() => {
        alert('User created successfully');
        // window.location.reload(); 
        window.location.href = "/login";

      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code outside the 2xx range
          alert('Error creating user: ' + error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          alert('No response received from the server');
        } else {
          // Something happened in setting up the request that triggered an error
          alert('Error creating user: ' + error.message);
        }
      });
  };
  

  const signupp= document.getElementById("signupp");

  signupp.addEventListener('click',postSignup);