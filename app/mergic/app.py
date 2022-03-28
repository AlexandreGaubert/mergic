import random
import typing

import flask
import sys
from flask_cors import CORS, cross_origin
from datetime import date
from enum import Enum

app = flask.Flask(__name__)
CORS(app)

class WeekDay(Enum):
    MONDAY = 0
    TUESDAY = 1
    WEDNESDAY = 2
    THURSDAY = 3
    FRIDAY = 4
    SATURDAY = 5
    SUNDAY = 6

    def __ge__(self, other):
        return self.value >= other.value
    def __le__(self, other):
        return self.value <= other.value

# Is word starts with letter in range, range with format <letterStart>-<letterEnd>
def startsWithRange(word, letterRange):
    start, end = letterRange.split('-')
    ord_range = range(ord(start), ord(end) + 1)
    return ord(word[0]) in ord_range

def isWeekDay(day):
    return WeekDay(day) >= WeekDay.MONDAY and WeekDay(day) <= WeekDay.FRIDAY

charRanges = {
    WeekDay.MONDAY: "a-e",
    WeekDay.TUESDAY: "f-j",
    WeekDay.WEDNESDAY: "k-o",
    WeekDay.THURSDAY: "p-t",
    WeekDay.FRIDAY: "u-z"
}


@app.route("/pull-requests/next-to-review", methods=["POST"])
@cross_origin()
def next_pr_to_review() -> typing.Any:
    if flask.request.json is None:
        flask.abort(400)

    weekday = date.today().weekday()
    next_pr = {}
    highest_score = 0
    pr_list = flask.request.json["pull_requests"]

    for pr in pr_list:
        score = 0;
        authorLogin = pr["user"]["login"];
        isNotMergeable = pr["locked"] and pr["draft"]

        for label in pr["labels"]:
            if label["name"] == "urgent":
                score += 10

        if isNotMergeable:
            score -= 2;
        if pr["draft"]:
            score -= 5
        #TODO : Compute changed lines count from GitHub's API and add 1 extra point if changes < 100 lines

        if isWeekDay(weekday) and startsWithRange(authorLogin, charRanges[WeekDay(weekday)]):
            score += 1

        if highest_score == 0 or score > highest_score:
            next_pr = pr

    response = flask.jsonify(next_pr)

    return response;


application = app
