from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://user:password@localhost/dbname"
db = SQLAlchemy(app)


class County(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True)
    visited = db.Column(db.Boolean, default=False)


@app.route("/county", methods=["POST"])
def update_county():
    """
    Updates the visited status of a county.

    Args:
        None

    Returns:
        tuple: A tuple containing the string 'OK' and the status code 200.

    Raises:
        None

    Examples:
        >>> update_county()
        ('OK', 200)
    """
    county_name = request.json["name"]
    county = County.query.filter_by(name=county_name).first()
    if county:
        county.visited = True
        db.session.commit()
    return "OK", 200
