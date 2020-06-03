const express = require('express')
const redis = require('redis')
const axios = require('axios')

const app = express()
const redisClient = redis.createClient(6379, '127.0.0.1');

const port = 3000

const getCacheRedisAPI = (key) => {
    return axios({
        method: 'get',
        url: 'https://localhost:5001/api/cache/'+key+'',
        responseType: 'json'
    })
    .then((res) => { return res })
    .catch(() => { return null })
}   

const setCacheRedisAPI = (key, value) => {
    return axios({
        method: 'post',
        url: 'https://localhost:5001/api/cache',
        data: { 
            "Key": JSON.stringify(key),
            "Values": JSON.stringify(value),
            "ExpirationTimeSeconds": 30
        }
    })
    .then((res) => { return res })
    .catch(() => { return null })
}

const dbViaCep = (id) => {
    return axios({
        method: 'get',
        url: 'https://viacep.com.br/ws/'+id+'/json/',
        responseType: 'json'
    })
    .then((res) => { return res.data })
    .catch(() => { return null })
}

app.get('/', (request, response) => {
    response.send('OK')
})

app.get('/get/:id', async(request, response) => {
    let id = request.params.id
    let key = 'cep' + id
    let value = await getCacheRedisAPI(key)

    if(value) response.send('Return from cache: ' + value)
    else {
        let idValue = await dbViaCep(id)
        if(idValue != null){
            await setCacheRedisAPI(key, idValue)
            response.send('Return from ViaCEP: ' + idValue)
        }
        else response.send('CEP not exist')
    }
})

app.listen(port, () => console.log('\nRunning:\n\t - Express\n\t - Redis\n\t - Axios'))
redisClient.on('error', (error) => {
    console.log('Error in Redis: ' + error)
})
