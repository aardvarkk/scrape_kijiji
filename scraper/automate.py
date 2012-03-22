'''
Created on 2012-03-21

@author: Ian
'''

if __name__ == '__main__':
    
    import scraper
    import time
    
    rss = "http://kitchener.kijiji.ca/f-SearchAdRss?AdType=2&CatId=36&Location=1700209"
    db_name = "../../../Dropbox/scraper.db"
    geocode = "http://maps.googleapis.com/maps/api/geocode/xml?"

    # keep going forever!
    while (1):
        scraper.update(rss, db_name, geocode)
        time.sleep(600)
