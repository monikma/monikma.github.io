---
layout: post
title: Data Wrangling with MongoDB - Udacity course notes
date: '2014-12-14T18:09:00.004+01:00'
author: Monik
tags:
- Programming
- MongoDB
- Python
- Data_Mining
- NoSQL
modified_time: '2016-01-13T20:58:34.006+01:00'
blogger_id: tag:blogger.com,1999:blog-5940427300271272994.post-1884713552860826320
blogger_orig_url: http://learningmonik.blogspot.com/2014/12/data-wrangling-with-mongodb.html
commentIssueId: 23
type: course
---

<div class="bg-info panel-body" markdown="1">
These are the notes I took while taking the "Data Wrangling with MongoDB" course at <a href="https://www.udacity.com/">Udacity</a>. It tells how to use Python to process CSV, XML, Excel, and how to work with MongoBD. Also some examples for page scraping in Python.
</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=2}

### 1. Data extraction Fundamentals

<ul>
    <li>data wrangling = gathering, extracting, cleaning and storing data</li>
    <li>you have to assure your data is correct before doing anything else with it, especially if a human was involved in writing the data</li>
</ul>

#### 1.1 Tabular data and CSV

<ul>
    <li>items (row) have fields (columns), and first row contains label</li>
    <li>parsing CSV in python - manually</li>

<div markdown="1">

```python
with open(datafile, "r") as f:
  titles = string.split(f.readline(), ",")
     for line in f:
        data.append(create_data(titles,string.split(line, ",")))
        i=i+1
        if (i>10):
          break
return data
```

</div>
<li>parsing XLS in python - with XLRD module</li>
<div markdown="1">

```python
import xlrd

workbook = xlrd.open_workbook(datafile)
sheet = workbook.sheet_by_index(0)
data = [[sheet.cell_value(r, col) for col in range(2)] for r in range(sheet.nrows)]
minVal = data[1][1]
minIndex = 1
```

</div>

<li>parsing CSV with python - with CSV module</li>
<div markdown="1">

```python
import csv

with open(datafile,'rb') as f:
    reader = csv.reader(f)#, delimiter=',', quotechar='|'
    name = reader.next()[1]
    print name
    reader.next()
    while True:
      try:
        data.append(reader.next())
      except StopIteration:
        break
```

</div>

<li>writing CSV with python</li>
<div markdown="1">

```python
with open(filename, 'wb') as csvfile:
  writer = csv.writer(csvfile, delimiter='|')
  for row in data:
    writer.writerow(row)
```

</div>
</ul>


#### 1.2. JSON format

<ul>
    <li>nested objects and arrays</li>
    <li>different items can have different fields</li>
</ul>

### 2. Data in More Complex Formats

#### 2.1. XML

<ul>
    <li>designed for platform independent data transfer</li>
    <li>supports validation</li>
    <li>the domain: citation analysis, analysing citations in XML versions of scientific publications</li>
    <li>XML parsing with python</li>
<div markdown="1">

```python
import xml.etree.ElementTree as ET

tree = ET.parse(fname)
root = tree.getroot()

for author in root.findall('./fm/bibl/aug/au'):
    data = {
                "fnm": author.find('fnm').text,
                "snm": author.find('snm').text,
                "email": author.find('email').text,
    }
    authors.append(data)
```
</div>

<li>handling attributes</li>
<div markdown="1">

```python
for author in root.findall('./fm/bibl/aug/au'):
   insrs = author.findall('./insr')
        for insr in insrs:
            data["insr"].append(insr.attrib["iid"])
        print data
```
</div>
</ul>

#### 2.2. Data scraping

<div>The example of website about arrivals and departures and various airports. There are two combo boxes, so we would have to click a lot to get all the data. We want to rather write a script for us.</div>
<div>
        <ul>
            <li>first we view page source to find all the codes of the combobox lists</li>
            <li>then we open firebug to see what calls exactly are made, and which parts are depending on combobox clicks</li>
            <li>we try to identify the other parameters (e.g. sth like "_viewstate", etc)</li>
            <li>we write a script which makes call by call and generates a set of static HTML pages</li>
            <li>! important - first store the data, then analyse it ! - best practice</li>
            <li>Beautiful Soup - <span
                    style="font-family: Courier New, Courier, monospace; font-size: xx-small;">from bs4 import BeautifulSoup </span>- the module for finding the values of a field in HTML, expecially for this kind of tasks</li>

<div markdown="1">

```python
with open(page, "r") as html:
        soup = BeautifulSoup(html)
        data["eventvalidation"] = soup.find(id="__EVENTVALIDATION")['value']
        data["viewstate"] = soup.find(id="__VIEWSTATE")['value']
```
</div>

<li>we also have to maintain session it turned out</li>
<div markdown="1">

```python
~~requests.post("http://..", data={...})~~
s = requests.Session()
s.post("http://..", data={...})
```
</div>

