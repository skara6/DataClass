import numpy as np
import sqlalchemy
import datetime as dt
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# reflect an existing database into a new
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Measurement = Base.classes.measurement
Station = Base.classes.station
# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
   
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations <br/>"
        f"/api/v1.0/tobs <br/>"
        f"/api/v1.0/<start> <br/>"
        f"/api/v1.0/<start><end> <br/>"

    )


@app.route("/api/v1.0/precipitation")
def precip():
    prev_year_date = dt.date(2017, 8, 23) - dt.timedelta(days=365)

    precip = session.query(Measurement.date, Measurement.prcp).\
    filter(Measurement.date > prev_year_date).all()
    return jsonify (precip)


@app.route("/api/v1.0/stations")
def stations():
    stations = session.query(Measurement.station).all()

    return jsonify(stations)

@app.route("/api/v1.0/tobs")
def highest():
    prev_year_date = dt.date(2017, 8, 23) - dt.timedelta(days=365)
    highest = session.query(Measurement.date, Measurement.tobs).\
        filter(Measurement.date > prev_year_date).all()
    return jsonify(highest)

@app.route("/api/v1.0/<start>")
@app.route("/api/v1.0/<start><end>")
def start_end(start=None, end= None):

    results_end = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs)\
                                , func.max(Measurement.tobs)).filter(Measurement.date \
                                >= start_date).filter(Measurement.date <= end_date).all()

    return start




if __name__ == '__main__':
    print('test')
    app.run(debug=True)

