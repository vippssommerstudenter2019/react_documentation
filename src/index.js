import React from 'react';
import ReactDOM from 'react-dom';
import { Sidebar } from './sidebar.js';
import { ContentField } from './content.js';
import './index.css';


// The entire page is contained here
class DocuPage extends React.Component{
    constructor(props) {
        super(props);
        this.urls = {
            ecom: "https://raw.githubusercontent.com/vippsas/vipps-ecom-api/master/vipps-ecom-api.md",
            login:"https://raw.githubusercontent.com/vippsas/vipps-login-api/master/vipps-login-api.md",
            invoice:"https://raw.githubusercontent.com/vippsas/vipps-invoice-api/master/vipps-invoice-api.md"
        }
        this.state = {
            fullText: "",
            headers: [],
            contents: [],
        }
    }

    componentDidMount() {
        this.getContent()
        .then(response => response.text().then(text => this.filterContent(text)))
    }

    // Fetches raw content from Github and puts it in the DocuPage state 
    getContent() {
        return fetch(this.urls[this.props.doc]);
    }

    // Returns a HTML anchor from a given header
    makeAnchor(level, string) {
        return "#" + string.replace(level, "").trim().replace(new RegExp(" ", 'g'),"-").toLowerCase()
    }

    // Filters the content fetched from Github into headers and content
    filterContent(data) {
        const lines = data.split("\n");
        let navbarHeaders = []
        let navbarHeader = {name: "", anchor: "", children: []}
        let content = [];
        lines.forEach((line) => {
            if (line.startsWith("###")) {
                return;
            } else if (line.startsWith("##")) {
                navbarHeader.children.push({name: line.replace("##", "").trim(), 
                    anchor: this.makeAnchor("##", line)});
            } else if (line.startsWith("#")) {
                navbarHeaders.push(navbarHeader);
                navbarHeader = {name: "", anchor: "", children: []}
                navbarHeader.name = line.replace("#", "").trim();
                navbarHeader.anchor = this.makeAnchor("#", line);
            } else {
                content.push(line);
            }
        });
        this.setState({headers: navbarHeaders.slice(1, navbarHeaders.length - 1), contents: content})
    }

    render() {
        return (
            <section className="DocuPage">
                <Sidebar headers={this.state.headers}/>
                <ContentField/>
            </section>
        )
    }
}

ReactDOM.render(
    <body>
        <DocuPage doc="ecom"/>
    </body>,
    document.getElementById('root')
)