const base = 'http://localhost:3000';//define the localhost

// function getAll to retrieve all the record in the storage
export function getAll(lastId = 0, pageSize = 20, isExpired = true) {
    const url = new URL('/storage/all', base);//define the url to the endpoint 
    url.searchParams.append('lastId', lastId);
    url.searchParams.append('pageSize', pageSize);
    url.searchParams.append('isExpired', isExpired ? 1 : 0);
    //call the fetch function 
    return fetch(url)
        .then((response) => response.json())
        .then((json) => {
            if (json.error) throw new Error(json.error)
            else return json;
        });
}



// function tp update expire
export function expireKey(key, expiryDate) {
    const url = new URL('/storage', base);//define the url to the endpoint 
    url.searchParams.append('key', key);
    url.searchParams.append('expiryDate', expiryDate);
    //call the fetch function 
    return fetch(url,{method: 'PUT'})
        .then((response) =>{
            if(response.ok){
                return {};//response body is empty on success
            }else{
                return response.json();
            }
        })
        .then((json) => {
            if (json.error) throw new Error(json.error)
            else return json;
        });
}
