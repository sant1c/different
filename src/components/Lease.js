import React, { Component } from "react";
import axios from "axios";
import dateFns from "date-fns";

class Lease extends Component {
  constructor(props, match) {
    super(props);
    this.state = {
      leaseData: []
    };
  }

  componentDidMount() {
    var self = this;
    this.getLeaseDetails(this.props.match.params.id).then(data => {
      self.setState({
        leaseData: data
      });
    });
  }
  render() {
    return (
      <div style={{ height: "100%" }}>
        <table>
          <thead>
            <tr>
              <th>Start</th>
              <th>End</th>
              <th>Days</th>
              <th>Amt</th>
            </tr>
          </thead>
          <tbody>{getRows(this.state.leaseData)}</tbody>
        </table>
      </div>
    );
  }

  getLeaseDetails(id) {
    return axios
      .get(`https://hiring-task-api.herokuapp.com/v1/leases/${id}`)
      .then(res => {
        let startDate = new Date(res.data.start_date);
        let endDate = new Date(res.data.end_date);
        let paymentDay = res.data.payment_day;
        let frequency = res.data.frequency;
        let rent = res.data.rent;
        let displayableDatas = [];
        let displayableData = {};
        let leftDay;
        let startDateIndex;
        let nextDate;
        let diffrence;
        let weeksToAdd;
        let monthsToAdd;
        let frequencyToCheck;

        switch (frequency) {
          case "weekly":
            frequencyToCheck = 7;
            diffrence = dateFns.differenceInWeeks(endDate, startDate, {
              weekStartsOn: startDate.getDay()
            });
            weeksToAdd = 1;
            break;
          case "monthly":
            frequencyToCheck = 30;
            monthsToAdd = 1;
            diffrence = dateFns.differenceInMonths(endDate, startDate);
            break;
          case "fortnightly":
            diffrence = dateFns.differenceInWeeks(endDate, startDate, {
              weekStartsOn: startDate.getDay()
            });
            frequencyToCheck = 14;
            weeksToAdd = 2;
            break;
          default:
        }

        nextDate = startDate;
        if (!(startDate.getUTCDay() === paymentDay)) {
          switch (paymentDay) {
            case "sunday":
              startDateIndex =
                startDate.getDay() === 0
                  ? startDate.getDay() + 1
                  : startDate.getDay();
              leftDay =
                startDateIndex > 1 ? startDateIndex - 1 : 1 - startDateIndex;
              break;
            case "monday":
              startDateIndex =
                startDate.getDay() === 0
                  ? startDate.getDay() + 1
                  : startDate.getDay();
              leftDay =
                startDateIndex > 2 ? startDateIndex - 1 : 2 - startDateIndex;
              break;
            case "tuesday":
              startDateIndex =
                startDate.getDay() === 0
                  ? startDate.getDay() + 1
                  : startDate.getDay();
              leftDay =
                startDateIndex > 3 ? startDateIndex - 3 : 3 - startDateIndex;
              break;
            case "wednesday":
              startDateIndex =
                startDate.getDay() === 0
                  ? startDate.getDay() + 1
                  : startDate.getDay();
              leftDay =
                startDateIndex > 4 ? startDateIndex - 4 : 4 - startDateIndex;
              break;
            case "thursday":
              startDateIndex =
                startDate.getDay() === 0
                  ? startDate.getDay() + 1
                  : startDate.getDay();
              leftDay =
                startDateIndex > 5 ? startDateIndex - 5 : 5 - startDateIndex;
              break;
            case "friday":
              startDateIndex =
                startDate.getDay() === 0
                  ? startDate.getDay() + 1
                  : startDate.getDay();
              leftDay =
                startDateIndex > 6 ? startDateIndex - 6 : 6 - startDateIndex;
              break;
            case "saturday":
              startDateIndex =
                startDate.getDay() === 0
                  ? startDate.getDay() + 1
                  : startDate.getDay();
              leftDay =
                startDateIndex > 7 ? startDateIndex - 7 : 7 - startDateIndex;
              break;
            default:
          }
          displayableData.startDate = formatDate(startDate);
          displayableData.endDate = formatDate(
            dateFns.addDays(startDate, leftDay)
          );
          displayableData.days = leftDay;
          let unitAmt = rent / frequencyToCheck;
          let totalAmt = unitAmt * leftDay;
          displayableData.amt = totalAmt;
          nextDate = dateFns.addDays(startDate, leftDay);
        }

        displayableDatas.push(displayableData);
        for (let i = 0; i < diffrence; i++) {
          displayableData = {};
          displayableData.startDate = formatDate(nextDate);
          switch (frequency) {
            case "weekly":
              displayableData.endDate = formatDate(
                dateFns.addWeeks(nextDate, weeksToAdd)
              );
              displayableData.days = frequencyToCheck;
              displayableData.amt = rent * weeksToAdd;
              nextDate = dateFns.addWeeks(nextDate, weeksToAdd);
              displayableDatas.push(displayableData);
              break;
            case "monthly":
              displayableData.endDate = formatDate(
                dateFns.addMonths(nextDate, monthsToAdd)
              );
              displayableData.days = dateFns.differenceInDays(
                new Date(displayableData.endDate),
                new Date(displayableData.startDate)
              );
              displayableData.amt = rent * monthsToAdd;
              nextDate = dateFns.addMonths(nextDate, monthsToAdd);
              displayableDatas.push(displayableData);
              break;
            case "fortnightly":
              displayableData.endDate = formatDate(
                dateFns.addWeeks(nextDate, weeksToAdd)
              );
              displayableData.days = frequencyToCheck;
              displayableData.amt = rent * weeksToAdd;
              nextDate = dateFns.addWeeks(nextDate, weeksToAdd);
              displayableDatas.push(displayableData);
              break;
            default:
          }
        }
        return displayableDatas;
      });
  }
}

function getRows(data) {
  return data.map((lease, key) => {
    return (
      <tr key={key}>
        <td>{lease.startDate}</td>
        <td>{lease.endDate}</td>
        <td>{lease.days}</td>
        <td>{lease.amt}</td>
      </tr>
    );
  });
}

function formatDate(date) {
  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + " " + monthNames[monthIndex] + " " + year;
}

export default Lease;
