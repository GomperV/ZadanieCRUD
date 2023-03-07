import "./App.css";
import React, { Component, useState, useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead"; // ES2015
import Form from "react-bootstrap/Form";
import TypeaheadComponent from "./TypeaheadComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-typeahead/css/Typeahead.css";

class App extends Component {
  constructor(props) {
    super(props);
    const accountBalance = sessionStorage.getItem("accountBalance") || 50000;
    this.state = {
      campaigns: [],
      isLoading: true,
      accountBalance: parseFloat(accountBalance),
      newCampaignName: "",
      newCampaignKeywords: "",
      newCampaignFunds: "",
      newCampaignBidAmount: "",
      newCampaignTowns: "",
      newCampaignRadius: "",
      newCampaignPublished: true,
      error: null,
    };
    this.handleKeywordsChange = this.handleKeywordsChange.bind(this);
  }
  handleKeywordsChange(selectedKeywords) {
    this.setState({ newCampaignKeywords: selectedKeywords });
  }

  async componentDidMount() {
    try {
      const response = await fetch("http://localhost:8091/api/baza");
      const body = await response.json();
      this.setState({ campaigns: body, isLoading: false });
    } catch (error) {
      this.setState({
        error: "Nie udało się pobrać kampanii",
        isLoading: false,
      });
    }
  }
  async remove(id) {
    try {
      await fetch(`http://localhost:8091/api/baza/published/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      let updatedCampaigns = [...this.state.campaigns].filter(
        (i) => i.id !== id
      );
      this.setState({ campaigns: updatedCampaigns });
    } catch (error) {
      console.error(error);
    }
  }

  handleKeywordsChange(keywords) {
    this.setState({ newCampaignKeywords: keywords });
  }

  async addCampaign(event) {
    event.preventDefault();
    const {
      newCampaignName,
      newCampaignKeywords,
      newCampaignFunds,
      newCampaignBidAmount,
      newCampaignTowns,
      newCampaignRadius,
      newCampaignPublished,
      accountBalance, // get the current account balance
    } = this.state;
    if (isNaN(newCampaignFunds) || newCampaignFunds <= 0) {
      console.error("Invalid campaign cost");
      return;
    }
    if (newCampaignFunds > accountBalance) {
      console.error("Insufficient funds");
      return;
    }
    try {
      const response = await fetch("http://localhost:8091/api/baza", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCampaignName,
          keywords: newCampaignKeywords,
          funds: newCampaignFunds,
          bidAmount: newCampaignBidAmount,
          towns: newCampaignTowns,
          radius: newCampaignRadius,
          published: newCampaignPublished,
        }),
      });
      const body = await response.json();
      let updatedCampaigns = [...this.state.campaigns, body];
      let updatedAccountBalance = accountBalance - newCampaignFunds; // update the account balance
      this.setState({
        campaigns: updatedCampaigns,
        newCampaignName: "",
        newCampaignKeywords: "",
        newCampaignFunds: "",
        newCampaignBidAmount: "",
        newCampaignTowns: "",
        newCampaignRadius: "",
        newCampaignPublished: true,
        accountBalance: updatedAccountBalance, // update the state variable for account balance
      });
      sessionStorage.setItem("accountBalance", updatedAccountBalance);
    } catch (error) {
      console.error(error);
    }
  }
  async edit(campaignId, newCampaignData) {
    try {
      const response = await fetch(
        `http://localhost:8091/api/baza/${campaignId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCampaignData),
        }
      );

      if (response.ok) {
        console.log("Editing campaign:", campaignId);
        const updatedCampaigns = this.state.campaigns.map((campaign) => {
          if (campaign.id === campaignId) {
            return { ...campaign, ...newCampaignData };
          } else {
            return campaign;
          }
        });
        const oldCampaign = this.state.campaigns.find(
          (campaign) => campaign.id === campaignId
        );
        const fundsDiff = newCampaignData.funds - oldCampaign.funds; // difference between old funds and new funds
        let updatedAccountBalance;
        if (fundsDiff >= 0) {
          updatedAccountBalance = this.state.accountBalance - fundsDiff; // subtract only the difference from the account balance
        } else {
          updatedAccountBalance =
            this.state.accountBalance + Math.abs(fundsDiff); // add the absolute value of the difference to the account balance
        }
        this.setState({
          campaigns: updatedCampaigns,
          editingCampaignId: null,
          accountBalance: updatedAccountBalance, // update the state variable for account balance
        });
        sessionStorage.setItem("accountBalance", updatedAccountBalance);
      }
    } catch (error) {
      console.log("Nie udalo sie edytowac kampanii", campaignId);
      console.error(error);
    }
  }

  render() {
    const {
      campaigns,
      isLoading,
      newCampaignName,
      newCampaignKeywords,
      newCampaignFunds,
      newCampaignBidAmount,
      newCampaignTowns,
      newCampaignRadius,
      newCampaignPublished,
      accountBalance,
    } = this.state;

    const campaignsList = campaigns.map((campaign) => {
      const handleEdit = () => {
        const newCampaignData = {
          name: newCampaignName,
          keywords: newCampaignKeywords,
          funds: newCampaignFunds,
          bidAmount: newCampaignBidAmount,
          towns: newCampaignTowns,
          radius: newCampaignRadius,
          published: newCampaignPublished,
        };
        this.edit(campaign.id, newCampaignData);
      };

      return (
        <div id="campaign-info" key={campaign.id}>
          <ul id="campaign-data">
            <dl>Bid Amount: {campaign.bidAmount}</dl>
            <dl>Funds: {campaign.funds} </dl>
            <dl>Keyword: {campaign.keywords} </dl>
            <dl>Campaign name: {campaign.name} </dl>
            <dl>
              Published:{" "}
              {campaign.published && `${campaign.published.toString()}`}{" "}
              {!campaign.published && `${campaign.published.toString()}`}{" "}
            </dl>
            <dl>Radius: {campaign.radius} kilometers </dl>
            <dl>Town: {campaign.towns}</dl>
          </ul>
          <button id="delete-btn" onClick={() => this.remove(campaign.id)}>
            Delete
          </button>
          <button
            id="edit-btn"
            type="submit"
            onClick={handleEdit}
            disabled={
              // add campaign btn works only when the values are not null and bidAmount > 499
              this.state.newCampaignFunds < 1 ||
              this.state.newCampaignFunds > accountBalance ||
              !this.state.newCampaignName ||
              !this.state.newCampaignKeywords ||
              this.state.newCampaignBidAmount < 499 ||
              !this.state.newCampaignTowns ||
              this.state.newCampaignRadius < 0
            }
          >
            Edit with data below
          </button>
        </div>
      );
    });

    return (
      <div className="App">
        <header className="App-header">
          <h1>Campaigns</h1>
          <h3>Account balance: {accountBalance}</h3>
          <div id="inputs-container" className="App-intro">
            {campaignsList}
            <div id="info">
              <p>
                Below are the fields which you can use to add new campaigns or
                update existing ones.
              </p>
              <p>Inputs cannot be null. Minimum bid amount is 500.</p>
            </div>
            <form id="form-input" onSubmit={(event) => this.addCampaign(event)}>
              <input
                id="input"
                type="text"
                value={newCampaignName}
                onChange={(event) =>
                  this.setState({ newCampaignName: event.target.value })
                }
                placeholder="Name"
              />
              <input
                id="input"
                type="number"
                value={newCampaignFunds}
                onChange={(event) =>
                  this.setState({ newCampaignFunds: event.target.value })
                }
                placeholder="Funds"
              />
              <input
                id="input"
                type="number"
                value={newCampaignBidAmount}
                onChange={(event) =>
                  this.setState({ newCampaignBidAmount: event.target.value })
                }
                placeholder="Bid amount"
              />
              <select
                id="input"
                type="text"
                //name ="towns"
                value={newCampaignTowns}
                onChange={(event) =>
                  this.setState({ newCampaignTowns: event.target.value })
                }
              >
                <option>Choose</option>
                <option value="Warsaw">Warsaw</option>
                <option value="Kraków">Kraków</option>
                <option value="Kielce">Kielce</option>
                <option value="Gdańsk">Gdańsk</option>
                <option value="Poznań">Poznań</option>
                <option value="Radom">Radom</option>
                <option value="Katowice">Katowice</option>
                <option value="Szczecin">Szczecin</option>
              </select>
              <input
                id="input"
                type="number"
                value={newCampaignRadius}
                onChange={(event) =>
                  this.setState({ newCampaignRadius: event.target.value })
                }
                placeholder="Radius [km]"
              />
              <label>
                <input
                  id="checkbox"
                  type="checkbox"
                  checked={newCampaignPublished}
                  onChange={(event) =>
                    this.setState({
                      newCampaignPublished: event.target.checked,
                    })
                  }
                />
                Published
              </label>
              <TypeaheadComponent
                onKeywordsChange={this.handleKeywordsChange}
              />
              <button
                variant="primary"
                id="add-btn"
                type="submit"
                disabled={
                  // add campaign btn works only when the values are not null and bidAmount > 499
                  !this.state.newCampaignName ||
                  this.state.newCampaignFunds < 1 ||
                  !this.state.newCampaignKeywords ||
                  this.state.newCampaignBidAmount < 499 ||
                  !this.state.newCampaignTowns ||
                  this.state.newCampaignRadius < 0
                }
              >
                Add Campaign
              </button>
            </form>
          </div>
          <div id="footer">
            <p>Autor: Jakub Konior</p>
          </div>
        </header>
      </div>
    );
  }
}
export default App;
