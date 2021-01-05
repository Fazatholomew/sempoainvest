from csv import DictReader
from os import listdir
from datetime import datetime
from json import dump

_list = listdir('.')
file_names = [name for name in _list if '.csv' in name]
data = {}

for name in file_names:
    with open(name, mode='r') as csv_file:
        csv_reader = DictReader(csv_file)
        ticker = name.split(' ')[-1].split('.')[0]
        data[ticker] = [row for row in csv_reader]

result = {}

for key,value in data.items():
    current_month = int(value[0]['Date'].split(' ')[0].split('/')[0])
    week_buffer = 0
    i = 0
    last_price = None
    ticker_data = []
    for data_point in value:
        month = int(data_point['Date'].split(' ')[0].split('/')[0])
        if month != current_month:
            new_price = week_buffer / i
            week_buffer = 0
            i = 0
            if last_price != None:
                changes = round(((new_price - last_price) / last_price) * 100, 1)
                ticker_data.append(changes)
            last_price = new_price
        week_buffer += float(data_point['Close'])
        i += 1
    result[key] = ticker_data[::-1]

with open('data.json', 'w') as json_file:
    dump(result, json_file)
