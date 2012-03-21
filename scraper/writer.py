'''
Created on 2012-03-21

@author: Ian
'''

db_name = "scraper.db"
output_path = "../display/listings.js"

# write out our listings using the cursor to a given path
def write_listings(c, path):
    f = open(path, 'w')
    f.write('var listings = new Array();\n')
    
    # run a selection, and for each row write a new array entry
    c.execute('''SELECT address, lat, lng FROM listings''')
    
    # iterate through results
    for i, listing in enumerate(c.fetchall()):
        f.write('listings[' + str(i) + '] = { name: "' + listing[0] + '", pos: new google.maps.LatLng(' + str(listing[1]) + ', ' + str(listing[2]) + ') };\n')
    
    f.close()
    
if __name__ == '__main__':
    
    import sqlite3;

    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    
    write_listings(c, output_path)
    
    c.close()
    
