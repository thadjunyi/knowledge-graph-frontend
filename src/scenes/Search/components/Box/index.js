import React from 'react';
import Graph from "react-graph-vis";
import { getGraph, search } from '../../../../services/ApiService';

class Search_Box extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            properties: "",
            search: "",
            result: "",
            defaultProperties: {
              "nodes": [],
              "edges": []
            },
            graph: {
              nodes: [],
              edges: []
            },
            color: {},
            options: {
              layout: {
                hierarchical: false
              },
              edges: {
                color: "#000000"
              },
              interaction: {
                hover: true,
              },
            //   height: "350px",
              height: "270px",
              nodes: {
                shape: "circle",
                size: 1,
                font: {
                  color: "#000000",
                  size: 13,
                  bold: {
                    mod: "bold"
                  }
                }
              }
            },
            events: {
              select: (event) => {
                var { nodes, edges } = event;
                this.select(nodes, edges);
              },
            }
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onEnterPress = this.onEnterPress.bind(this);
    }

    // componentDidMount() {
    // }

    componentDidMount() {
        getGraph()
        .then(({ data, error }) => {
            if (data) {
                this.setGraph(data);
            }
        });
    }
    
    // componentDidUpdate() {
    //   console.log("componentDidUpdate")
    // }
    
    select = (nodes, edges) => {
        var properties = {
            "nodes": [],
            "edges": []
        }
        nodes.forEach(selectedNode => {
            this.state.graph.nodes.forEach(node => {
                if (node.id === selectedNode) {
                    properties.nodes.push(node);
                    return;
                }
            });
        });
        edges.forEach(selectedEdge => {
            this.state.graph.edges.forEach(edge => {
                if (edge.id === selectedEdge) {
                    properties.edges.push(edge);
                    return;
                }
            });
        });
        this.setProperties(properties);
    }
    
    randomColor() {
        const red = Math.floor(128 + Math.random() * (256-128)).toString(16).padStart(2, '0');
        const green = Math.floor(128 + Math.random() * (256-128)).toString(16).padStart(2, '0');
        const blue = Math.floor(128 + Math.random() * (256-128)).toString(16).padStart(2, '0');
        return `#${red}${green}${blue}`;
    }
      
    setGraph(data) {
        data.graph.nodes.forEach(node => {
            var type = node.type;
            var color = null;
            if (this.state.color[type] == null) {
                color = this.randomColor();
                this.state.color[type] = color;
            } else {
                color = this.state.color[type];
            }
            node['color'] = color;
        })
        this.setState({ 
            graph: { nodes: data.graph.nodes, edges: data.graph.edges }
        });
    }

    setProperties(propertiesJson) {
        var propertiesString = "";
        if (JSON.stringify(propertiesJson) !== JSON.stringify(this.state.defaultProperties)) {
            propertiesString = JSON.stringify(propertiesJson, undefined, 4);
        }
        this.setState({ 
            properties: propertiesString
        });
    }

    setResult(result) {
        this.setState({
            result: result
        })
    }

    handleChange(e) {
        this.setState({
            search: e.target.value
        })
    }

    onEnterPress(e) {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            console.log("Searching: " + this.state.search)
            search(this.state.search)
            .then(({ data, error }) => {
                if (data) {
                    this.setResult(data);
                }
            });
        }
      }

    render() {
        return (
          <React.Fragment>
            <div className="row">
              <div className="px-md-1 col-md-2">
                Properties:
                <div>
                    <textarea  
                        className="e-input"
                        style={{ 
                            // height:300,
                            height:200,
                            // width:300,
                            width:235
                        }}
                        type="text"
                        placeholder="No item selected" 
                        value={this.state.properties}
                        readOnly={true}
                    />
                </div>
                Focused Graph / Graph Overview:
                <div style={{border: '2px solid rgb(0, 0, 0)'}}>
                    <Graph
                        graph={this.state.graph}
                        options={this.state.options}
                        events={this.state.events}
                        getNetwork={network => {
                            //  if you want access to vis.js network api you can set the state in a parent component using this property
                        }}
                    />
                </div>
              </div>
              <div className="px-md-1 col-md-10">
                Search:
                <div>
                    <textarea  
                        className="e-input"
                        style={{ 
                            height:100,
                            // width:1500,
                            width:1000
                        }}
                        type="text"
                        placeholder="Please enter search text" 
                        value={this.state.search}
                        onChange={this.handleChange}
                        onKeyDown={this.onEnterPress}
                    />
                </div>
                Result:
                <div>
                    <textarea  
                        className="e-input"
                        style={{ 
                            // height:560,
                            height:400,
                            // width:1500,
                            width:1000
                        }}
                        type="text"
                        placeholder="No result found" 
                        value={this.state.result}
                        readOnly={true}
                    />
                </div>
              </div>
            </div>
          </React.Fragment>
        );
    }
}
export default Search_Box;
