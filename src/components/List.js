import React, { Component } from "react";
import axios from "axios";
import "./List.css";
import InfiniteScroll from "react-infinite-scroll-component";
import Popup from "reactjs-popup";

class List extends Component {
  state = {
    data: [],
    ended: false,
    page: 1,
  };

  getApiData = () => {
    // console.log(this.state.page);
    axios({
      method: "GET",
      // url: "https://openlibrary.org/search.json",
      url: "https://api.stackexchange.com/2.2/questions",
      // params: { q: "hello", page: this.state.page },
      params: {
        page: this.state.page,
        pagesize: 100,
        order: "desc",
        sort: "activity",
        site: "stackoverflow",
      },
    }).then((val) => {
      console.log(val.data.items);
      this.setState((prevState) => {
        return {
          data: [...prevState.data, ...val.data.items],
        };
      });
    });
  };
  componentDidMount() {
    this.getApiData();
  }

  callApiDataFun = () => {
    // console.log("call api data");
    this.setState(
      (prevState) => {
        return {
          page: prevState.page + 1,
        };
      },
      () => {
        this.getApiData();
      }
    );
  };

  render() {
    return (
      <div className="parent-div">
        {/* <div className="table-headings-cont">
          <h2 className="table-heading-one">Author</h2>
          <h2 className="table-heading-two">Title</h2>
          <h2 className="table-heading-three">Creation Date</h2>
        </div> */}

        <div className="table-content-cont">
          <h2 className="table-content-one">Author</h2>
          <h2 className="table-content-two">Title</h2>
          <h2 className="table-content-three">Creation Date</h2>
        </div>

        <InfiniteScroll
          dataLength={this.state.data.length}
          next={this.callApiDataFun}
          hasMore={!this.state.ended}
          loader={<h4>Loading...</h4>}
          scrollThreshold="0.5"
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {this.state.data.map((val, index) => {
            return (
              <Popup
                trigger={
                  <div className="table-content-cont" key={index}>
                    <h5 className="table-content-one">
                      {val.owner.display_name}
                    </h5>
                    <h5 className="table-content-two">{val.title}</h5>
                    <h5 className="table-content-three">
                      {new Date(val.creation_date).toString()}
                    </h5>
                  </div>
                }
                modal
                closeOnDocumentClick
              >
                <span>
                  <h5>{val.title}</h5>

                  <a href={val.link} target="_blank">
                    {val.link}
                  </a>
                </span>
              </Popup>
            );
          })}
        </InfiniteScroll>
      </div>
    );
  }
}

export default List;
