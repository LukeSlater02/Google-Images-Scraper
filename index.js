const puppeteer = require('puppeteer')
var fs = require('fs')
const Axios = require('axios')
const path = require('path')
const sharp = require('sharp')

// async function resize(imageName){
//     sharp(`images/${imageName}.jpg`).resize(128, 128).toFile(`images/${imageName}_thumbnail.jpg`)
// }

async function download(url, imageName) {
    const downloadPath = path.resolve(__dirname, 'images', `${imageName}.jpg`)

    const response = await Axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
    })

    Axios.get(url, { responseType: 'arraybuffer' }).then((res) => {
        return sharp(res.data)
            .resize(128, 128, {
                fit: 'inside',
            })
            .toFile(`images/${imageName}.jpg`)
    })

    //response.data.pipe(fs.createWriteStream(downloadPath))

    // return new Promise((resolve, reject) => {
    //     response.data.on('end', () => {
    //         sharp(`images/${imageName}.jpg`).resize(128, 128, {
    //             fit: 'inside',
    //         }).jpeg().toFile(`images/${imageName}_thumbnail.jpg`).then(() => resolve())
    //     })
    //     response.data.on('error', err => {
    //         reject(err)
    //     })
    // })
}

async function start(searchString) {

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(`https://www.google.com/search?q=${searchString}`)

    // const names = await page.evaluate(() => {
    //     return Array.from(document.querySelectorAll(".OztcRd")).map(title => title.textContent)
    // })
    // await fs.writeFile("scrapedImageTitles.txt", names.join("\r\n"))

    //uses an html class to select all html elements and format them into an array and then passes that data into the function
    // const images = await page.$$eval(".hdtb-mitem a", (sectionAnchor) => {
    //     return sectionAnchor.map(section => section.href)
    // })
    let imagesSectionUrl = await page.evaluate(() => {
        let searchSections = Array.from(document.querySelectorAll(".hdtb-mitem a")).map(anchor => anchor.href)
        return searchSections.find(e => e.includes("&tbm=isch"))
    })
    await page.goto(imagesSectionUrl)

    // let divsToBeClicked = await page.evaluate(() => {
    //     return Array.from(document.querySelectorAll(".isv-r")).map(div => div.getAttribute('class')).slice(0, 12)
    // })

    //let divsToBeClicked = await page.$$('#islrg > div.islrc')
    let divsToBeClicked = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('#islrg > div.islrc > div')).map(ele => ele.getAttribute('data-id')).slice(0, 12)
    })

    for (const div of divsToBeClicked) {
        const singleDiv = await page.evaluate(el => el, div)
        page.waitForXPath('//*[@id="islrg"]/div[1]/div[1]/@data-id')
        await page.click(`div[data-id="${singleDiv}"]`)
        await page.waitForSelector('.n3VNCb.KAlRDb')
        let imageUrl = await page.evaluate(() => {
            return document.querySelector('.n3VNCb.KAlRDb').src
        })
        let imageName = await page.evaluate(() => {
            return document.querySelector('.n3VNCb.KAlRDb').alt.replaceAll(/[^a-zA-Z0-9]/g, '_');
        })
        await download(imageUrl, imageName)
        //await resize(imageName)
        await page.goBack()
    }


    await browser.close()

}

start("master chief")