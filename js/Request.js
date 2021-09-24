
export function serverRequest(url, type, contentType, data = {}) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: url,
            type: type,
            contentType: contentType,
            data: data,
        }).then(x => {
            resolve(x);
        }).catch(err => {
            console.log(err);
            reject(err);
        })
    })
}
