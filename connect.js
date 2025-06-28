
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('calculationForm');

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    const inputData = document.getElementById('inputData').value;
    
    fetch('https://your-backend-name.onrender.com/api/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputData: inputData,  // Replace with actual data
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);  // Handle the response
        document.getElementById('result').textContent = JSON.stringify(data, null, 2); 
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
});
