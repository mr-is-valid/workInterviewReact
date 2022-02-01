const headers = {
    "Accept" : "application/json",
    "Content-Type" : "application/json"
};


function joinURL(baseURL, url){
    return `${baseURL}/${url}`;
}


class NasaService{
    constructor(){
        this.domain = "https://data.nasa.gov/resource/y77d-th95.json";
    }

    request(url, method="POST", data=null){
        url = joinURL(this.domain, url);

        const options = {
            headers,
            method,
        }

        if(data){
            options.body = JSON.stringify({...data});
        }
        return fetch(url, options);
    }

    post(url , data){
        const method = 'POST';
        return this.request(url, method, data).then((res) =>{
            console.log(res);
        });
    }

    get(url){
        const method = 'GET';
        return this.request(url, method, data).then((res) =>{
            console.log(res);
        });
    }
}

export default NasaService;