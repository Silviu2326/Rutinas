import React, { useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import FormulasSidebar from './FormulasSidebar';
import VariableNode from './VariableNode';
import variables from './variables'; // Importamos las variables
import { PlusCircle } from 'lucide-react'; // Icono

const nodeTypes = {
  variableNode: VariableNode,
};

const PeriodoCard = ({ periodo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);

  const [workflowVariables, setWorkflowVariables] = useState([]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddNode = (variable) => {
    const nodeId = `node-${Date.now()}`;
    const newNode = {
      id: nodeId,
      type: 'variableNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        name: variable.name,
        value: variable.value,
        isConditional: false,
        variable,
        onMakeConditional: handleMakeConditional,
        onAddVariableToPath: handleAddVariableToPath,
      },
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
    setIsSidebarOpen(false);
  };

  const handleMakeConditional = (variable) => {
    const { nodeId } = variable;
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === nodeId) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              isConditional: true,
              positiveCondition: variable.positiveCondition || { min: '', max: '' },
              negativeCondition: variable.negativeCondition || { min: '', max: '' },
            },
          };
          updateEdgesForNode(updatedNode);
          return updatedNode;
        }
        return node;
      })
    );
  };

  const updateEdgesForNode = (node) => {
    setEdges((prevEdges) =>
      prevEdges.map((edge) => {
        if (edge.source === node.id) {
          const edgeLabel =
            edge.sourceHandle === 'positive-output'
              ? `Positivo: ${node.data.positiveCondition.min} - ${node.data.positiveCondition.max}`
              : `Negativo: ${node.data.negativeCondition.min} - ${node.data.negativeCondition.max}`;
          return {
            ...edge,
            label: edgeLabel,
          };
        }
        return edge;
      })
    );
  };

  const handleUpdateVariable = (updatedVariable) => {
    const updatedVariables = { ...variables };
    Object.keys(updatedVariables).forEach((section) => {
      if (updatedVariables[section][updatedVariable.name] !== undefined) {
        updatedVariables[section][updatedVariable.name] = updatedVariable.value;
      }
    });
    console.log('Variables actualizadas:', updatedVariables);
  };

  const handleAddVariableToPath = (variable, path) => {
    setSelectedVariable(variable);
    setSelectedPath(path);
    setIsSidebarOpen(true);
  };

  const handleConnect = (params) => {
    const sourceNode = nodes.find((node) => node.id === params.source);
    if (sourceNode && sourceNode.data.isConditional) {
      const edgeLabel =
        params.sourceHandle === 'positive-output'
          ? `Positivo: ${sourceNode.data.positiveCondition.min} - ${sourceNode.data.positiveCondition.max}`
          : `Negativo: ${sourceNode.data.negativeCondition.min} - ${sourceNode.data.negativeCondition.max}`;
      const newEdge = {
        ...params,
        label: edgeLabel,
        animated: true,
        style: { stroke: '#0056b3' },
        labelStyle: { fill: 'blue', fontWeight: 700 },
        labelBgStyle: { fill: 'white', fillOpacity: 0.7, padding: '3px', borderRadius: '5px' },
      };
      setEdges((prevEdges) => addEdge(newEdge, prevEdges));
    } else {
      const newEdge = {
        ...params,
        animated: true,
        style: { stroke: '#0056b3' },
      };
      setEdges((prevEdges) => addEdge(newEdge, prevEdges));
    }
  };

  const handleAddToWorkflow = (variable) => {
    const newNode = {
      id: `workflow-node-${Date.now()}`,
      type: 'variableNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        name: variable.name,
        value: variable.value,
        isConditional: false,
        variable,
        onMakeConditional: handleMakeConditional,
        onAddVariableToPath: handleAddVariableToPath,
      },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
    setWorkflowVariables((prevWorkflowVariables) => [...prevWorkflowVariables, variable]);
  };

  const startWeek = periodo.start.weekIndex + 1;
  const startDay = `Día ${periodo.start.dayIndex + 1}`;
  const endWeek = periodo.end.weekIndex + 1;
  const endDay = `Día ${periodo.end.dayIndex + 1}`;

  return (
    <div
      className="formulas-periodo-container"
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '15px',
        padding: '25px',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
        maxWidth: '850px',
        width: '30vh',
        marginLeft: '2vh',
        marginRight: '2vh',
        position: 'relative',
      }}
    >
      <h3
        style={{
          fontSize: '2rem',
          color: '#343a40',
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: '20px',
          letterSpacing: '0.5px',
        }}
      >
        Semana {startWeek}, {startDay} a Semana {endWeek}, {endDay}
      </h3>
      <hr style={{ marginBottom: '25px', borderColor: '#dcdcdc' }} />
      <div
        style={{
          height: '25vh',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          backgroundColor: '#ffffff',
          boxShadow: '0 3px 15px rgba(0, 0, 0, 0.07)',
          padding: '15px',
          marginBottom: '25px',
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}  // Permitir alejar más el zoom
          maxZoom={4}    // Permitir acercar más el zoom
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <button
          className="formulas-add-variables-button"
          onClick={toggleSidebar}
          style={{
            padding: '12px 30px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#0056b3';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#007bff';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <PlusCircle size={22} />
          Añadir Variables
        </button>
      </div>
      {isSidebarOpen && (
        <FormulasSidebar
          mode="variables"
          availableVariables={Object.keys(variables).flatMap((section) =>
            Object.entries(variables[section]).map(([name, value]) => ({
              name,
              value,
            }))
          )}
          onSelectVariable={handleAddNode}
          onUpdateVariable={handleUpdateVariable}
          onAddToWorkflow={handleAddToWorkflow}
          onClose={toggleSidebar}
        />
      )}
    </div>
  );
};

export default PeriodoCard;
