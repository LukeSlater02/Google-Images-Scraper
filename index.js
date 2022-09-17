const puppeteer = require('puppeteer')

async function start(){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto("https://www.google.com/search?q=apple&tbm=isch&sxsrf=ALiCzsbnf3F8a_gCTI1LLwEXtX9RBxC61w%3A1663444308224&source=hp&biw=1278&bih=959&ei=VCUmY4j_B7LXkPIPiZ256Aw&iflsig=AJiK0e8AAAAAYyYzZN--FRBjenNypbH-AFHYmeiB-zNl&ved=0ahUKEwiI-dv4zJz6AhWyK0QIHYlODs0Q4dUDCAc&uact=5&oq=apple&gs_lcp=CgNpbWcQAzIICAAQgAQQsQMyCAgAEIAEELEDMggIABCABBCxAzIECAAQAzIICAAQgAQQsQMyCwgAEIAEELEDEIMBMgsIABCABBCxAxCDATIFCAAQgAQyBQgAEIAEMgsIABCABBCxAxCDAToHCCMQ6gIQJzoECCMQJzoICAAQsQMQgwFQ9xRYrhpg_hpoAXAAeACAAUyIAewCkgEBNZgBAKABAaoBC2d3cy13aXotaW1nsAEK&sclient=img")
    
    await page.screenshot({path: "ss.png"})

    await browser.close()
    
}

start()