import React from 'react';
import Graph from "react-graph-vis";
import { getGraph, findNeighbors, findSearchGraph, findRecommendGraph } from '../../../../services/ApiService';
import '../../../../App.css';

class Search_Box extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            monitor: false,
            properties: "",
            search: "",
            degree: 1,
            filter: "",
            index: -1,
            history: [],
            defaultProperties: {
                "nodes": [],
                "edges": []
            },
            graphSearchNodes: [],
            graphRecommendNodes: [],
            graphEdges: [],
            color: {},
            options: {
              height: "600px",
              width: "580px",
            },
            events: {
              select: (event) => {
                var { nodes, edges } = event;
                this.select(nodes, edges);
              },
              doubleClick: (event) => {
                var { nodes, edges } = event;
                this.doubleClick(nodes, edges);
              },
            },
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleDegreeChange = this.handleDegreeChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.onEnterPress = this.onEnterPress.bind(this);
        this.getHistory = this.getHistory.bind(this);
    }

    componentDidMount() {
        this.computeScreenSize();
        getGraph()
        .then(({ data, error }) => {
            if (data) {
                this.setGraphSearch(data);
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
    
    select = (nodes, edges) => {
        var properties = {
            "nodes": [],
            "edges": []
        }
        nodes.forEach(selectedNode => {
            this.state.graphSearchNodes.forEach(node => {
                if (node.id === selectedNode) {
                    properties.nodes.push(node);
                    return;
                }
            });
        });
        edges.forEach(selectedEdge => {
            this.state.graphEdges.forEach(edge => {
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
        this.state.graphSearchNodes.forEach(node => {
          if (node.id === selectedNode) {
            properties.nodes.push(node);
            return;
          }
        });
      });
      edges.forEach(selectedEdge => {
        this.state.graphEdges.forEach(edge => {
          if (edge.id === selectedEdge) {
            properties.edges.push(edge);
            return;
          }
        });
      });
      if (properties.nodes.length > 0) {
          this.addSearchHistory(properties.nodes[0].label, true);
      }
    }
    
    randomColor() {
        // Math.floor(128 + Math.random() * (256-128)).toString(16).padStart(2, '0');
        const red = Math.floor(0 + Math.random() * (256)).toString(16).padStart(2, '0');
        const green = Math.floor(0 + Math.random() * (256)).toString(16).padStart(2, '0');
        const blue = Math.floor(0 + Math.random() * (256)).toString(16).padStart(2, '0');
        return `#${red}${green}${blue}`;
    }

    async setGraphSearch(data) {
        data.graph.nodes.forEach(node => {
            var type = node.type;
            if (node['color'] == null) {
                node['color'] = this.getColor(type);
            }
        })
        this.setState({ 
            graphSearchNodes: data.graph.nodes, 
            graphEdges: data.graph.edges,
        });
    }

    async setGraphRecommend(data) {
        data.graph.nodes.forEach(node => {
            var type = node.type;
            if (node['color'] == null) {
                node['color'] = this.getColor(type);
            }
        })
        
        var found;
        var recommendNode;
        this.state.graphSearchNodes.forEach(searchNode => {
            found = false;
            for (var i=0; i<data.graph.nodes.length; i++) {
                recommendNode = data.graph.nodes[i];
                if (searchNode.id == recommendNode.id) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                data.graph.nodes.push(searchNode);
            }
        })
        if (this.state.graphEdges.length > 0) {
            this.setState({ 
                graphRecommendNodes: data.graph.nodes
            });
        } else {
            this.setState({ 
                graphRecommendNodes: []
            });
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

    getSearchList(newSearchText, referencePrevious) {
        var newSearchList = newSearchText.split(",");
        var searchList = newSearchList;
        
        if (referencePrevious && this.state.index >= 0) {
            searchList = [...this.state.history[this.state.index]];
            for (var i=0; i<newSearchList.length; i++) {
                if (searchList.includes(newSearchList[i])) {
                    for (var j=0; j<searchList.length; j++) {
                        if (searchList[j] === newSearchList[i]) {
                            searchList.splice(j, 1);
                            break;
                        }
                    }
                } else {
                    searchList.push(newSearchList[i])
                }
            }
        }
        return searchList;
    }

    addSearchHistory(newSearchText, referencePrevious) {
        if (newSearchText == "" || newSearchText == null) {
            return;
        }
        
        var searchList = this.getSearchList(newSearchText, referencePrevious);
        var searchString = searchList.toString();
        var history = this.state.history;
        var indexToAdd = this.state.index+1;

        if (searchList.length > 0) {
            if (JSON.stringify(searchList) != JSON.stringify(history[indexToAdd-1])) {
                history.splice(indexToAdd, history.length-indexToAdd, searchList);
                this.setState({
                    search: searchString,
                    history: history,
                    index: indexToAdd
                });
            }
            findSearchGraph(searchString, this.state.degree, this.state.filter)
            .then(({ data, error }) => {
                if (data) {
                    this.setGraphSearch(data)
                    .then(() => {
                        findRecommendGraph(searchString, this.state.filter)
                        .then(({ data, error }) => {
                            if (data) {
                                this.setGraphRecommend(data);
                            }
                        })
                    })
                }
            });
        }
    }

    resetHistory() {
        this.setState({ 
            history: [],
            index: -1
        });
    }

    resetGraph() {
        this.setState({ 
            search: "",
            graphSearchNodes: [],
            graphRecommendNodes: []
        });
    }

    setIndex(index) {
        this.setState({ 
            index: index
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

    onEnterPress(e) {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.addSearchHistory(this.state.search, false);
        }
    }

    getHistory(reset, value) {
        var index = this.state.index + value;
        if (reset) {
            this.resetHistory();
            this.resetGraph();
        } else if(index == -1) {
            this.setIndex(index);
            this.resetGraph();
            getGraph(this.state.search, this.state.filter)
            .then(({ data, error }) => {
                if (data) {
                    this.setGraphSearch(data);
                }
            });
        } else if ((index >= 0) && (index < this.state.history.length)) {
            var searchString = (this.state.history[index]).toString();
            this.setState({
                search: searchString,
                index: index
            });
            findSearchGraph(searchString, this.state.degree, this.state.filter)
            .then(({ data, error }) => {
                if (data) {
                    this.setGraphSearch(data)
                    .then(() => {
                        findRecommendGraph(searchString, this.state.filter)
                        .then(({ data, error }) => {
                            if (data) {
                                this.setGraphRecommend(data);
                            }
                        })
                    })
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
                            <div key="recommend"><div className='dot' style={{backgroundColor: "#00ff00"}}></div>*Recommended*</div>
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
                                    onKeyDown={this.onEnterPress}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="px-md-3 col-md-6">
                            Data Discovery:
                            <div style={{border: '2px solid rgb(0, 0, 0)'}}>
                                <Graph
                                    graph={{ nodes: this.state.graphSearchNodes, edges: this.state.graphEdges }}
                                    options={this.state.options}
                                    events={this.state.events}
                                    getNetwork={network => {
                                        //  if you want access to vis.js network api you can set the state in a parent component using this property
                                    }}
                                />
                            </div>
                            <button onClick={(e) => this.getHistory(true, 0)}>
                                Reset
                            </button>
                            <button onClick={(e) => this.getHistory(false, -1)}>
                                Previous
                            </button>
                            <button onClick={(e) => this.getHistory(false, 1)}>
                                Next
                            </button>
                            <br/>
                            Search History:
                            <br/>
                            {this.getStringifyValue(this.state.history)}
                        </div>
                        <div className="px-md-3 col-md-6">
                            Recommendation:
                            <div style={{border: '2px solid rgb(0, 0, 0)'}}>
                                <Graph
                                    graph={{ nodes: this.state.graphRecommendNodes, edges: this.state.graphEdges }}
                                    options={this.state.options}
                                    events={this.state.events}
                                    getNetwork={network => {
                                        //  if you want access to vis.js network api you can set the state in a parent component using this property
                                    }}
                                />
                            </div>
                            <br/>
                            Search Query:
                            <br/>
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
