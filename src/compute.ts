import { AxiosError, AxiosPromise, AxiosResponse } from "axios"
import { sumRa, updateRa } from "./functions"
import { IResult, printResult } from "./output"
import { getData, IMusicChart, IResponse } from "./datasource"
import config from "./app.config.js"

// Load user ID from config file
let username: string = config.userId as string
// Perform a API request
let request: AxiosPromise<IResponse> = getData(username)
request.then((res: AxiosResponse<IResponse>) => {
    // Request go well...
    let data: IResponse = res.data
    // Use new rating algorithm to update chart data
    let b35List: Array<IMusicChart> = updateRa(data.charts.sd)
    let b15List: Array<IMusicChart> = updateRa(data.charts.dx)
    // Calculate rating
    let b35: number = sumRa(b35List)
    let b15: number = sumRa(b15List)
    let rating: number = b35 + b15
    // Prepare data for output
    let params: IResult = {
        player: data.nickname,
        musicList: {
            legacy: b35List,
            current: b15List
        },
        oldRating: data.rating,
        newRating: {
            legacy: b35,
            current: b15,
            total: rating
        }
    }
    // Output b50 data
    printResult(params)
}).catch((err: AxiosError<unknown, unknown>) => {
    // Something wrong...
    if (err.response.status === 400) {
        // User doesn't exist
        console.error(`错误：玩家不存在\n`)
    } else if (err.response.status === 403) {
        // Can't get user data due to the privacy setting
        console.error(`错误：玩家设置了禁止他人查询成绩，请前往查分器修改隐私设置：\n`)
        console.error(`https://www.diving-fish.com/maimaidx/prober\n`)
    }
})
