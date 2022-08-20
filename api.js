const fetch = require('node-fetch');

function get(url, success = () => {}, error = () => {}) {
    fetch(url)
    .then((data) => {
        return data.json();
    })
    .then((data) => {
        success(data);
    })
    .catch((err) => {
        error(err);
    });
}

module.exports = get;
