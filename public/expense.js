// const { response } = require("express");

const dataa = document.querySelector("#dataa");

const token = localStorage.getItem("token");

axios
  .get("/admin/expense", {
    headers: {
      Authorization: token,
    },
  })
  .then((response) => {
    const { user, expenses } = response.data;

    // Show premium user text
    if (user.isPremium) {
      const isPremiumDiv = document.getElementById("isPremium");
      isPremiumDiv.innerHTML = "Premium User";
    }

    // showing showLeaderboard features button
    if (user.isPremium) {
      const premiumFeatures = document.getElementById("showLeaderboard");
      premiumFeatures.classList.remove("hidden");
    }

    // show download pdf button

    if (user.isPremium) {
      const downloadPdf = document.getElementById("downloadPdf");
      downloadPdf.classList.remove("hidden");
    }

    // Remove button if user is premium
    if (user.isPremium) {
      const rzpButton = document.getElementById("rzp-button1");
      rzpButton.parentNode.removeChild(rzpButton);
    }

    dataa.innerHTML = `
      <table class="table table-bordered">
        <thead class="thead-dark">
          <tr>
            <th>ID</th>
            <th>Price</th>
            <th>Name</th>
            <th>Category</th>
            <th>Delete</th>
            <th>Premium</th>
          </tr>
        </thead>
        <tbody>
          ${expenses
            .map(
              (expense) => `
            <tr>
              <td>${expense.id}</td>
              <td>${expense.expenseamount}</td>
              <td>${expense.description}</td>
              <td>${expense.category}</td>
              <td>
                <button class="btn btn-danger" onclick="deleteUser(event, ${
                  expense.id
                })">Delete</button>
              </td>
              <td>${user.isPremium ? "Premium User" : "Regular User"}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  });

  const downloadPdf = () => {
    const token = localStorage.getItem("token");
    axios
      .get("/admin/expense", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data.expenses);
  
        var docDefinition = {
          content: [
            { text: 'Expense', style: 'header', alignment: 'center' },
            // { text: 'Expenses', style: 'subheader', alignment: 'left' },
            {
              table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', 'auto'],
                body: [
                  ['Expense Amount', 'Description', 'Category', 'Created At'],
                  ...response.data.expenses.map(expense => [expense.expenseamount, expense.description, expense.category, expense.createdAt])
                ]
              }
            }
          ],
          styles: {
            header: {
              fontSize: 16,
              bold: true,
              margin: [0, 0, 0, 10]
            },
            subheader: {
              fontSize: 14,
              bold: true,
              margin: [0, 10, 0, 5]
            }
          }
        };
  
        // Generate the PDF
        var pdfDocGenerator = pdfMake.createPdf(docDefinition);
  
        // Download the PDF
        pdfDocGenerator.download('expenses.pdf');
      });
  };
  
  
const showLeaderBoard = () => {
  // Perform GET request to "/premium/leaderboard"
  axios
    .get("/premium/leaderboard")
    .then((response) => {
      const leaderboardData = response.data;
      const leaderboard = document.getElementById("leaderboard");
      leaderboard.innerHTML = `
        <table class="table table-bordered">
          <thead class="thead-dark">
            <tr>
              <th>Name</th>
              <th>Total Expense</th>
            </tr>
          </thead>
          <tbody>
            ${leaderboardData
              .map(
                (entry) => `
              <tr>
                <td>${entry.name}</td>
                <td>${entry.totalExpense}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `;
    })
    .catch((error) => {
      console.error("Error retrieving leaderboard:", error);
    });
};

const postExpense = () => {
  const money = document.getElementById("money").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;

  axios
    .post(
      "/admin/expense",
      { money, description, category },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    )
    .then((response) => {
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
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code outside the 2xx range
        alert("Error during login: " + error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        alert("No response received from the server");
      } else {
        // Something happened in setting up the request that triggered an error
        alert("Error during login: " + error.message);
      }
    });
};

// const token = localStorage.getItem('token');

function deleteUser(event, id) {
  event.stopPropagation();

  axios
    .delete(`/admin/expense/${id}`, {
      headers: {
        Authorization: token, // Include the token in the Authorization header
      },
    })
    .then(() => {
      console.log(id);
      console.log("tttttttttttttttttttttttttttttttttttttt");
      window.location.reload();
    })
    .catch((err) => {
      alert("Error deleting user: " + err.message);
    });
}

function buyPremium() {
  const token = localStorage.getItem("token");
  if (token) {
    axios
      .get("/admin/buypremium", {
        headers: { Authorization: token },
      })
      .then((response) => {
        const options = {
          key: response.data.key_id,
          name: "Acme Corp",
          description: "Test Transaction",
          order_id: response.data.order.orderId,
          handler: function (response) {
            //   setPremium();
            alert("ou are a premium user");
            window.location.reload();

            axios
              .post(
                "/admin/buypremium",
                {
                  orderId: options.order_id,
                  paymentId: response.razorpay_payment_id,
                  status: "success",
                },
                { headers: { Authorization: token } }
              )
              .then(() => {
                // Success handling code
              })
              .catch((error) => {
                // Error handling code
                console.error(error);
              });
          },
        };

        const razorpay = new Razorpay(options);
        razorpay.open();
        razorpay.on("payment.failed", (response) => {
          axios
            .post(
              "/admin/buypremium",
              {
                orderId: options.order_id,
                paymentId: response.error.metadata.payment_id,
                status: "failed",
              },
              { headers: { Authorization: token } }
            )
            .then(() => {
              // Failure handling code
              alert(response.error.description);
            })
            .catch((error) => {
              // Error handling code
              console.error(error);
            });
        });
      })
      .catch((error) => {
        // Error handling code
        console.error(error);
      });
  }
}