<li>then write another script(s) that iterate(s) through the downloaded files, clean(s) up the data (=audits it), and do(es) what we need to do &nbsp;- this is actually covered in several practical exercises</li>
        </ul>
    </div>

### 3. Data Quality

<ul>
            <li>data cleaning is an iterative process</li>
            <li>measures of data quality:</li>
            <ul>
                <li>validity - how it conforms to a schema (official or inofficial)</li>
                <li>accuracy - "do all the street addresses exist?" - compare with some gold standard data</li>
                <li>completness - are some record missing?</li>
                <li>consistency - does some data contradict other parts of data</li>
                <li>uniformity&nbsp;- e.g. same units</li>
            </ul>
            <li>process:</li>
            <ul>
                <li>audit data (statistical analysis - how many types of which value exist)</li>
                <li>plan how to to correct</li>
                <li>test if it worked</li>
                <li>manual correction step</li>
                <li>repeat, until you have confidence in your data</li>
            </ul>
            <li>you can also do data enhancement besides the cleaning</li>
        </ul>

#### 3.1. Various small examples

<ul>
            <li>open street map data example - we change St. to Street and Av. to Avenue, etc., after seeing the statistics (validity)</li>
            <li>dbpedia data set about cities - we find the error where density is in persons/square km, and area is in square meters, we also see arrays instead of single values, multiple timezones&nbsp;(uniformity)</li>
            <li>dbpedia data set about countries - we find some names which are not a country, or are arrays, column shift, by comparing the data to ISO country codes (accuracy)</li>
            <li>example with video and screen capture of an exam - less likelihood that both are missing (completness)</li>
            <li>example with "who do i trust the most" - e.g. there are 2 different addresses for same person - have to decide which one is more reliable, e.g. how was the data collected, which one is more accurate, etc. (consistency)</li>
            <li>example of counting numbers of data types (including null) (uniformity)</li>
        </ul>

#### 3.2. Exercise

<div>The exercise is about analysing and cleaning cities data set. We count number of data types, deciding about which digit of areaLand we are more likely to use, and choosing the more accurate one, changing string array of city names to python array, checking the lat and lon locations.</div>


### 4. Working with MongoDB

<ul>
    <li>flexible schema, easy to handle hierarchical data</li>
    <li>JSON documents - convenient for programmers</li>
    <li>flexible deployment (local or cloud)</li>
</ul>

#### 4.1. Pymongo

<div>
    <ul>
        <li>is python driver for mongo - keeps connection to database</li>
        <li>minimal example</li>

<div markdown="1">

```python
from pymongo import MongoClient

client = MongoClient('localhost:27017')
db = client[db_name]
query = {"manufacturer" : "Porsche"}
return db.autos.find(query)

return db.autos.find_one(query)
```
</div>

<li>projection</li>

<div markdown="1">

```python
return db.autos.find(query, {"_id":0, "name":1})
```

* normally `_id` is included by default, unless specifies like above explicitly
</div>

<li>insert</li>
<div markdown="1">

```python
db.autos.insert(auto)
```
</div>
<li>mongoimport cmd line utility - imports whole JSON files to DB</li>

<div markdown="1">

`>mongoimport -d examplesdb -c autos --file autos.json`
</div>

<li>operators - start from "$"</li>
<li>$gt, $lt, $gte, $lte, $ne</li>

<div markdown="1">

```python
query = {"foundingDate" : {"$gte":datetime(2001,1,1), "$lte" : datetime(2099,12,31)}}
```
</div>

<li>$exists</li>

<div markdown="1">

```python
query = {"governmentType":{"$exists" : 1}}
```
</div>

<li>$regex</li>
<li>queries work inside arrays</li>
<li>also can work against other arrays, $in and $all</li>
<li>$in</li>

<div markdown="1">

```python
query = {"assembly":{"$in":["Germany","United Kingdom","Japan"]}, "manufacturer":"Ford Motor Company"}
```
</div>

<li>$all</li>

<div markdown="1">

```python
query = {"modelYears":{"$all":[1965, 1966, 1967]}}
```
</div>

<li>can also access hierarchy</li>

<div markdown="1">

```python
query = {"dimensions.width":{"$gt":2.5}}
```
</div>

<li>save(obj) method - insert or update (if the _id exists and such object is in db)</li>
<li>update(obj) - for (bulk) partial updates</li>
<li>update + $set</li>

<div markdown="1">

```python
city = db.cities.update({"name":"Munich",
                         "country":"Germany"},
                        {"$set":{"isoCountryCode":"DEU"}})
```
</div>
<li>update + $unset</li>

<div markdown="1">

```python
city = db.cities.update({"name":"Munich",
                         "country":"Germany"},
                        {"$unset":{"isoCountryCode":
                                 "blahblah_this is ignored"}})
```
</div>

<li>bulk update</li>

<div markdown="1">

