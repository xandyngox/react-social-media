import React from "react";
import axios from "axios";

// https://picsum.photos/200

class Block extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.grabImage(this.props.imgid);
    this.grabcomments();
  }

  state = {
    var: "",
    comments: [],
  };

  grabcomments() {
    axios
      .get("http://localhost:3001/comments", { params: { id: this.props.id } })
      .then((response) => {
        this.setState({
          comments: response.data,
        });
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  grabImage(newid) {
    axios
      .get("https://picsum.photos/id/" + String(newid) + "/200", {
        responseType: "arraybuffer",
      }) //URL OF API, WITH OTHER PHOTO HANDLING FEATURES
      .then((res) => {
        this.setState({
          var: Buffer.from(res.data, "binary").toString("base64"),
        });
      }) //WHEN WE GRAB IMAGE INFORMATION WE CONVERT IT TO SOMETHING TO DISPLAY AND UPDATE THE STATE TO RERENDER
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  addcomment() {
    const string = document.getElementById(this.props.id + "commentbar").value;
    document.getElementById(this.props.id + "commentbar").value = "";

    var commentToPost = {
      id: this.props.id,
      newcomment: string,
    };
    axios
      .post("http://localhost:3001/updatecomment", commentToPost)

      .catch((error) => {
        console.error("There was an error!", error);
      });
    this.grabcomments();
  }

  render() {
    const comments = this.state.comments.map((comment) => (
      <ul key={comment + this.props.id}> {comment}</ul>
    ));

    const mystyle = {
      background: this.props.color,
    };

    return (
      <div>
        <div className="blockers" style={mystyle}>
          <img src={`data:image/jpeg;charset=utf-8;base64,${this.state.var}`} />
        </div>
        <div className="bottom">
          <div className="subcomm">
            <input
              id={this.props.id + "commentbar"}
              placeholder="Add comment"
            ></input>
            <button className="commentbutton" onClick={() => this.addcomment()}>
              Post
            </button>
          </div>
          <div className="comment-section">{comments}</div>
        </div>
      </div>
    );
  }
}

export default Block;
