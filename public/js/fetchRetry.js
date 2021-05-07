function wait(delay){
    return new Promise((resolve) => setTimeout(resolve, delay));
}

function FetchRetry(url, delay, tries, fetchOptions = {}, callback) {
    function onError(err){
        triesLeft = tries - 1;
        console.log(`tries left ${triesLeft}`)
        if(!triesLeft){
            throw err;
        }
        return wait(delay).then(() => FetchRetry(url, delay, triesLeft, fetchOptions, callback));
    }
    return fetch(url, fetchOptions).then(data => data.json()).then(data => {
      if (data.status == 1) {
        console.log(data);
        throw new Error("Route is still under review");
      }
      callback(data);
    }).catch(onError);
}