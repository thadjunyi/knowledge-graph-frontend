import React from 'react';
import Graph from "react-graph-vis";
import { getGraph, findNeighbors, findSearchGraph, findPageRankGraph } from '../../../../services/ApiService';
import '../../../../App.css';

class Search_Box extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            monitor: true,
            properties: "",
            search: "",
            degree: 1,
            filter: "",
            showSearch: true,
            discoveryIndex: -1,
            discoveryHistory: [],
            freeze: false,
            defaultProperties: {
                "nodes": [],
                "edges": []
            },
            graphDiscovery: {
              nodes: [],
              edges: []
            },
            graph: {
              nodes: [],
              edges: []
            },
            graphSearch: {
              nodes: [],
              edges: []
            },
            graphPageRank: {
              nodes: [],
              edges: []
            },
            color: {},
            options: {
              height: "600px",
              width: "580px",
            },
            eventsDiscovery: {
              select: (event) => {
                var { nodes, edges } = event;
                this.selectDiscovery(nodes, edges);
              },
              doubleClick: (event) => {
                var { nodes, edges } = event;
                this.doubleClick(nodes, edges);
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
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.onEnterSearchPress = this.onEnterSearchPress.bind(this);
        this.onEnterFilterPress = this.onEnterFilterPress.bind(this);
        this.toggleFreeze = this.toggleFreeze.bind(this);
        this.toggleView = this.toggleView.bind(this);
        this.getNeighbors = this.getNeighbors.bind(this);
    }

    componentDidMount() {
        this.computeScreenSize();
        getGraph()
        .then(({ data, error }) => {
            if (data) {
                this.setGraphDiscovery(data);
            }
        });
    }

    //for usage, refer to https://github.com/visjs/vis-network/blob/master/docs/network/index.html
    computeScreenSize() {
        this.setState({
            options: {
              layout: {
                hierarchical: {
                    enabled: false,
                }
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
                },
              },
              physics: {
                forceAtlas2Based: {
                    gravitationalConstant: -26,
                    centralGravity: 0.005,
                    springLength: 230,
                    springConstant: 0,
                    avoidOverlap: 1.5
                },
                maxVelocity: 146,
                solver: 'forceAtlas2Based',
                timestep: 0.35,
                stabilization: {
                    enabled: true,
                    iterations: 200,
                    updateInterval: 25
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
    }

    doubleClick = (nodes, edges) => {
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
        // Math.floor(128 + Math.random() * (256-128)).toString(16).padStart(2, '0');
        const red = Math.floor(0 + Math.random() * (256)).toString(16).padStart(2, '0');
        const green = Math.floor(0 + Math.random() * (256)).toString(16).padStart(2, '0');
        const blue = Math.floor(0 + Math.random() * (256)).toString(16).padStart(2, '0');
        return `#${red}${green}${blue}`;
    }
      
    setGraphDiscovery(data) {
        data.graph.nodes.forEach(node => {
            var type = node.type;
            if (node['color'] == null) {
                node['color'] = this.getColor(type);
            }
        })
        this.setState({ 
            graphDiscovery: { nodes: data.graph.nodes, edges: data.graph.edges }
        });
    }

    setGraph(graphData) {
        this.setState({ 
            graph: { nodes: graphData.nodes, edges: graphData.edges }
        });
    }

    setGraphSearch(data) {
        data.graph.nodes.forEach(node => {
            var type = node.type;
            if (node['color'] == null) {
                node['color'] = this.getColor(type);
            }
        })
        this.setState({ 
            graphSearch: { nodes: data.graph.nodes, edges: data.graph.edges }
        });
        if (this.state.showSearch) {
            this.setGraph(data.graph)
        }
    }

    setGraphPageRank(data) {
        data.graph.nodes.forEach(node => {
            var type = node.type;
            if (node['color'] == null) {
                node['color'] = this.getColor(type);
            }
        })
        this.setState({ 
            graphPageRank: { nodes: data.graph.nodes, edges: data.graph.edges }
        });
        if (!this.state.showSearch) {
            this.setGraph(data.graph)
        }
    }

    getColor(type) {
        var filtered = ['Resource', '_GraphConfig', '_NsPrefDef'];
        var color = null;
        if (!filtered.includes(type)) {
            if (this.state.color[type] == null) {
                color = this.randomColor();
                this.state.color[type] = color;
            } else {
                color = this.state.color[type];
            }
        }
        return color;
    }

    setItemClicked(itemClicked) {
        this.setState({ 
          itemClicked: itemClicked
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

        if (discovery.length != 0) {
            if (JSON.stringify(discovery) != JSON.stringify(discoveryHistory[indexToAdd-1])) {
                discoveryHistory.splice(indexToAdd, discoveryHistory.length-indexToAdd, discovery);
                this.setState({
                    discoveryHistory: discoveryHistory,
                    discoveryIndex: indexToAdd
                    }
                    , () => {
                        findNeighbors(this.state.discoveryHistory[this.state.discoveryIndex], this.state.filter)
                        .then(({ data, error }) => {
                            if (data) {
                                this.setGraphDiscovery(data);
                            }
                        });
                    }
                );
            } else {
                findNeighbors(this.state.discoveryHistory[this.state.discoveryIndex], this.state.filter)
                .then(({ data, error }) => {
                    if (data) {
                        this.setGraphDiscovery(data);
                    }
                });
            }
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

    handleFilterChange(e) {
        this.setState({
            filter: e.target.value
        })
    }

    onEnterSearchPress(e) {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.setDiscovery(this.state.search, false)
            findSearchGraph(this.state.search, this.state.degree, this.state.filter)
            .then(({ data, error }) => {
                if (data) {
                    this.setGraphSearch(data);
                }
            });
            findPageRankGraph(this.state.search, this.state.filter)
            .then(({ data, error }) => {
                if (data) {
                    this.setGraphPageRank(data);
                }
            });
        }
    }

    onEnterFilterPress(e) {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.setDiscovery("", true)
            findSearchGraph(this.state.search, this.state.degree, this.state.filter)
            .then(({ data, error }) => {
                if (data) {
                    this.setGraphSearch(data);
                }
            });
            findPageRankGraph(this.state.search, this.state.filter)
            .then(({ data, error }) => {
                if (data) {
                    this.setGraphPageRank(data);
                }
            });
        }
    }

    toggleFreeze() {
        this.setState(prevState => ({
            freeze: !prevState.freeze
        }))
    }

    toggleView() {
        console.log('clicked toggle')
        this.setState(prevState => ({
            showSearch: !prevState.showSearch
        }), () => {
            if (this.state.showSearch) {
                this.setGraph(this.state.graphSearch);
            } else {
                this.setGraph(this.state.graphPageRank);
            }
        });
    }

    getNeighbors(reset, value) {
        var discoveryIndex = this.state.discoveryIndex + value;
        if (reset || discoveryIndex == -1) {
            if (reset) {
                this.resetGraphDiscovery();
            }
            this.setDiscoveryIndex(-1)
            getGraph(this.state.search, this.state.filter)
            .then(({ data, error }) => {
                if (data) {
                    this.setGraphDiscovery(data);
                }
            });
        } else if ((discoveryIndex >= 0) && (discoveryIndex < this.state.discoveryHistory.length)) {
            this.setDiscoveryIndex(discoveryIndex)
            findNeighbors(this.state.discoveryHistory[discoveryIndex], this.state.filter)
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
                    Legend:
                    <div>
                        <ul>
                            {Object.entries(this.state.color).map(([key, value]) => 
                                <div key={key}><div className='dot' style={{backgroundColor: value}}></div>{key}</div>
                            )}
                        </ul>
                    </div>
                    <br/>
                    {this.state.itemClicked == true ?
                        <div key={this.state.properties['id']}>
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
                                    onKeyDown={this.onEnterSearchPress}
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
                                    onKeyDown={this.onEnterSearchPress}
                                />
                            </div>
                        </div>
                        <div className="px-md-2">
                            Filter (Delimit by comma ','):
                            <div>
                                <textarea  
                                    className="e-input"
                                    style={{ 
                                        height: this.state.monitor ? 30 : 30,
                                        width: this.state.monitor ? 1518 : 1200,
                                    }}
                                    type="text"
                                    placeholder="Please enter filter text" 
                                    value={this.state.filter}
                                    onChange={this.handleFilterChange}
                                    onKeyDown={this.onEnterFilterPress}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="px-md-3 col-md-6">
                            Data Discovery:
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
                            <button onClick={this.toggleFreeze}>
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
                            Search Result:
                            <div style={{border: '2px solid rgb(0, 0, 0)'}}>
                                <Graph
                                    graph={this.state.graph}
                                    options={this.state.options}
                                    events={this.state.eventsSearch}
                                    getNetwork={network => {
                                        //  if you want access to vis.js network api you can set the state in a parent component using this property
                                    }}
                                />
                            </div>
                            <button onClick={this.toggleView}>
                                {this.state.showSearch ? "Search View" : "Page Rank View"}
                            </button>
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
