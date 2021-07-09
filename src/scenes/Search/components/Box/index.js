import React from 'react';
import Graph from "react-graph-vis";
import { getGraph, findNeighbors, findGraphHistory } from '../../../../services/ApiService';

class Search_Box extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            properties: "",
            search: "",
            degree: 1,
            searchHistory: [],
            discoveryIndex: -1,
            discoveryHistory: [],
            freeze: false,
            result: "",
            defaultProperties: {
              "discovery": {
                  "nodes": [],
              },
              "search": {
                  "nodes": [],
                  "edges": []
              }
            },
            graphDiscovery: {
              nodes: [],
              edges: []
            },
            graphSearch: {
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
              height: "435px",
              width: "580px",
              nodes: {
                shape: "dot",
                size: 10,
                font: {
                  color: "#000000",
                  size: 13,
                  bold: {
                    mod: "bold"
                  }
                }
              }
            },
            eventsDiscovery: {
              select: (event) => {
                var { nodes, edges } = event;
                this.selectDiscovery(nodes, edges);
              },
            },
            eventsSearch: {
              select: (event) => {
                var { nodes, edges } = event;
                this.selectSearch(nodes, edges);
              },
            }
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleDegreeChange = this.handleDegreeChange.bind(this);
        this.onEnterPress = this.onEnterPress.bind(this);
        this.freezeClicked = this.freezeClicked.bind(this);
        this.clearSession = this.clearSession.bind(this);
        this.getNeighbors = this.getNeighbors.bind(this);
    }

    // componentDidMount() {
    // }

    componentDidMount() {
        getGraph()
        .then(({ data, error }) => {
            if (data) {
                this.setGraphDiscovery(data);
            }
        });
        // findGraphHistory(this.state.searchHistory)
        // .then(({ data, error }) => {
        //     if (data) {
        //         this.setGraphSearch(data);
        //     }
        // });
    }
    
    // componentDidUpdate() {
    //   console.log("componentDidUpdate")
    // }
    
    selectDiscovery = (nodes, edges) => {
        var properties = {
            "nodes": []
        }
        nodes.forEach(selectedNode => {
            this.state.graphDiscovery.nodes.forEach(node => {
                if (node.id === selectedNode) {
                    properties.nodes.push(node);
                    return;
                }
            });
        });
        this.setProperties(properties);
        if (properties.nodes.length > 0) {
            this.setDiscoveryHistory(properties.nodes[0].label)
            findNeighbors(properties.nodes[0].label)
            .then(({ data, error }) => {
                if (data) {
                    this.setGraphDiscovery(data);
                }
            });
        }
    }

    selectSearch = (nodes, edges) => {
        var properties = {
            "nodes": [],
            "edges": []
        }
        nodes.forEach(selectedNode => {
            this.state.graphSearch.nodes.forEach(node => {
                if (node.id === selectedNode) {
                    properties.nodes.push(node);
                    return;
                }
            });
        });
        edges.forEach(selectedEdge => {
            this.state.graphSearch.edges.forEach(edge => {
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
      
    setGraphDiscovery(data) {
        if (this.state.freeze) {
            return
        }
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
            graphDiscovery: { nodes: data.graph.nodes, edges: data.graph.edges }
        });
    }

    setGraphSearch(data) {
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
            graphSearch: { nodes: data.graph.nodes, edges: data.graph.edges }
        });
    }

    setProperties(propertiesJson) {
        propertiesJson.nodes.forEach(node => delete node.color);
        var propertiesString = "";
        if ((JSON.stringify(propertiesJson) !== JSON.stringify(this.state.defaultProperties.discovery)) &&
            (JSON.stringify(propertiesJson) !== JSON.stringify(this.state.defaultProperties.search))) {
            propertiesString = JSON.stringify(propertiesJson, undefined, 4);
        }
        this.setState({ 
            properties: propertiesString
        });
    }

    setSearchHistory(search) {
        var searchHistory = this.state.searchHistory;
        var test = search.split(", ");
        console.log(test)
        searchHistory.push(search);
        this.setState({ 
            searchHistory: test
        });
    }

    setDiscoveryHistory(search) {
        if (this.state.freeze) {
            return
        }
        var discoveryHistory = this.state.discoveryHistory;
        var indexToAdd = this.state.discoveryIndex+1;
        if (search != discoveryHistory[indexToAdd-1]) {
            discoveryHistory.splice(indexToAdd, discoveryHistory.length-indexToAdd, search);
            this.setState({ 
                discoveryHistory: discoveryHistory,
                discoveryIndex: indexToAdd
            });
        }
    }

    resetGraphDiscovery() {
        if (this.state.freeze) {
            return
        }
        this.setState({ 
            discoveryHistory: [],
            discoveryIndex: -1
        });
    }

    setDiscoveryIndex(discoveryIndex) {
        this.setState({ 
            discoveryIndex: discoveryIndex
        });
    }

    handleSearchChange(e) {
        this.setState({
            search: e.target.value
        })
    }

    handleDegreeChange(e) {
        this.setState({
            degree: e.target.value
        })
    }

    onEnterPress(e) {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            // this.setDiscoveryHistory(this.state.search)
            // findNeighbors(this.state.search)
            // .then(({ data, error }) => {
            //     if (data) {
            //         this.setGraphDiscovery(data);
            //     }
            // });
            this.setSearchHistory(this.state.search)
            findGraphHistory(this.state.search, this.state.degree)
            .then(({ data, error }) => {
                if (data) {
                    this.setGraphSearch(data);
                }
            });
        }
    }

    freezeClicked() {
        this.setState(prevState => ({
            freeze: !prevState.freeze
        }))
    }

    clearSession() {
        this.setState({
            searchHistory: []
        })
    }

    getNeighbors(reset, value) {
        var discoveryIndex = this.state.discoveryIndex + value;
        if (reset || discoveryIndex == -1) {
            if (reset) {
                this.resetGraphDiscovery();
            }
            this.setDiscoveryIndex(discoveryIndex)
            getGraph()
            .then(({ data, error }) => {
                if (data) {
                    this.setGraphDiscovery(data);
                }
            });
        } else if ((discoveryIndex >= 0) && (discoveryIndex < this.state.discoveryHistory.length)) {
            this.setDiscoveryIndex(discoveryIndex)
            findNeighbors(this.state.discoveryHistory[discoveryIndex])
            .then(({ data, error }) => {
                if (data) {
                    this.setGraphDiscovery(data);
                }
            });
        }
    }

    getStringifyValue(value) {
        if (Object.prototype.toString.call(value) == "[object String]") {
            value = value.split(", ");
        }
        return JSON.stringify(value, undefined, 0)
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
                            // height:690,
                            height:500,
                            // width:300,
                            width:235
                        }}
                        type="text"
                        placeholder="No item selected" 
                        value={this.state.properties}
                        readOnly={true}
                    />
                </div>
              </div>
              <div className="px-md-1 col-md-10">
                <div className="row">
                    <div className="px-md-2">
                        Search (Delimit by comma followed by a space ', '):
                        <div>
                            <textarea  
                                className="e-input"
                                style={{ 
                                    height:30,
                                    // width:1500,
                                    width:1000
                                }}
                                type="text"
                                placeholder="Please enter search text" 
                                value={this.state.search}
                                onChange={this.handleSearchChange}
                                onKeyDown={this.onEnterPress}
                            />
                        </div>
                    </div>
                    <div className="px-md-2">
                        Number of degree:
                        <div>
                            <textarea  
                                className="e-input"
                                style={{ 
                                    height:30,
                                    // width:1500,
                                    width:200
                                }}
                                type="text"
                                placeholder="Please enter degree" 
                                value={this.state.degree}
                                onChange={this.handleDegreeChange}
                                onKeyDown={this.onEnterPress}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="px-md-3 col-md-6">
                        Data Discovery
                        <div style={{border: '2px solid rgb(0, 0, 0)'}}>
                            <Graph
                                graph={this.state.graphDiscovery}
                                options={this.state.options}
                                events={this.state.eventsDiscovery}
                                getNetwork={network => {
                                    //  if you want access to vis.js network api you can set the state in a parent component using this property
                                }}
                            />
                        </div>
                        <button onClick={this.freezeClicked}>
                            {this.state.freeze ? "Graph Freezed" : "Graph Unfreezed"}
                        </button>
                        <button onClick={(e) => this.getNeighbors(true, 0)}>
                            Reset
                        </button>
                        <button onClick={(e) => this.getNeighbors(false, -1)}>
                            Previous
                        </button>
                        <button onClick={(e) => this.getNeighbors(false, 1)}>
                            Next
                        </button>
                        <br/>
                        {this.getStringifyValue(this.state.discoveryHistory)}
                    </div>
                    <div className="px-md-3 col-md-6">
                        Search Result
                        <div style={{border: '2px solid rgb(0, 0, 0)'}}>
                            <Graph
                                graph={this.state.graphSearch}
                                options={this.state.options}
                                events={this.state.eventsSearch}
                                getNetwork={network => {
                                    //  if you want access to vis.js network api you can set the state in a parent component using this property
                                }}
                            />
                        </div>
                        {/* <button onClick={this.clearSession}>
                            Clear Session
                        </button>
                        <br/> */}
                        {this.getStringifyValue(this.state.search)}
                    </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
    }
}
export default Search_Box;
