const express = require('express')
const axios = require('axios')
const https = require('https');

const app = express()
const port = 3000
const url = "https://localhost:44318/api/cache/";

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
  })

const getCacheRedisAPI = (key) => {
    axios.get(
        url+key, 
        { httpsAgent }
    ).then((res) => { 
        console.log("Response GET API : " + JSON.stringify(res.data))
        return JSON.stringify(res.data)
    }).catch(() => {  
        return null
    })
}   

const setCacheRedisAPI = (key, value) => {
    axios.post(
        url,
        { 
            "Key": key,
            "Values": value,
            "ExpirationTimeSeconds": 60
        },
        { httpsAgent }
    ).then((res) => { 
        console.log("Response POST API : " + JSON.stringify(res.data))
        return JSON.stringify(res.data)
    }).catch((err) => { 
         console.log("Error POST API : " + err) 
         return null 
    })
}

const dbViaCep = (id) => {
    /*axios({
        method: 'get',
        url: 'https://viacep.com.br/ws/'+id+'/json/',
        responseType: 'json'
    })
    .then((res) => { return res.data })
    .catch(() => { return null })*/
    return axios.get(
        'https://viacep.com.br/ws/'+id+'/json/', 
        { httpsAgent }
    ).then((res) => { 
        console.log("Response VIACEP API : " + JSON.stringify(res.data))
        return JSON.stringify(res.data)
    }).catch((err) => { 
        console.log("Error VIACEP API : " + err) 
        return null
    })
}

app.get('/', (request, response) => {
    response.send('OK')
})

/*app.get('/get/:id', async(request, response) => {
    var id = request.params.id
    var key = 'cep' + id

    var value = getCacheRedisAPI(key)
    console.log("Value: " + value)
    
    if(value != undefined && value != null){ 
        response.send('Return from cache: ' + value)
    } else {
        console.log("Id: " + id)
        var idValue = dbViaCep(id)
        
        console.log("RESP -IdValue: " + idValue)

        if(idValue != null){
            setCacheRedisAPI(key, JSON.stringify(idValue))
            response.send('Return from ViaCEP: ' + JSON.stringify(idValue))
        }
        else response.send('CEP not exist')
    }
})*/

app.get('/get/:id', async(request, response) => {
    var id = request.params.id
    var key = 'cep' + id

    axios.get(
        url+key, 
        { httpsAgent }
    ).then((res) => { 
        var value = JSON.stringify(res.data)
        console.log("Value: " + value)
        response.send('Response GET API : ' + value)

    }).catch((err) => {  
        console.log("-- Error GET API : " + err)

        axios.get(
            'https://viacep.com.br/ws/'+id+'/json/', 
            { httpsAgent }
        ).then((res) => {
            var idValue = JSON.stringify(res.data)
            console.log("RESP -IdValue: " + idValue)

                axios.post(
                    url,
                    { 
                        "Key": key,
                        "Values": idValue,
                        "ExpirationTimeSeconds": 60
                    },
                    { httpsAgent }
                ).then((res) => { 
                    console.log("Response POST API : " + JSON.stringify(res.data))
                    response.send('Return from ViaCEP: ' + JSON.stringify(idValue))

                }).catch((err) => { 
                     console.log("Error POST API : " + err) 
                     return null 
                })

        }).catch((err) => { 
            response.send('CEP not exist')
        })
    })

})

app.listen(port, () => console.log('\nRunning:\n\t - Express\n\t - Axios'))
