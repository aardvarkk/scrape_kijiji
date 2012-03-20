rss = "http://kitchener.kijiji.ca/f-SearchAdRss?AdType=2&CatId=36&Location=1700209"
db_name = "scraper.db"

def create_tables(c):
    c.execute('''CREATE TABLE IF NOT EXISTS listings (guid TEXT PRIMARY KEY, link TEXT, pubdate TEXT, address TEXT, price REAL)''')

# take the link and use it to get the price and address
def get_listing_details(link):
    
    # set up the dictionary with default values
    details = {'address': None, 'price': None}
    
    # grab the soup from the link
    from bs4 import BeautifulSoup;
    import urllib;
    soup = BeautifulSoup(urllib.urlopen(link).read())

    for tr in soup.find(id="attributeTable").find_all("tr"):
        
        # get all the table data for this row
        tds = tr.find_all("td")
        
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
                details['price'] = float(tds[1].find("strong").string.strip('$'))
                # print details['price']
            
        # address
        if tds[0].string.strip() == "Address":
            details['address'] = tds[1].contents[0].strip()
            # print details['address']
        
    return details;
    
def add_new_listings(c):
    
    # get the soup
    from bs4 import BeautifulSoup;
    import urllib;
    soup = BeautifulSoup(urllib.urlopen(rss).read())
    
    # iterate through all the items
    for item in soup.find_all("item"):
        c.execute('''SELECT COUNT(*) FROM listings WHERE guid = ?''', [item.guid.string])
        
        # new listing
        # get more details from the link
        # then add it to the database
        if c.fetchone()[0] <= 0:
            details = get_listing_details(item.link.string)
            c.execute('''INSERT INTO listings (guid, link, pubdate, address, price) VALUES(?, ?, ?, ?, ?)''', [item.guid.string, item.link.string, item.pubdate.string, details['address'], details['price']])
            print "Added listing", details['address'], details['price']
        # existing listing
        else:
            pass
            
        # print item.guid.string
        # print item.link.string
        # print item.pubdate.string
        
#        break
        
if __name__ == '__main__':
    
    # print out version
    import sys;
    print sys.version;
    
    import sqlite3;

    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    
    # create tables if they don't exist
    create_tables(c)
    
    # add new listings from the feed
    add_new_listings(c)
    
    conn.commit()
    c.close()
