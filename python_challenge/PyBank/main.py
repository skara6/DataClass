import os
import csv

budget_data_path = 'C:\\Users\\Shetu\\Desktop\\git_code\\UCIRV201810DATA4\\Homeworks\\HW03-Python\\PyBank\\Resources\\budget_data.csv'
## Lists to store data
dates=[]
profits=[]
average=[]
total=0
with open(budget_data_path) as csvfile:
    csvreader = csv.DictReader(csvfile, delimiter=",")
    for row in csvreader:
     row_count=sum(1 for row in csvreader)
     print(row_count)

     total +=sum(len(row["Profit/Losses"]))
     print(total)