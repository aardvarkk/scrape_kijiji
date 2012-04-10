geocode = "http://maps.googleapis.com/maps/api/geocode/xml?"

def create_tables(c):
    c.execute('''CREATE TABLE IF NOT EXISTS listings (guid TEXT PRIMARY KEY, link TEXT, pubdate TEXT, address TEXT, price REAL, lat REAL, lng REAL)''')

# take the link and use it to get the price and address
def get_listing_details(link, geocode):
    
    # set up the dictionary with default values
    details = {'address': None, 'price': None, 'lat': None, 'lng': None}
    
    # grab the soup from the link
    import BeautifulSoup;
    import urllib;
    soup = BeautifulSoup.BeautifulSoup(urllib.urlopen(link).read())

    for tr in soup.find(id="attributeTable").findAll("tr"):
        
        # get all the table data for this row
        tds = tr.findAll("td")
        
        # hope we have some!
        if not tds:
            continue
        
        # don't care about nothing burger tds
        if tds[0].string == None:
            continue

        # debug
#        for i,v in enumerate(tds):
#            print i, v
        
        # price
        if tds[0].string.strip() == "Price":
            # make sure it has a strong child, because if not, it's "please contact"
            if tds[1].find("strong") != None:
                # rip out the dollar sign and any commas
                details['price'] = float(tds[1].find("strong").string.replace('$','').replace(',',''))
                # print details['price']
            
        # address
        if tds[0].string.strip() == "Address":
            # remove any non-ascii characters from the address in case anybody puts weird charcters
            # in the address box on the page
            details['address'] = tds[1].contents[0].strip().encode('ascii', 'ignore')
            # print details['address']
        
    # if we didn't find an address, we can just skip this one because it's basically useless
    # because we know we can't geocode it
    if details['address'] == None: 
        return details
    
    # now that we have the address, use it to calculate the lat and long using geocoding api
    geocode_addr = geocode + "address=" + details['address'] + "&sensor=false&region=ca"
    
    # replace spaces with plus signs
    geocode_addr = geocode_addr.replace(' ', '+')
    
    # retrieve the geocoded results
    soup = BeautifulSoup.BeautifulSoup(urllib.urlopen(geocode_addr).read())
    lat = soup.find("lat")
    lng = soup.find("lng")
    if (lat != None):
        details['lat'] = lat.string
    if (lng != None):
        details['lng'] = lng.string
        
    return details
    
def add_new_listings(rss, c, geocode):
    
    # get the soup
    import BeautifulSoup;
    import urllib;
    soup = BeautifulSoup.BeautifulSoup(urllib.urlopen(rss).read())

    # iterate through all the items
    for item in soup.findAll('item'):
        c.execute('''SELECT COUNT(*) FROM listings WHERE guid = ?''', [item.guid.string])

        # new listing
        # get more details from the link
        # then add it to the database
        if c.fetchone()[0] <= 0:
            details = get_listing_details(item.link.nextSibling, geocode)
            c.execute('''INSERT INTO listings (guid, link, pubdate, address, price, lat, lng) VALUES(?, ?, ?, ?, ?, ?, ?)''', [item.guid.string, item.link.string, item.pubdate.string, details['address'], details['price'], details['lat'], details['lng']])
            
            # print "Added listing", details['address'], details['price'], details['lat'], details['lng']
        
        # existing listing
        else:
            pass
            
        # print item.guid.string
        # print item.link.string
        # print item.pubdate.string
        
#        break

def update(location, rss, db_file):
    
    import sqlite3
    
    # from datetime import datetime;
    # print "Updating", db_file, "at", datetime.now()
    
    # print db_file
    
    conn = sqlite3.connect(db_file)
    c = conn.cursor()
    
    # create tables if they don't exist
    create_tables(c)
    
    # add new listings from the feed
    add_new_listings(rss, c, geocode)
    
    conn.commit()
    c.close()
    
    # print "Done!"
