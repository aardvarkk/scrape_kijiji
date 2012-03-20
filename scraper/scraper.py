rss = "http://kitchener.kijiji.ca/f-SearchAdRss?AdType=2&CatId=36&Location=1700209"
db_name = "scraper.db"

def create_tables(c):
    c.execute('''CREATE TABLE IF NOT EXISTS listings (guid TEXT PRIMARY KEY, link TEXT, pubdate TEXT, address TEXT, price REAL)''')

def add_new_listings(c):
    from bs4 import BeautifulSoup;
    import urllib;

    data = urllib.urlopen(rss).read()
    soup = BeautifulSoup(data)
    
    for item in soup.find_all("item"):
        c.execute('''SELECT COUNT(*) FROM listings WHERE guid = ?''', [item.guid.string])
        
        # new listing
        # get more details from the link
        if (c.fetchone()[0] <= 0):
            c.execute('''INSERT INTO listings (guid, link, pubdate) VALUES(?, ?, ?)''', [item.guid.string, item.link.string, item.pubdate.string])
        # existing listing
        else:
            pass
            
        # print item.guid.string
        # print item.link.string
        # print item.pubdate.string
        
if __name__ == '__main__':
    import sqlite3;

    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    
    # create tables if they don't exist
    create_tables(c)
    
    # add new listings from the feed
    add_new_listings(c)
    
    conn.commit()
    c.close()
