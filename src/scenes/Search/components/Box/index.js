import React from 'react';
import Graph from "react-graph-vis";
import { getAllRecommended, findSearchGraph, findRecommendGraph, findLinkageGraph, findFocusGraph } from '../../../../services/ApiService';
import '../../../../App.css';

class Search_Box extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            monitor: true,
            properties: "",
            itemClicked: false,
            search: "",
            discoverySearch: "",
            degree: 1,
            typeFilter: "Article",
            nodesNum: 5,
            index: -1,
            history: [],
            defaultProperties: {
                "nodes": [],
                "edges": []
            },
            graph: {
              loading: false,
              nodes: [],
              edges: []
            },
            graphRecommend: {
                loading: false,
                nodes: [],
                edges: []
            },
            graphLinkage: {
                loading: false,
                nodes: [],
                edges: []
            },
            graphFocus: {
                loading: false,
                nodes: [],
                edges: []
            },
            color: {},
            options: {
              height: "600px",
              width: "580px",
            },
            graphEvents: {
                select: (event) => {
                var { nodes, edges } = event;
                this.selectGraph(nodes, edges);
              },
              doubleClick: (event) => {
                var { nodes, edges } = event;
                this.doubleClickGraph(nodes, edges);
              },
            },
            graphRecommendEvents: {
                select: (event) => {
                var { nodes, edges } = event;
                this.selectGraphRecommend(nodes, edges);
              },
              doubleClick: (event) => {
                var { nodes, edges } = event;
                this.doubleClickGraphRecommend(nodes, edges);
              },
            },
            graphLinkageEvents: {
                select: (event) => {
                var { nodes, edges } = event;
                this.selectGraphLinkage(nodes, edges);
              }
            },
            graphFocusEvents: {
              select: (event) => {
                var { nodes, edges } = event;
                this.selectGraphFocus(nodes, edges);
              },
            },
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleDegreeChange = this.handleDegreeChange.bind(this);
        this.handleDiscoverySearchChange = this.handleDiscoverySearchChange.bind(this);
        this.handleTypeFilterChange = this.handleTypeFilterChange.bind(this);
        this.handleNodesNumChange = this.handleNodesNumChange.bind(this);
        this.onEnterPress = this.onEnterPress.bind(this);
        this.onEnterDiscoveryPress = this.onEnterDiscoveryPress.bind(this);
        this.getHistory = this.getHistory.bind(this);
    }

    componentDidMount() {
        this.computeScreenSize();
        this.setGraphLoading(true);
        getAllRecommended()
        .then(({ data, error }) => {
            if (data) {
                this.setGraph(data);
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
    
    selectGraph = (nodes, edges) => {
        this.select(this.state.graph, nodes, edges);
    }
    
    selectGraphRecommend = (nodes, edges) => {
        this.select(this.state.graphRecommend, nodes, edges);
    }
    
    selectGraphLinkage = (nodes, edges) => {
        this.select(this.state.graphLinkage, nodes, edges);
    }
    
    selectGraphFocus = (nodes, edges) => {
        this.select(this.state.graphFocus, nodes, edges);
    }

    select = (graph, nodes, edges) => {
        var properties = {
            "nodes": [],
            "edges": []
        }
        nodes.forEach(selectedNode => {
            graph.nodes.forEach(node => {
                if (node.id === selectedNode) {
                    properties.nodes.push(node);
                    return;
                }
            });
        });
        edges.forEach(selectedEdge => {
            graph.edges.forEach(edge => {
                if (edge.id === selectedEdge) {
                    properties.edges.push(edge);
                    return;
                }
            });
        });
        this.setProperties(properties);
    }
    
    doubleClickGraph = (nodes, edges) => {
        this.doubleClick(this.state.graph, nodes, edges);
    }
    
    doubleClickGraphRecommend = (nodes, edges) => {
        this.doubleClick(this.state.graphRecommend, nodes, edges);
    }

    doubleClick = (graph, nodes, edges) => {
      var properties = {
        "nodes": [],
        "edges": []
      }
      nodes.forEach(selectedNode => {
        graph.nodes.forEach(node => {
          if (node.id === selectedNode) {
            properties.nodes.push(node);
            return;
          }
        });
      });
      edges.forEach(selectedEdge => {
        graph.edges.forEach(edge => {
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

    getSearchString(searchList) {
      var searchString = "";
      for (var i=0; i<searchList.length; i++) {
        searchString += searchList[i]
        if (i != searchList.length-1) {
          searchString += '|'
        }
      }
      return searchString;
    }

    getHistory(reset, value) {
        var index = this.state.index + value;

        if (reset || index == -1) {
            if (reset) {
                this.resetHistory();
            }
            this.setHistoryIndex(-1, "");
            this.setGraphLoading(true);
            getAllRecommended()
            .then(({ data, error }) => {
                if (data) {
                    this.setGraph(data);
                }
            });
            this.resetGraph();
            
        } else if ((index >= 0) && (index < this.state.history.length)) {
            var searchString = this.getSearchString(this.state.history[index]);
            this.setHistoryIndex(index, searchString);
            this.setGraphLoading(true);
            findSearchGraph(searchString, this.state.degree)
            .then(({ data, error }) => {
                if (data) {
                    this.setGraph(data)
                }
            });
            this.setGraphRecommendLoading(true);
            findRecommendGraph(searchString, this.state.degree)
            .then(({ data, error }) => {
                if (data) {
                    this.setGraphRecommend(data);
                }
            })
        }
    }

    getSearchList(newSearchText, referencePrevious) {
        var newSearchList = newSearchText.split("|");
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
                    searchList.push(newSearchList[i]);
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
        var searchString = this.getSearchString(searchList);
        var history = this.state.history;
        var indexToAdd = this.state.index+1;

        if (searchList.length > 0) {
            if (JSON.stringify(searchList) != JSON.stringify(history[indexToAdd-1])) {
                history.splice(indexToAdd, history.length-indexToAdd, searchList);
                this.setHistory(history);
                this.setHistoryIndex(indexToAdd, searchString);
            }
            this.setGraphLoading(true);
            findSearchGraph(searchString, this.state.degree)
            .then(({ data, error }) => {
                if (data) {
                    this.setGraph(data);
                }
            });
            this.setGraphRecommendLoading(true);
            findRecommendGraph(searchString, this.state.degree)
            .then(({ data, error }) => {
                if (data) {
                    this.setGraphRecommend(data);
                }
            })
        }
    }

    discoverySearch() {
        var discoverySearchList = this.state.discoverySearch.split("|");
        var discoverySearchString = this.getSearchString(discoverySearchList);

        if (discoverySearchList.length > 0) {
            this.setGraphLinkageLoading(true);
            findLinkageGraph(discoverySearchString)
            .then(({ data, error }) => {
                if (data) {
                    console.log(data);
                    this.setGraphLinkage(data);
                }
            })
            this.setGraphFocusLoading(true);
            findFocusGraph(discoverySearchString, this.state.typeFilter, this.state.nodesNum)
            .then(({ data, error }) => {
                if (data) {
                    console.log(data);
                    this.setGraphFocus(data);
                }
            })
        }
    }

    setHistoryIndex(index, search) {
      this.setState({ 
        index: index,
        search: search,
        discoverySearch: search
      });
    }
  
    setHistory(history) {
      this.setState({ 
        history: history
      });
    }
  
    setGraphLoading(value) {
      this.setState(prevState => ({ 
        graph: { ...prevState.graph, loading: value }
      }));
    }
  
    setGraphRecommendLoading(value) {
      this.setState(prevState => ({ 
        graphRecommend: { ...prevState.graphRecommend, loading: value }
      }));
    }
  
    setGraphLinkageLoading(value) {
      this.setState(prevState => ({ 
        graphLinkage: { ...prevState.graphLinkage, loading: value }
      }));
    }
  
    setGraphFocusLoading(value) {
      this.setState(prevState => ({ 
        graphFocus: { ...prevState.graphFocus, loading: value }
      }));
    }
  
    setGraph(data) {
        data.graph.nodes.forEach(node => {
            var type = node.type;
            node['color'] = this.getColor(type);
        })
        this.setState({ 
            graph: { loading: false, nodes: data.graph.nodes, edges: data.graph.edges }
        });
    }

    setGraphRecommend(data) {
        data.graph.nodes.forEach(node => {
            var type = node.type;
            if (node['color'] == null) {
                node['color'] = this.getColor(type);
            }
        })
        this.setState({ 
            graphRecommend: { loading: false, nodes: data.graph.nodes, edges: data.graph.edges }
        });
    }

    setGraphLinkage(data) {
        data.graph.nodes.forEach(node => {
            var type = node.type;
            node['color'] = this.getColor(type);
        })
        this.setState({ 
            graphLinkage: { loading: false, nodes: data.graph.nodes, edges: data.graph.edges }
        });
    }

    setGraphFocus(data) {
        data.graph.nodes.forEach(node => {
            var type = node.type;
            if (node['color'] == null) {
                node['color'] = this.getColor(type);
            }
        })
        this.setState({ 
            graphFocus: { loading: false, nodes: data.graph.nodes, edges: data.graph.edges }
        });
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

    getStringifyValue(value) {
        if (Object.prototype.toString.call(value) == "[object String]") {
            value = value.split("|");
        }
        return JSON.stringify(value, undefined, 0)
    }

    resetHistory() {
        this.setState({
            history: [],
            index: -1
        });
    }

    resetGraph() {
        this.setState({
            graphRecommend: {
                loading: false,
                nodes: [],
                edges: []
            },
            graphLinkage: {
                loading: false,
                nodes: [],
                edges: []
            },
            graphFocus: {
                loading: false,
                nodes: [],
                edges: []
            }
        })
    }

    handleSearchChange(e) {
        this.setState({
            search: e.target.value,
            discoverySearch: e.target.value
        })
    }

    handleDegreeChange(e) {
        this.setState({
            degree: e.target.value
        })
    }

    handleDiscoverySearchChange(e) {
        this.setState({
            discoverySearch: e.target.value
        })
    }

    handleTypeFilterChange(e) {
        this.setState({
            typeFilter: e.target.value
        })
    }

    handleNodesNumChange(e) {
        this.setState({
            nodesNum: e.target.value
        })
    }

    onEnterPress(e) {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.addSearchHistory(this.state.search, false);
        }
    }

    onEnterDiscoveryPress(e) {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.discoverySearch();
        }
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
                        <div key={this.state.properties['id']} className="ow-anywhere">
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
                            Discovery Search (Delimit by pipe '|'):
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
                    </div>
                    <div className="row">
                        <div className="px-md-3 col-md-6">
                            {/* Search History:
                            <br/>
                            {this.getStringifyValue(this.state.history)}
                            <br/> */}
                            {this.state.graph.loading == true &&
                                <div id="spinner" style={{ top: "50%" }}>
                                    <i
                                    className="fa fa-spinner fa-pulse fa-3x fa-fw"
                                    style={{ fontSize: 36, color: "#ef6c00" }}
                                    />
                                </div>
                            }
                            Graph Overview:
                            <div style={{border: '2px solid rgb(0, 0, 0)'}}>
                                <Graph
                                    graph={this.state.graph}
                                    options={this.state.options}
                                    events={this.state.graphEvents}
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
                        </div>
                        <div className="px-md-3 col-md-6">
                            {/* Search Query:
                            <br/>
                            {this.state.index} {this.state.search}
                            <br/> */}
                            {this.state.graphRecommend.loading == true &&
                                <div id="spinner" style={{ top: "50%" }}>
                                    <i
                                    className="fa fa-spinner fa-pulse fa-3x fa-fw"
                                    style={{ fontSize: 36, color: "#ef6c00" }}
                                    />
                                </div>
                            }
                            Recommendation:
                            <div style={{border: '2px solid rgb(0, 0, 0)'}}>
                                <Graph
                                    graph={this.state.graphRecommend}
                                    options={this.state.options}
                                    events={this.state.graphRecommendEvents}
                                    getNetwork={network => {
                                        //  if you want access to vis.js network api you can set the state in a parent component using this property
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className="row px-md-2">
                        <div className="px-md-2">
                            Discovery Search (Delimit by pipe '|'):
                            <div>
                                <textarea  
                                    className="e-input"
                                    style={{ 
                                        height: this.state.monitor ? 30 : 30,
                                        width: this.state.monitor ? 1518 : 1200,
                                    }}
                                    type="text"
                                    placeholder="Please enter discovery search text" 
                                    value={this.state.discoverySearch}
                                    onChange={this.handleDiscoverySearchChange}
                                    onKeyDown={this.onEnterDiscoveryPress}
                                />
                            </div>
                        </div>
                        <div className="row px-md-3">
                            <div className="px-md-2">
                                Filter by Type (Delimit by pipe '|'):
                                <div>
                                    <textarea  
                                        className="e-input"
                                        style={{ 
                                            height: this.state.monitor ? 30 : 30,
                                            width: this.state.monitor ? 1300 : 1000,
                                        }}
                                        type="text"
                                        placeholder="Please enter type filter" 
                                        value={this.state.typeFilter}
                                        onChange={this.handleTypeFilterChange}
                                        onKeyDown={this.onEnterDiscoveryPress}
                                    />
                                </div>
                            </div>
                            <div className="px-md-2">
                                Number of node:
                                <div>
                                    <textarea  
                                        className="e-input"
                                        style={{ 
                                            height: this.state.monitor ? 30 : 30,
                                            width: this.state.monitor ? 200 : 185,
                                        }}
                                        type="text"
                                        placeholder="Please enter number of nodes to display" 
                                        value={this.state.nodesNum}
                                        onChange={this.handleNodesNumChange}
                                        onKeyDown={this.onEnterDiscoveryPress}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="px-md-3 col-md-6">
                            {this.state.graphLinkage.loading == true &&
                                <div id="spinner" style={{ top: "50%" }}>
                                    <i
                                    className="fa fa-spinner fa-pulse fa-3x fa-fw"
                                    style={{ fontSize: 36, color: "#ef6c00" }}
                                    />
                                </div>
                            }
                            Selected Nodes Linkage Overview:
                            <div style={{border: '2px solid rgb(0, 0, 0)'}}>
                                <Graph
                                    graph={this.state.graphLinkage}
                                    options={this.state.options}
                                    events={this.state.graphLinkageEvents}
                                    getNetwork={network => {
                                        //  if you want access to vis.js network api you can set the state in a parent component using this property
                                    }}
                                />
                            </div>
                        </div>
                        <div className="px-md-3 col-md-6">
                            {this.state.graphFocus.loading == true &&
                                <div id="spinner" style={{ top: "50%" }}>
                                    <i
                                    className="fa fa-spinner fa-pulse fa-3x fa-fw"
                                    style={{ fontSize: 36, color: "#ef6c00" }}
                                    />
                                </div>
                            }
                            Selected Nodes Focused View:
                            <div style={{border: '2px solid rgb(0, 0, 0)'}}>
                                <Graph
                                    graph={this.state.graphFocus}
                                    options={this.state.options}
                                    events={this.state.graphFocusEvents}
                                    getNetwork={network => {
                                        //  if you want access to vis.js network api you can set the state in a parent component using this property
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </React.Fragment>
        );
    }
}
export default Search_Box;
