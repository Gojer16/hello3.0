const axios = require('axios');

async function getAllBooks() {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log(response.data);
    } catch (error) {
        console.error(error.message);
    }
}


getAllBooks();
