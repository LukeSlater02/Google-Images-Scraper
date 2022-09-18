const puppeteer = require('puppeteer')
const Axios = require('axios')
const sharp = require('sharp')

async function download(url, imageName) {
    Axios.get(url, { responseType: 'arraybuffer' }).then((res) => {
        return sharp(res.data)
            .resize(128, 128, {
                fit: 'inside',
            })
            .toFile(`images/${imageName}.jpg`)
    })
}

async function start(searchString) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(`https://www.google.com/search?q=${searchString}`)

    let imagesSectionUrl = await page.evaluate(() => {
        let searchSections = Array.from(document.querySelectorAll(".hdtb-mitem a")).map(anchor => anchor.href)
        return searchSections.find(e => e.includes("&tbm=isch"))
    })
    await page.goto(imagesSectionUrl)

    let divsToBeClicked = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('#islrg > div.islrc > div')).map(ele => ele.getAttribute('data-id')).slice(0, 12)
    })

    for (const div of divsToBeClicked) {
        const singleDiv = await page.evaluate(el => el, div)
        page.waitForXPath('//*[@id="islrg"]/div[1]/div[1]/@data-id')
        await page.click(`div[data-id="${singleDiv}"]`)
        try {
            await page.waitForSelector('.n3VNCb.KAlRDb')
            let imageUrl = await page.evaluate(() => {
                return document.querySelector('.n3VNCb.KAlRDb').src
            })
            let imageName = await page.evaluate(() => {
                return document.querySelector('.n3VNCb.KAlRDb').alt.replaceAll(/[^a-zA-Z0-9]/g, '');
            })
            await page.goBack()
            await download(imageUrl, imageName)
        } catch (e) {
            await page.goBack()
            continue
        }
    }
    await browser.close()
}

start("wizard")