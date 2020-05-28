const express = require('express')
const redis = require('redis')
const axios = require('axios')

const app = express()
const redisClient = redis.createClient(6379, '127.0.0.1');

const port = 3000

const getCacheRedis = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, value) => {
            if(err){
                reject(err)
            } else{ 
                resolve(value)
            }
        })
    })
}

const setCacheRedis = (key, value) => {
    return new Promise((resolve, reject) => {
        redisClient.set(key, value, (err) => {
            if(err){
                resolve(err)
            } else {
                resolve(true)
            }
        })
    })
}

const dbViaCep = (id) => {
    return axios({
        method: 'get',
        url: 'https://viacep.com.br/ws/'+id+'/piped/',
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
    let key = 'get' + id
    let value = await getCacheRedis(key)

    if(value) response.send('Return from cache: ' + value)
    else {
        let idValue = await dbViaCep(id)
        if(idValue != null){
            await setCacheRedis(key, idValue)
            response.send('Return from ViaCep: ' + idValue)
        }
        else response.send('Cep not exist')
    }
})

app.listen(port, () => console.log('\nRunning:\n\t - Express\n\t - Redis\n\t - Axios'))
redisClient.on('error', (error) => {
    console.log('Something went wrong: ' + error)
})
