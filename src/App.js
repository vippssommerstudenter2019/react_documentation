import React from "react";
import ReactDOM from "react-dom";
import { Sidebar } from "./sidebar.js";
import MarkdownHTML from "./components/MarkdownHTML/MarkdownHTML.js";
import "./vippsstyle.css";
import "./style.css";
import "./prism.css";

// The entire page is contained here
class DocuPage extends React.Component {
  constructor(props) {
    super(props);
    this.urls = {
      ecom:
        "https://raw.githubusercontent.com/vippsas/vipps-ecom-api/master/vipps-ecom-api.md",
      login:
        "https://raw.githubusercontent.com/vippsas/vipps-login-api/master/vipps-login-api.md",
      invoice:
        "https://raw.githubusercontent.com/vippsas/vipps-invoice-api/master/vipps-invoice-api.md"
    };
    this.state = {
      fullText: "",
      headers: [],
      contents: []
    };
  }

  componentDidMount() {
    this.getContent().then(response =>
      response.text().then(text => this.filterContent(text))
    );
    console.log("mounting");
  }

  // Fetches raw content from Github and puts it in the DocuPage state
  getContent() {
    return fetch(this.urls[this.props.doc]);
  }

  // Returns a HTML anchor from a given header
  makeAnchor(level, string) {
    return (
      "#" +
      string
        .replace(level, "")
        .trim()
        .replace(new RegExp(" ", "g"), "-")
        .toLowerCase()
    );
  }

  // Filters the content fetched from Github into headers and content
  filterContent(data) {
    this.setState({ fullText: data });
    console.log("Fra Lars Martins kode nr 1: " + data );
    const lines = data.split("\n");
    let navbarHeaders = [];
    let navbarHeader = { name: "", anchor: "", children: [] };
    let content = [];
    lines.forEach(line => {
      if (line.startsWith("###")) {
        return;
      } else if (line.startsWith("##")) {
        navbarHeader.children.push({
          name: line.replace("##", "").trim(),
          anchor: this.makeAnchor("##", line)
        });
      } else if (line.startsWith("#")) {
        navbarHeaders.push(navbarHeader);
        navbarHeader = { name: "", anchor: "", children: [] };
        navbarHeader.name = line.replace("#", "").trim();
        navbarHeader.anchor = this.makeAnchor("#", line);
      } else {
        content.push(line);
      }
    });
    this.setState({
      headers: navbarHeaders.slice(1, navbarHeaders.length - 1),
      contents: content
    });
  }

  render() {
    console.log("lol" + this.state.fullText);
    return (
      <div className="container bold">
        <div className="sidebar">
          <Sidebar dataFelt={"Ett eller annet her"} />
        </div>
        <div className="content">
          <MarkdownHTML
            key={0}
            url={"https://raw.githubusercontent.com/vippsas/vipps-ecom-api/master/vipps-ecom-api.md"}
            text={this.state.fullText}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<DocuPage doc="login" />, document.getElementById("root"));
