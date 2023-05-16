const dataa = document.querySelector('#dataa');

const token = localStorage.getItem('token');

axios.get('/admin/expense', {
  headers: {
    'Authorization':  token
  }
})
.then(response => {
  dataa.innerHTML = `
    <table class="table table-bordered">
      <thead class="thead-dark">
        <tr>
          <th>ID</th>
          <th>Price</th>
          <th>Name</th>
          <th>Category</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        ${response.data.map(user => `
          <tr>
            <td>${user.id}</td>
            <td>${user.expenseamount}</td>
            <td>${user.description}</td>
            <td>${user.category}</td>
            <td>
              <button class="btn btn-danger" onclick="deleteUser(event, ${user.id})">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
});





const postExpense = () => {
    const money = document.getElementById("money").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
  
    axios
      .post('/admin/expense', { money, description,category }, {
        headers: {
             'Content-Type': 'application/json',
             'Authorization': token 

            }
      })
      .then(response => {
        // Extract the email from the response
        // const userEmail = response.data.email;
        
        // Store the email in local storage
        // localStorage.setItem('userEmail', userEmail);
  
        // alert('saved succesfull successful');
        window.location.reload();
        // Perform any necessary actions after successful login
        // For example, redirect to a new page
        // window.location.href = "/";
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
  

// const token = localStorage.getItem('token');

function deleteUser(event, id) {
  event.stopPropagation();

  axios.delete(`/admin/expense/${id}`, {
    headers: {
      'Authorization': token // Include the token in the Authorization header
    }
  })
    .then(() => {
      console.log(id);
      console.log("tttttttttttttttttttttttttttttttttttttt");
      window.location.reload();
    })
    .catch(err => {
      alert('Error deleting user: ' + err.message);
    });
}


  