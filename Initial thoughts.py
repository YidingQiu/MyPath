# -*- coding: utf-8 -*-

"""
Basic idea: Just obtain a simple linear regression between SEIFA rank within
VIC and 
"""

"""
y_2324 = np.array(yearly_2324['Expenditure ($) per Adult 2024']).reshape(-1, 1)
y_2223 = np.array(yearly_2223['Expenditure ($) per Adult 2024']).reshape(-1, 1)
y_2122 = np.array(yearly_2122['Expenditure ($) per Adult 2024']).reshape(-1, 1)
x_2324 = np.array(yearly_2324['SEIFA DIS Rank State']).reshape(-1, 1)
x_2223 = np.array(yearly_2223['SEIFA DIS Rank State']).reshape(-1, 1)
x_2122 = np.array(yearly_2122['SEIFA DIS Rank State']).reshape(-1, 1)
"""

"""
Standard linear regression; note that there exists a weak negative linear correlation 
between SEIFA DIS rank within the state and expenditure per adult, and a fairly 
strong positive linear correlation between unemployment rate and expenditure per adult. 
"""

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

start_path = "C:/Users/quick/OneDrive/Documents/Govhack/Gambling data/"
LGA_yearly = pd.read_excel(start_path + "yearly_density_statistical_release_nov_24-(2).xlsx", sheet_name = "2023-24")
LGA_rents = pd.read_excel(start_path + "Quarterly-median-rents-by-Local-Government-Area-September-quarter-2024.xlsx", sheet_name = "All Properties")

renaming = []
# Renaming the LGA names in the rental data
# Note that this also required the following manual changes in the Excel data:
#   - In the rental dataset "Merri-bek" was renamed to "Moreland"
#   - In the rental dataset "Mornington Penin'a" was renamed to "Mornington Peninsula"
for name in LGA_yearly['LGA Name']:
    if "of" in name:
        name_update = name[name.find("of"):]
        renaming.append(name_update.replace("of ", ""))
    else:
        renaming.append(name)
LGA_yearly['LGA Name'] = renaming

# Plots to check that unemployment rates are good
comb = pd.merge(LGA_yearly, LGA_rents[['LGA Name', 'Median rent across FY']], on = "LGA Name")
y = np.array(comb['Expenditure ($) per Adult 2024']).reshape(-1, 1)
x1 = np.array(comb['SEIFA DIS Rank State']).reshape(-1, 1)

# This one is for unemployment rates and rental prices
x2 = comb[['Unemployment Rate as at June 2024', 'Median rent across FY']]

reg1 = LinearRegression().fit(x1, y)
reg2 = LinearRegression().fit(x2, y)
pred1 = reg1.coef_[0][0]*x1 + reg1.intercept_[0]
print('y = ' + str(round(reg2.coef_[0][0])) + 'x1 + ' + str(round((reg2.coef_[0][1]),2)) + 'x2 ' + str(round(reg2.intercept_[0])))
pred2 = reg2.coef_[0]*x2 + reg2.intercept_[0]
plt.plot()

# Checking for approximate linearity by observing a plot of observed vs predicted variables - no issues found
plt.figure()
plt.plot()
plt.close()

"""
Very elementary time series analysis; basically I want to see what are the times
that tend to have higher rates of gambling. 
Interesting observations: 
    - In both the 2023-24 and 2024-25 FYs, there is a large dip from Aug to Sep and a very large dip from Dec to Feb, followed by a major climb from Feb to Mar
    - In 2023-24 there was also a large bump from Nov to Dec. 
    - Overall, there were increased losses throughout the year. 
"""

monthly_2425_raw = pd.read_excel(start_path + "current_monthly_lga_data_release.xlsx", sheet_name = "2024-25")
monthly_2324_raw = pd.read_excel(start_path + "current_monthly_lga_data_release.xlsx", sheet_name = "2023-24")

# Obtaining the average loss per machine on a monthly basis
monthly_2425 = monthly_2425_raw.iloc[:, 5::4]
monthly_2425.insert(loc = 0, column = 'LGA Name', value = monthly_2425_raw['LGA Name'])
monthly_2324 = monthly_2324_raw.iloc[:, 5::4]
monthly_2324.insert(loc = 0, column = 'LGA Name', value = monthly_2425_raw['LGA Name'])

# Plots the individual time series
months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"]
plt.figure()
plt.plot(months, monthly_2425.iloc[57][1:13])
plt.xlabel = 'Month'
plt.ylabel = 'Average loss per machine'
plt.title('2024-25 Time Series')
plt.savefig('2024-25 Time Series.png')
plt.close()

plt.figure()
plt.plot(months, monthly_2324.iloc[57][1:13])
plt.xlabel = 'Month'
plt.ylabel = 'Average loss per machine'
plt.title('2023-24 Time Series')
plt.savefig('2023-24 Time Series.png')
plt.close()

# Plots the time series overlayed on top of each other
plt.figure()
plt.plot(months, monthly_2425.iloc[57][1:13], label='2024-25')
plt.plot(months, monthly_2324.iloc[57][1:13], label='2023-24')
plt.xlabel = 'Month'
plt.ylabel = 'Average loss per machine'
plt.legend(loc='upper right')
plt.title('Overlaid Time Series')
plt.savefig('Overlaid Time Series.png')
plt.close()