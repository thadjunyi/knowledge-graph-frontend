import React from 'react';
import Graph from "react-graph-vis";
import { getGraph, findNeighbors, findGraph } from '../../../../services/ApiService';

class Search_Box extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            monitor: false,
            properties: "",
            search: "",
            degree: 1,
            blacklist: "",
            discoveryIndex: -1,
            discoveryHistory: [],
            freeze: false,
            result: "",
            defaultProperties: {
                "nodes": [],
                "edges": []
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
                color: "#000000",
                width: 0.5
              },
              interaction: {
                hover: true,
              },
              height: "600px",
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
        this.handleBlacklistChange = this.handleBlacklistChange.bind(this);
        this.onEnterPress = this.onEnterPress.bind(this);
        this.freezeClicked = this.freezeClicked.bind(this);
        this.getNeighbors = this.getNeighbors.bind(this);
    }

    // componentDidMount() {
    // }

    componentDidMount() {
        this.computeScreenSize();
        getGraph(this.state.search)
        .then(({ data, error }) => {
            if (data) {
                this.setGraphDiscovery(data);
            }
        });
        // findGraph(this.state.search, this.state.degree)
        // .then(({ data, error }) => {
        //     if (data) {
        //         this.setGraphSearch(data);
        //     }
        // });
    }
    
    // componentDidUpdate() {
    //   console.log("componentDidUpdate")
    // }

    computeScreenSize() {
        this.setState({
            options: {
              layout: {
                hierarchical: true
              },
              edges: {
                color: "#000000",
                width: 0.5
              },
              interaction: {
                hover: true,
              },
              height: this.state.monitor ? "600px" : "600px",
              width: this.state.monitor ? "740px" : "580px",
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
            }
        })
    }
    
    selectDiscovery = (nodes, edges) => {
        var properties = {
            "nodes": [],
            "edges": []
        }
        nodes.forEach(selectedNode => {
            this.state.graphDiscovery.nodes.forEach(node => {
                if (node.id === selectedNode) {
                    properties.nodes.push(node);
                    return;
                }
            });
        });
        edges.forEach(selectedEdge => {
            this.state.graphDiscovery.edges.forEach(edge => {
                if (edge.id === selectedEdge) {
                    properties.edges.push(edge);
                    return;
                }
            });
        });
        this.setProperties(properties);
        if (properties.nodes.length > 0) {
            this.setDiscovery(properties.nodes[0].label, true)
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
            if (node['color'] == null) {
                if (this.state.color[type] == null) {
                    color = this.randomColor();
                    this.state.color[type] = color;
                } else {
                    color = this.state.color[type];
                }
                node['color'] = color;
            }
        })
        this.setState({ 
            graphSearch: { nodes: data.graph.nodes, edges: data.graph.edges }
        });
    }

    setProperties(propertiesJson) {

        this.setItemClicked(true);
        if (JSON.stringify(propertiesJson) === JSON.stringify(this.state.defaultProperties)) {
          this.setItemClicked(false);
          return;
        }
    
        var properties = {};
        properties['group'] = {};
        propertiesJson.nodes.forEach(node => {
          Object.entries(node).map(([key, value]) => {
            properties[key] = value
          })
        })
        propertiesJson.edges.forEach(edge => {
          var itemToAdd = [];
          if (properties['id'] == null) {
            properties['id'] = edge['id']
            properties['label'] = edge['label']
            itemToAdd.push(edge['fromLabel']);
            itemToAdd.push(edge['toLabel']);
            console.log(itemToAdd)
          } else {
    
            if (edge['fromLabel'] != properties['label']) {
              itemToAdd.push(edge['fromLabel']);
            } else {
              itemToAdd.push(edge['toLabel']);
            }
          }
          if (edge['label'] in properties['group']) {
            properties['group'][edge['label']] = properties['group'][edge['label']].concat(itemToAdd);
          } else {
            properties['group'][edge['label']] = [...itemToAdd];
          }
        })
        this.setState({ 
          properties: properties
        });
      }

    getDiscovery(search, referencePrevious) {
        var search = search.split(",");
        var discovery = search;
        if (referencePrevious) {
            if (this.state.discoveryIndex >= 0) {
                discovery = [...this.state.discoveryHistory[this.state.discoveryIndex]];
            } else {
                discovery = [];
            }
            for (var i=0; i<search.length; i++) {
                if (discovery.includes(search[i])) {
                    for (var j=0; j<discovery.length; j++) {
                        if (discovery[j] === search[i]) {
                            discovery.splice(j, 1);
                            break;
                        }
                    }
                } else {
                    discovery.push(search[i])
                }
            }
        }
        return discovery;
    }

    setDiscovery(search, referencePrevious) {
        if (this.state.freeze) {
            this.getNeighbors(false, 0);
            return;
        }
        var discovery = this.getDiscovery(search, referencePrevious);
        var discoveryHistory = this.state.discoveryHistory;
        var indexToAdd = this.state.discoveryIndex+1;

        if (discovery.length != 0 && JSON.stringify(discovery) != JSON.stringify(discoveryHistory[indexToAdd-1])) {
            discoveryHistory.splice(indexToAdd, discoveryHistory.length-indexToAdd, discovery);
            this.setState({
                discoveryHistory: discoveryHistory,
                discoveryIndex: indexToAdd
                }
                , () => {
                    console.log(discoveryHistory);
                    findNeighbors(this.state.discoveryHistory[this.state.discoveryIndex])
                    .then(({ data, error }) => {
                        if (data) {
                            this.setGraphDiscovery(data);
                        }
                    }
                );
            });
        }
    }

    setItemClicked(itemClicked) {
        this.setState({ 
          itemClicked: itemClicked
        });
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

    handleBlacklistChange(e) {
        this.setState({
            blacklist: e.target.value
        })
    }

    onEnterPress(e) {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.setDiscovery(this.state.search, false)
            findGraph(this.state.search, this.state.degree, this.state.blacklist)
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

    getNeighbors(reset, value) {
        var discoveryIndex = this.state.discoveryIndex + value;
        if (reset || discoveryIndex == -1) {
            if (reset) {
                this.resetGraphDiscovery();
            }
            this.setDiscoveryIndex(-1)
            getGraph(this.state.search)
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
            value = value.split(",");
        }
        return JSON.stringify(value, undefined, 0)
    }

    render() {
        return (
          <React.Fragment>
            <div className="row">
                <div className="px-md-1 col-md-2">
                    {this.state.itemClicked == true ?
                        <div>
                            <div className="row">id: {this.state.properties['id']}</div>
                            <div className="row">type: {this.state.properties['type']}</div>
                            <div className="row">label: {this.state.properties['label']}</div>
                            <br/>
                            <div className="row">Properties:</div>
                            {this.state.properties.properties != null &&
                            <ul>
                                {Object.entries(this.state.properties.properties).map(([key, value]) => 
                                    <li key={key}>{key}: {value}</li>
                                )}
                            </ul>
                            }
                            <br/>
                            <div className="row">Group:</div>
                            {this.state.properties.group != null &&
                                <ul>
                                    {Object.entries(this.state.properties.group).map(([groupKey, groupValue]) =>
                                        <div>
                                            <li key={groupKey}>{groupKey}: </li>
                                            <ul>
                                                {Object.entries(this.state.properties.group[groupKey]).map(([key, value]) => 
                                                    <li key={key}>{value}</li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </ul>
                            }
                        </div>
                        :
                        <div>
                            No item selected
                        </div>
                    }
                </div>
                <div className="px-md-1 col-md-10">
                    <div className="row px-md-2">
                        <div className="px-md-2">
                            Search (Delimit by comma ','):
                            <div>
                                <textarea  
                                    className="e-input"
                                    style={{ 
                                        height: 30,
                                        width: this.state.monitor ? 1300 : 1000,
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
                                        height: 30,
                                        width: this.state.monitor ? 200 : 185,
                                    }}
                                    type="text"
                                    placeholder="Please enter degree" 
                                    value={this.state.degree}
                                    onChange={this.handleDegreeChange}
                                    onKeyDown={this.onEnterPress}
                                />
                            </div>
                        </div>
                        <div className="px-md-2">
                            Blacklist (Delimit by comma ','):
                            <div>
                                <textarea  
                                    className="e-input"
                                    style={{ 
                                        height: this.state.monitor ? 30 : 30,
                                        width: this.state.monitor ? 1518 : 1200,
                                    }}
                                    type="text"
                                    placeholder="Please enter blacklist text" 
                                    value={this.state.blacklist}
                                    onChange={this.handleBlacklistChange}
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
                            {/* <br/>
                            {this.getStringifyValue(this.state.discoveryHistory)} */}
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
                            {/* {this.getStringifyValue(this.state.search)} */}
                        </div>
                    </div>
                </div>
            </div>
          </React.Fragment>
        );
    }
}
export default Search_Box;
