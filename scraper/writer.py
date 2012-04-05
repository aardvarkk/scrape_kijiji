'''
Created on 2012-03-21

@author: Ian
'''

output_path = '../display/'

# write out our listings using the cursor to a given path
def write_listings(c, path):
    
    # set to utf-8 output
    import codecs
    f = codecs.open(path, 'w', 'utf-8', 'ignore')

    f.write('var listings = new Array();\n')
    
    # run a selection, and for each row write a new array entry
    c.execute('''SELECT address, lat, lng, price FROM listings''')
    
    # iterate through results
    for i, listing in enumerate(c.fetchall()):
        
        # get the values to write out
        name  = listing[0];
        lat   = listing[1];
        lng   = listing[2];
        price = listing[3];

        # convert from None to null for JS
        if name == None: name = 'null'
        if lat == None: lat = 'null'
        if lng == None: lng = 'null'
        if price == None: price = 'null'

        f.write('listings[' + str(i) + '] = { name: "' + name + '", pos: new google.maps.LatLng(' + str(lat) + ', ' + str(lng) + '), price: ' + str(price) + ' };\n')
    
    f.close()
    
if __name__ == '__main__':
    
    import database
    import locations
    import sqlite3

    # write out each location
    for location in locations.rss:
        conn = sqlite3.connect(database.db_path + locations.listings_prefix + location + database.db_ext)
        c = conn.cursor()
    
        write_listings(c, output_path + locations.listings_prefix + location + '.js')
    
        c.close()
    
    print "Done!"
    
