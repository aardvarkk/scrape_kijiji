'''
Created on 2012-03-21

@author: Ian
'''

if __name__ == '__main__':

    import database    
    import locations
    import scraper
    import time
    
    # keep going forever!
    while (1):
        
        # run each location
        for location in locations.rss:
            scraper.update(location, locations.rss[location], database.db_path + locations.listings_prefix + location + database.db_ext)
        
        # wait 10 minutes
        time.sleep(600)
