import { IMusicChart } from "./datasource"
const chalk = require('chalk')

// Data body of output
export interface IResult {
    player: string
    musicList: {
        legacy: Array<IMusicChart>
        current: Array<IMusicChart>
    }
    oldRating: number
    newRating: {
        legacy: number
        current: number
        total: number
    }
}

// Set rate dictionary and style
const rate: Record<string, string> = {
    d: "D",
    c: "C",
    b: chalk.blue("B"),
    bb: chalk.blue("BB"),
    bbb: chalk.blue("BBB"),
    a: chalk.red("A"),
    aa: chalk.red("AA"),
    aaa: chalk.red("AAA"),
    s: chalk.yellow("S"),
    sp: chalk.yellow("S+"),
    ss: chalk.yellow("SS"),
    ssp: chalk.yellow("SS+"),
    sss: chalk.bgYellow.black("SSS"),
    sssp: chalk.bgYellow.black("SSS+")
}

// Set badge dictionary and style
const badge: Record<string, string> = {
    fc: chalk.green("[FULL COMBO]"),
    fcp: chalk.green("[FULL COMBO+]"),
    ap: chalk.yellow("[ALL PERFECT]"),
    app: chalk.yellow("[ALL PERFECT+]"),
    fs: chalk.cyan("[FULL SYNC]"),
    fsp: chalk.cyan("[FULL SYNC+]"),
    fsd: chalk.yellow("[FULL SYNC DX]"),
    fsdp: chalk.yellow("[FULL SYNC DX+]")
}

// Set chart type dictionary and style
const chartType: Record<string, string> = {
    SD: chalk.bgCyan.black(' 标准 '),
    DX: chalk.bgGreen.black(' DX ')
}

// Parse difficulty and level for each chart
function parseDifficulty(difficulty: string, level: string): string {
    switch (difficulty) {
        case 'Basic':
            return chalk.green(`${difficulty} Lv.${level}`)
        case 'Advanced': 
            return chalk.yellow(`${difficulty} Lv.${level}`)
        case 'Expert':
            return chalk.red(`${difficulty} Lv.${level}`)
        case 'Master':
            return chalk.magenta(`${difficulty} Lv.${level}`)
        case 'Re:MASTER':
            return chalk.bgMagenta.black(` ${difficulty} Lv.${level} `)
        default:
            return `${difficulty} Lv.${level}`
    }
}

// Parse rating color
function parseRaColor(rating: number): string {
    let color = "Rainbow"
    if (rating < 1000) {
        color = "White"
    } else if (rating < 2000) {
        color = "Blue"
    } else if (rating < 4000) {
        color = "Green"
    } else if (rating < 7000) {
        color = "Yellow"
    } else if (rating < 10000) {
        color = "Red"
    } else if (rating < 12000) {
        color = "Purple"
    } else if (rating < 13000) {
        color = "Bronze"
    } else if (rating < 14000) {
        color = "Silver"
    } else if (rating < 14500) {
        color = "Gold"
    } else if (rating < 15000) {
        color = "Platinum"
    }
    return color
}

// Set output style and traverse music chart array
function printMusicList(list: Array<IMusicChart>): void {
    console.log(`--------------------------------\n`)
    list.forEach((music: IMusicChart) => {
        console.log(`${chartType[music.type]} ${music.title}\n`)
        let additionalMsg: string = ''
        if (music.fc !== "") {
            additionalMsg += `${badge[music.fc]} `
        }
        if (music.fs !== "") {
            additionalMsg += `${badge[music.fs]} `
        }
        if (additionalMsg === '') {
            additionalMsg = '-'
        }
        console.log(`等级：${parseDifficulty(music.level_label, music.level)} | 定数：${music.ds}\n`)
        console.log(`达成率：${music.achievements.toFixed(4)}% ${rate[music.rate]} -> Rating: ${music.ra}\n`)
        console.log(`其他信息：${additionalMsg}\n`)
        console.log(`--------------------------------\n`)
    })
}

// Output to console
export function printResult(params: IResult): void {
    console.log(`玩家: ${params.player}\n`)
    console.log(`旧算法 Rating: ${params.oldRating}\n`)
    console.log(`\n========== [旧版本曲目列表] ==========\n`)
    printMusicList(params.musicList.legacy)
    console.log(`\n========== [当前版本曲目列表] ==========\n`)
    printMusicList(params.musicList.current)
    console.log(`\n========== [小结] ==========\n`)
    console.log(`新算法 Rating: ${params.newRating.legacy} (旧版本曲目) + ${params.newRating.current} (当前版本曲目) = ${params.newRating.total}\n`)
    console.log(`Rating 颜色："${parseRaColor(params.newRating.total)}"\n`)
    console.log(`剩余 ${(15000 - params.newRating.total)} Rating 可换色为"Rainbow"\n\n`)
}
