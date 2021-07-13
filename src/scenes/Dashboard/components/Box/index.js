import React from 'react';
import Graph from "react-graph-vis";
import { getGraph, findNeighbors } from '../../../../services/ApiService';
import '../../../../App.css';

class Dashboard_Box extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        monitor: true,
        properties: "",
        itemClicked: false,
        discoveryIndex: -1,
        discoveryHistory: [],
        freeze: false,
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
          height: "515px",
          width: "1220px",
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
        }
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.freezeClicked = this.freezeClicked.bind(this);
    this.getNeighbors = this.getNeighbors.bind(this);
  }

  componentDidMount() {
    this.computeScreenSize();
    getGraph()
    .then(({ data, error }) => {
      if (data) {
        console.log(data)
        this.setGraph(data);
      }
    });
  }

  // componentDidUpdate() {
  //   console.log("componentDidUpdate")
  // }

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
        height: this.state.monitor ? "730px" : "515px",
        width: this.state.monitor ? "1535px" : "1220px",
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
        },
        // physics: false
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

  doubleClick = (nodes, edges) => {
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
    if (properties.nodes.length > 0) {
        this.setDiscovery(properties.nodes[0].label, true)
    }
  }

  randomColor() {
    // Math.floor(128 + Math.random() * (256-128)).toString(16).padStart(2, '0');
    const red = Math.floor(0 + Math.random() * (256)).toString(16).padStart(2, '0');
    const green = Math.floor(0 + Math.random() * (256)).toString(16).padStart(2, '0');
    const blue = Math.floor(0 + Math.random() * (256)).toString(16).padStart(2, '0');
    return `#${red}${green}${blue}`;
  }
  
  setGraph(data) {
    data.graph.nodes.forEach(node => {
      var type = node.type;
      node['color'] = this.getColor(type);
    })
    this.setState({ 
      graph: { nodes: data.graph.nodes, edges: data.graph.edges }
    });
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
        findNeighbors(this.state.discoveryHistory[this.state.discoveryIndex])
        .then(({ data, error }) => {
          if (data) {
            this.setGraph(data);
          }
        });
      });
    }
  }

  resetGraph() {
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
  
  freezeClicked() {
    this.setState(prevState => ({
        freeze: !prevState.freeze
    }))
  }

  getNeighbors(reset, value) {
      var discoveryIndex = this.state.discoveryIndex + value;
      if (reset || discoveryIndex == -1) {
          if (reset) {
              this.resetGraph();
          }
          this.setDiscoveryIndex(-1)
          getGraph()
          .then(({ data, error }) => {
              if (data) {
                  this.setGraph(data);
              }
          });
      } else if ((discoveryIndex >= 0) && (discoveryIndex < this.state.discoveryHistory.length)) {
          this.setDiscoveryIndex(discoveryIndex)
          findNeighbors(this.state.discoveryHistory[discoveryIndex])
          .then(({ data, error }) => {
              if (data) {
                  this.setGraph(data);
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
                  <div><div className='dot' style={{backgroundColor: value}}></div>{key}</div>
                )}
              </ul>
            </div>
            <br/>
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
            Graph Overview:
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
        </div>
      </React.Fragment>
    );
  }
}
export default Dashboard_Box;
