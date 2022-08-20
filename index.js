

const get = require('./api.js');
const axios = require('axios');

const BASE_URL = 'https://code-malayalam.github.io/school-test-api/';


function getAllStudentsForClassTeacher3(cls) {
    return axios(`${BASE_URL}/class/${cls}.json`)
        .then((response) => {
            console.log('PPPP', response.data);
            const classTeacher = response.data.classTeacher;
            return axios(`${BASE_URL}/staff/${classTeacher}.json`);
        })
        .then((response) => {
            const classes = response.data.classes;
            const promiseArr = classes.map((item) => {
                return axios(`${BASE_URL}/class/${item}.json`)
            });
            return Promise.all(promiseArr);
        })
        .then((responseArr) => {
            return responseArr.reduce((total, item) => {
                return total+item.data.numberOfStudents;
            }, 0);
        })
        .then((data) => {
            console.log('QQQQ', data);
        });
}


async function getAllStudentsForClassTeacher(cls) {

    const res1 = await axios(`${BASE_URL}/class/${cls}.json`);
    const classTeacher = res1.data.classTeacher;
    const res2 = await axios(`${BASE_URL}/staff/${classTeacher}.json`);
    const classes = res2.data.classes;

    const promiseArr = classes.map((item) => {
        return axios(`${BASE_URL}/class/${item}.json`)
    });

    const resArr = await Promise.all(promiseArr);
    const sum = resArr.reduce((total, item) => {
        return total+item.data.numberOfStudents;
    }, 0);

    return sum;
}


function getAllStudentsForClassTeacher2(cls, successFn, errorFn) {
    get(`${BASE_URL}/class/${cls}.json`, (data) => {
        const classTeacher = data.classTeacher;
        get(`${BASE_URL}/staff/${classTeacher}.json`, (data) => {
            const classes = data.classes;
            let count = 0;
            let sum = 0;
            let error = false;
            for (let i = 0; i < classes.length; i++) {
                const element = classes[i];
                
                get(`${BASE_URL}/class/${element}.json`, (data) => {
                    count++;
                    sum += data.numberOfStudents;
                    if(!error && count === classes.length) {
                        successFn(sum);
                    }
                }, (err) => {
                    if(error === false) {
                        errorFn(err);
                        error = true;
                    }
                    
                    
                });
                
            }
        }, errorFn)
    }, errorFn)
}

getAllStudentsForClassTeacher('10c', (data) => {
    console.log('RESULT', data);
}, (err) => {
    console.log(err);
});