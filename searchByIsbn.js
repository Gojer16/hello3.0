const axios = require('axios');

axios.get('http://localhost:5000/isbn/1')
    .then(response => console.log(response.data))
    .catch(error => console.error(error.message));