```python
city = db.cities.update({"name":"Munich",
                         "country":"Germany"},
                        {"$set":{"isoCountryCode":"DEU"}},
                        multi=True)

```
</div>

<li>remove() - removes all</li>

<div markdown="1">

```python
city = db.cities.remove()
```
</div>

<li>remove(query)</li>
</ul></div>

#### 4.2. Exercise

A lot of specific data cleaning and modifying, while copying it from CVS to mongo, row by row. It's about&nbsp;arachnid (spiders) data set.


### 5. Analysing Data


<ul>
        <li><span style="font-weight: normal;">twitter data set</span></li>
        <li><span style="font-weight: normal;">followers, followees, tweets, tweet contents</span></li>
        <li><span style="font-weight: normal;">user id is called "screen_name"</span></li>
        <li><span style="font-weight: normal;">tasks like "find who tweeted the most"</span></li>
    </ul>

#### 5.1. Aggregation framework in MongoDB

<ul>
    <li>$group and $sort</li>

<div markdown="1">

```python
db = get_db('twitter')
pipeline = [
   {"$group": {"_id":"$source",
               "count": {"$sum": 1}}
   },
   {"$sort": {'count': -1}}]

result = db.tweets.aggregate(pipeline)
```
</div>
    <li>$skip and $limit - skip few first documents, or limit the output to number of documents only</li>
    <li>$match - for filtering, and $project</li>

<div markdown="1">

```python
pipeline = [{"$match":{"user.time_zone":"Brasilia"}},
            {"$match":{"user.statuses_count":{"$gte":100}}},
            {"$project":{"followers":"$user.followers_count",
                         "screen_name":"$user.screen_name",
                         "tweets":"$user.statuses_count"}},
            {"$sort":{"followers":-1}},
            {"$limit":1}]
```
</div>

<li>$unwind - will multiply the record for each value in an array</li>

<div markdown="1">

```python
pipeline = [{"$match":{"country":"India"}},
            {"$unwind":"$isPartOf"},
            {"$group":{"_id":"$isPartOf", "count":{"$sum":1}}},
            {"$sort":{"count":-1}},
            {"$limit":1}]
```
</div>

<li>$sum, $first, $last, $max, $min, $avg</li>

<div markdown="1">

```python
pipeline = [{"$match":{"country":"India"}},
            {"$unwind":"$isPartOf"},
            {"$group":{"_id":"$isPartOf",
                       "avg":{"$avg":"$population"}}
            },
            {"$group":{"_id":"totalAvg",
                       "avg":{"$avg":"$avg"}}
            }
           ]
```
</div>

<li>$push and $addToSet</li>

<div markdown="1">

```python
pipeline = [{"$group":
            {"_id":"$user.screen_name",
             "tweet_texts":{"$push":"$text"},
             "count":{"$sum":1}}},
            {"$sort":{"count":-1}},
            {"$limit":5}
           ]
```
</div>

<li>indices - they are hierarchical; the hierarchy determines in which order an item can be searched - think about it<</li>

<div markdown="1">

```python
db.autos.ensureIndex({"name": 1})
```
</div>

<li>geospatial indices - don't search by exact point, but "near"&nbsp;to&nbsp;points ($near)</li>

<div markdown="1">

```python
db.autos.ensureIndex(loc_field, direction)
```
</div>

</ul>

#### 5.2. Exercises

Just building different pipelines.

### 6. Case study

It's about OpenStreetMap data set, which can be downloaded in XML from their site. You can download part which you are looking at, or download data of major cities. They also have a very nice wiki.<br/><br/>The data is XML with "node"s and "way"s (way = street, road, etc). The data is human edited, so it contains errors.<br/>

#### 6.1. SAX XML parsing

<div markdown="1">

```python
import xml.etree.ElementTree as ET

for event, item in ET.iterparse(xml_filename, events=(“start”,))
  handle_node(elem)
```
</div>

The non iterative parsing (reading all to memory at once) could go like:

<div markdown="1">

```python
tree = ET.parse(xml_filename)
root = tree.getroot()
for child in root:
  handle_node(child)
```
</div>

<ul>
    <li>node.tag - name of XML node</li>
    <li>node.attrib - dictionary of node attributes</li>
    <li>node.attrib.keys() - array of attribute names</li>
</ul>

#### 6.2 Regular expressions

<div markdown="1">

```python
import re

lower = re.compile(r'^([a-z]|_)*$')
re.findall(lower, string)

m = lower.search(string)
if m:
  substring = m.group()
```
</div>


#### 6.3 Exercise

It's about parsing a XML document, and iterating over XML nodes and creating proper python dictionaries (specified in the task description).<br/><br/>Conclusions<br/>
<ul>
    <li>Reading the actual data helps a lot, makes you see misconceptions, and understand what is actually going on</li>
    <li>Read the task carefully and do not switch off thinking ;)</li>
    <li>Latitude comes before longitude</li>
</ul>
