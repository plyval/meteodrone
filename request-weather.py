#About:
#Request all sites hourly weather from Met Office DataPoint
#Strips this data to that which is needed (location, current temp, current wind speed, gust and direction)
#Saves the stripped data as a JSON file.
#2020-04-21: updated to replace urllib.request.urlopen(URL) to a .Request and specifying user-agent header in order to avoid some form of mod-security issue returning 403 

import urllib.request
import json
import os

s = os.path.dirname(os.path.abspath(__file__))

#key redacted - needs adding to URL end for the request to work
URL = "http://datapoint.metoffice.gov.uk/public/data/val/wxobs/all/json/all?res=hourly&key="
filename = "data.json"

class siteData:
    def __init__(self, location = "", temp = "", windSpeed = "", windGust = "", windDirection = ""):
        self.location = location
        self.temp = temp
        self.windSpeed = windSpeed
        self.windGust = windGust
        self.windDirection = windDirection
    def __str__(self):
        return self.location + self.temp + self.windSpeed + self.windGust + self.windDirection


req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
response = urllib.request.urlopen(req).read()
r = json.loads(response.decode('utf-8'))

Locations = r["SiteRep"]["DV"]["Location"]

d = []


for i, Location in enumerate(Locations):
    Periods = Location["Period"]
    for j, Period in enumerate(Periods):
        Reps = Period["Rep"]
        for k, Rep in enumerate(Reps):
            if Rep["$"] == "0":
                data = siteData()
                data.location = Location.get('name', '')
                data.temp = Rep.get('T', '')
                data.windSpeed = Rep.get('S', '')
                data.windGust = Rep.get('G', '')
                data.windDirection = Rep.get('D', '')
                d.append(data)


f = open(s + "/" + filename, 'w')
f.write(json.dumps([ob.__dict__ for ob in d], indent=4))
f.close()

print("Success!")
