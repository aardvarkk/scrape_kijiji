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

	from datetime import datetime
	print "Updating at", datetime.now()

        # run each location
        for location in locations.rss:
            scraper.update(location, locations.rss[location], database.db_path + locations.listings_prefix + location + database.db_ext)

	print "Done!"
        
        # wait 20 minutes
        time.sleep(1200)
