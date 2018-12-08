// 解析 URL 中的 queryString，返回一个对象
// 返回值示例：
// {
//   name: 'coder',
//   age: '20'.
//   callback: 'https://youzan.com?name=test'
// }
const testURL = 'https://www.youzan.com?name=coder&age=20&callback=https%3A%2F%2Fyouzan.com%3Fname%3Dtest&arr[]=1&arr[]=2';

function parseQueryString(url) {
    let temp = url.split('?')
    let arr = temp[1].split('&')
    let paramObj = {}
    arr.map(item => {
        let temp = item.split('=')
        // paramObj[a] = b;
        let decodeTemp = decodeURIComponent(temp[1])
        // console.log(temp)
        let key = temp[0];

        if(key.indexOf('[]') > -1){
            key = key.slice(0, key.length - 2)
            const keys = Object.keys(paramObj)
            if(keys.indexOf(key) > -1){
                paramObj[key].push(temp[1])
            }else{
                paramObj[key] = [temp[1]]
            }
        }else{
            paramObj[temp[0]] = decodeTemp
        }
        
    })
    console.log(paramObj)
    return paramObj;
}

parseQueryString(testURL)

// list=[]&obj={}

/**
 * promise
 * 
 */

/**
 * images: array
 */

function showImage(imgUrl) {
    let img = new Image()
    img.src = url

    return new Promise(resolve => {
        img.onload = () => resolve()
    })
}

function showImages(imgs) {
    imgs.map(item => {
        showImage(item)
    })
}

showImages('xxx').then(() => {
    showxx
})


// // showImages(images).then(() => {

// })
