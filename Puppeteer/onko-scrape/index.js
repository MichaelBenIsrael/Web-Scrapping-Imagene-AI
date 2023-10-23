// Add required packages
const puppeteer = require('puppeteer');
const fs = require("fs");


// declare the target url for the inital OnkoKB scrape
const url_to_scrape = 'https://www.oncokb.org/actionable-genes#sections=Tx';

// declare the OnkoKB base url
const base_url = 'https://www.oncokb.org';



// main wrapper
(async () => {

    // create a browser instance
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false
    });


    // create a page instance
    const page = await browser.newPage();

    // navigate to the target URL
    await page.goto(url_to_scrape);
    
    // wait until the page is fully loaded
    await new Promise(r => setTimeout(r, 2100));

    // read the handler of the desired element
    const genesHandles = await page.$$('.rt-tbody');

   // define a variable to hold the raw data
    let table_raw_data = '';

    //loop thru handlers to read their data
    for(const genehandle of genesHandles){

        table_raw_data += await page.evaluate(el => el.innerHTML, genehandle)
    }

    // clean the raw data
    slice_index = table_raw_data.indexOf('/gene/')
    sliced_raw_data = table_raw_data.slice(slice_index)
    table_cells_list = sliced_raw_data.split('<a href=')

    table_cells_list.forEach((element, index) => {
        table_cells_list[index] = element.split('</a>')[0];
      });
    
    
    // store data into objects - 'key': 'url'
    let gene_map = new Map();
    let alterations_map = new Map();

    
    for (let i = 0; i < table_cells_list.length; i++){
        key = table_cells_list[i].split('>')[1].replaceAll('"','')
        url = table_cells_list[i].split('>')[0].replaceAll('"','').replaceAll(' ', '%20') // remove spaces

        if(key.includes("Exon") || key.includes("other alterations")){
            continue

        }else if(url.split('/').length == 3){
            gene_map[key] = base_url + url;

        }else{
            alterations_map[key] = base_url + url;
        }
    }

    // close the browser
    await browser.close();

    // convert Alterations object into a Map
    alterations_map = new Map(Object.entries(alterations_map));

    console.log('\n\nSuccessfully extracted the Gene and Alterations urls')
    console.log('.\n.\n.\n.\n')
    await new Promise(r => setTimeout(r, 1500));

                                

    // create a jason file that will contain the final output
    fs.writeFileSync('gene-alterations-combined.json', JSON.stringify({"genes_and_variants":[]}))


    // navigate thru each Alterations URL
    for (let alteration_url of alterations_map.values()) {
        console.log('Navigating to: ' + alteration_url + '\n.\n.\n.')

        // create a browser instance
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: false
        });

        
        // create a page instance
        const page = await browser.newPage();

        // navigate to the target URL
        await page.goto(alteration_url);
        
        // wait until the page is fully loaded
        await new Promise(r => setTimeout(r, 1000));

        // extract data from the alteration url
        let gene = alteration_url.split('org/')[1].split('/')[1]
        let variant = alteration_url.split('org/')[1].split('/')[2]

        // build relevent XHR calls url
        const gene_xhr_call = "https://www.oncokb.org/api/private/utils/numbers/gene/" + gene
        const variant_xhr_call = 'https://www.oncokb.org/api/v1/variants/lookup?hugoSymbol=' + gene + '&variant=' + variant
        
        
        // handle the relevant XHR calls
        page.on('response', async (response) => {
            if(response.url().includes(gene_xhr_call)){
                const file_data = fs.readFileSync('./gene-alterations-combined.json');
                const jsn_file_data = JSON.parse(file_data);
                jsn_file_data.genes_and_variants.push({
                    'gene': gene,
                    'url': gene_map[gene],
                  });
                fs.writeFileSync('./gene-alterations-combined.json', JSON.stringify(jsn_file_data, null, 2));
                console.log('Succesfully added Gene: "' + gene + '" to jason file');

            } else if(response.url().includes(variant_xhr_call)){
                variant = variant.replaceAll('%20', ' ')
                const file_data = fs.readFileSync('./gene-alterations-combined.json');
                const jsn_file_data = JSON.parse(file_data);
                jsn_file_data.genes_and_variants.push({
                'variant': variant,
                'url': alterations_map.get(variant),
                });
                fs.writeFileSync('./gene-alterations-combined.json', JSON.stringify(jsn_file_data, null, 2));
                console.log('Succesfully added Variant: "' + variant + '" to jason file');
            }
        });

        // reload the page (must be done in order to trigger XHR calls)
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

        await new Promise(r => setTimeout(r, 1500));
        console.log('\n\n')
        
        // close the browser
        await browser.close();
        }
})();