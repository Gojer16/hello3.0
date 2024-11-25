const axios = require('axios');

async function searchByTitle(title) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        console.log(response.data);
    } catch (error) {
        console.error(error.message);
    }
}

searchByTitle('Things Fall Apart'); 

