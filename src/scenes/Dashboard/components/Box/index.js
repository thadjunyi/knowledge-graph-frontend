import React from 'react';
import Graph from "react-graph-vis";
import { getGraph } from '../../../../services/ApiService';

class Dashboard_Box extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        monitor: false,
        properties: "",
        itemClicked: false,
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
            color: "#000000",
            width: 0.5
          },
          interaction: {
            hover: true,
          },
          height: "515px",
          width: "1220px",
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
        events: {
          select: (event) => {
            var { nodes, edges } = event;
            this.select(nodes, edges);
          },
        }
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.computeScreenSize();
    getGraph("")
    .then(({ data, error }) => {
      if (data) {
        this.setGraph(data);
      }
    });
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
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Dashboard_Box;
