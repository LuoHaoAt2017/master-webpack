import { getLocation, uploadImageFromCamera } from '../../config/dingtalk-interface'
import H3PluginDeveloper from '../../lib/h3-plugins-developer'
import { getServerTimeStamp } from '../../service/get-data'
import store from '../../store'

/**
 * 使用钉钉拍照
 * @param {String} waterMark 是否有拍照水印，'true' or 'false'
 * @param {String} compression 是否压缩处理，'true' or 'false'
 * @returns Promise 参数为mediaId
 */
async function useDingPhoto(waterMark, compression) {
    //手动转下后台给的字符串boolean...
    if (compression == 'true') {
        compression = true
    } else {
        compression = false
    }
    if (waterMark == 'true') {
        // 钉钉v2.11.0之后支持拍照水印
        return await new Promise((resolve, reject) => {
            getStickers((stickers) => {
                uploadImageFromCamera((mediaId) => {
                    resolve(mediaId)
                }, compression, stickers)
            })
        })
    } else {
        return await new Promise((resolve, reject) => {
            uploadImageFromCamera((mediaId) => {
                resolve(mediaId)
            }, compression)
        })
    }
}

/**
 * 获取水印信息
 * @param {function} callback 信息回调
 */
function getStickers(callback) {
    const getTimeAsync = getServerTimeStamp()
    H3PluginDeveloper.IShowPreLoader('定位中')
    const timezoneOffset = new Date().getTimezoneOffset() // 手机所在地与UTC的时差
    const offset = (timezoneOffset * 60000) + (8 * 3600000)
    // 当前本地时区与东八区的时差
    getLocation(async (result) => {
        try {
            const response = await getTimeAsync
            H3PluginDeveloper.IHidePreLoader()
            if (response.Successful) {
                const serverTimestamp = response.ReturnData.TimeStamp
                // 先抵消本地时区与UTC的时差获取UTC时间，然后再加上北京东八区的时差
                const timeStamp = serverTimestamp + offset
                const now = new Date(timeStamp)
                const time = now.Format('hh:mm')
                const weekDay = now.getDay()
                const weekDayArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
                const dateWeather = `北京时间 ${now.Format('yyyy.MM.dd')} ${weekDayArr[weekDay]}`
                const username = store.state.UserInfo.userName
                const stickers = { time, dateWeather, username }
                const address = (result.location || result).address
                stickers.address = address || '未获取到定位信息'
                callback(stickers)
            }
        } catch (err) {
            H3PluginDeveloper.IHidePreLoader()
        }
    }, true, (err) => {
        H3PluginDeveloper.IHidePreLoader()
        if (err) {
            const stickers = { address: '未获取到定位信息' }
            callback(stickers)
        }
    })
}

/**
 * 上传图片
 * @param {object} fileItem 源文件对象信息
 * @param {string} baseUrl 上传接口前置Url
 * @param {string} callback 上传接口回调函数
 */
function uploadFile(fileItem, baseUrl, callback) {
    const fd = new FormData()
    if (typeof fileItem.sourceFile === 'string') {  //钉钉拍照上传
        fd.append('fileToUpload', null)
        send(fd, `${baseUrl}&FileID=${fileItem.guid}&MediaID=${fileItem.sourceFile.match(/([^/]+)$/)[1]}`)
    } else {    //普通本地图片(拍照或者相册)上传
        fd.append('FileID', fileItem.guid)
        fd.append('图片', fileItem.sourceFile)
        send(fd, baseUrl)
    }

    function send(fd, url) {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', url)
        xhr.send(fd)
        xhr.onreadystatechange = function (resp) {
            if (xhr.readyState == 4) {
                const resultObj = eval(`(${resp.target.responseText})`)
                if (xhr.status == 200) {
                    if (resultObj.State === 2 && resultObj.State === 3 && resultObj.State === 4) {
                        H3PluginDeveloper.IShowWarn('温馨提醒', resultObj.ResultStr)
                        return
                    }
                }
                //这里先默认后台在上传失败时也能返回正常resultObj
                callback(resultObj.State, {
                    AttachmentId: resultObj.AttachmentId,
                    ThumbnailUrl: resultObj.ThumbnailUrl,
                    state: resultObj.State //0:未上传完，1:已上传完, 2:单个文件超过大小限制，3：文件类型不匹配，4：超过附件问题限制，5：服务器错误
                })
            }
        }
    }
}

export {
    useDingPhoto,
    uploadFile
}

