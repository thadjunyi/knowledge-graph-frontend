import React from 'react';
import Graph from "react-graph-vis";
import { getAll, findNeighbors } from '../../../../services/ApiService';
import '../../../../App.css';

class Dashboard_Box extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        monitor: true,
        properties: "",
        itemClicked: false,
        search: "",
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
        color: {},
        options: {
          height: "515px",
          width: "1200px",
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
    this.getHistory = this.getHistory.bind(this);
  }

  componentDidMount() {
    this.computeScreenSize();
    this.setGraphLoading(true);
    getAll()
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
        height: this.state.monitor ? "730px" : "515px",
        width: this.state.monitor ? "1535px" : "1200px",
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
          getAll()
          .then(({ data, error }) => {
              if (data) {
                  this.setGraph(data);
              }
          });
      } else if ((index >= 0) && (index < this.state.history.length)) {
        var searchString = this.getSearchString(this.state.history[index]);
        this.setHistoryIndex(index, searchString);
        this.setGraphLoading(true);
        findNeighbors(searchString)
        .then(({ data, error }) => {
            if (data) {
                this.setGraph(data);
            }
        });
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
      findNeighbors(searchString)
      .then(({ data, error }) => {
        if (data) {
          this.setGraph(data);
        }
      });
    }
  }

  setHistoryIndex(index, search) {
    this.setState({ 
      index: index,
      search: search
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

  setGraph(data) {
    data.graph.nodes.forEach(node => {
      var type = node.type;
      node['color'] = this.getColor(type);
    })
    this.setState({ 
      graph: { loading: false, nodes: data.graph.nodes, edges: data.graph.edges }
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
              {/* <br/>
              Search Query:
              <br/>
              {this.state.index} {this.state.search}
              <br/>
              Search History:
              <br/>
              {this.getStringifyValue(this.state.history)} */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Dashboard_Box;
