# The New York Times Best Sellers Books

<p>Project Goal:</p>
Scrape the New York Times best sellers books site, collect the best sellers books from the last 2 years.
The project has been implemented by utilizing Multithreading for efficient execution.

### Project's Class Diagram:

![NYC_library_class_diagram](https://github.com/MichaelBenIsrael/Web-Scrapping-Imagene-AI/assets/73841983/fefa95c4-d651-430e-907c-5f420ec64adc)

### Project's Workflow:

![NYC_library_scrape_workflow](https://github.com/MichaelBenIsrael/Web-Scrapping-Imagene-AI/assets/73841983/d10a7ad2-d8a8-43bb-8ecb-472208d91db6)

### Programming
Programming Language: Python <br />
IDE: Jupyter Notebook

### Required packages:
- BeautifulSoup
- requests
- threading
- json

<br /><br />
# Puppeteer
<p> Project Goal:</p>
<p>Use Puppeteer framwork to scrape the OncoKB website for: </p>
<p>- Gene & Gene URL<br /> </p>
<p>- Alterations & Alterations URL<br /> </p>
<p>Finally, create a combined JSON file by waiting for responses<br /></p>
of the following XHR calls:<br /></p>
<p>- https://www.oncokb.org/api/private/utils/numbers/gene/{GENE} - gene field in combined JSON<br /></p>
<p>- https://www.oncokb.org/api/v1/variants/lookup?hugoSymbol={GENE}&variant={VARIANT} variant field in combined JSON<br /></p>


