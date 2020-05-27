const express = require('express')
const app = express()
const redis = require('redis')
const redisClient = redis.createClient();

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
        redisClient.set(key, value, 'OK', 10, (err) => {
            if(err){
                reject(err)
            } else {
                resolve(true)
            }
        })
    })
}


const dbViaCep = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(true))
    })
}

app.get('/get/:id', async(request, response) => {
    const id = request.params.id

    const value = await getCacheRedis('get'+id)

    if(value){
        response.send('Return from cache: ' + value)
    } else {
        const idValue = await dbViaCep(id)
        await setCacheRedis('get'+id, idValue)

        response.send('Return from ViaCep: ' + idValue)
    }
})

app.listen(port, () => console.log('running...'))

