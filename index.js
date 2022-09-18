const puppeteer = require('puppeteer')
const fs = require('fs/promises')
const client = require('https')

async function start(searchString) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(`https://www.google.com/search?q=${searchString}&sxsrf=ALiCzsYVk_Rwn0zrwBqz6oiN5EaRzdYr3g%3A1663448119014&source=hp&ei=NjQmY66fOLngkPIPwLu-8AQ&iflsig=AJiK0e8AAAAAYyZCR0FlER0NZYY98nhL69yOAkUS4U4j&ved=0ahUKEwiukuyR25z6AhU5MEQIHcCdD04Q4dUDCAk&uact=5&oq=${searchString}&gs_lcp=Cgdnd3Mtd2l6EAMyCwguEIAEELEDENQCMgsILhCABBCxAxDUAjIICC4QgAQQsQMyBQgAEIAEMgsILhCABBCxAxDUAjIICAAQgAQQsQMyCAgAEIAEELEDMggIABCABBCxAzIICAAQgAQQsQMyBAgAEEM6BAgjECc6CwgAEIAEELEDEIMBOhEILhCABBCxAxCDARDHARDRAzoLCC4QgAQQsQMQgwE6BQgAEJECOgcILhDUAhBDOggIABCxAxCDAToICAAQgAQQyQM6BQgAEJIDOgoILhCxAxDUAhBDOggILhCxAxDUAjoLCC4QgAQQxwEQrwFQAFi1B2DOCGgAcAB4AIABywGIAb8LkgEFMC45LjGYAQCgAQE&sclient=gws-wiz`)

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
        page.goBack()
    }


    await browser.close()

}

start("watermelon")