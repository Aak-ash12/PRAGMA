import { useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Node, 
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  { id: '1', position: { x: 400, y: 40 }, data: { label: 'LLM Coordinator' }, type: 'default', style: { background: '#7C3AED', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '10px 20px', fontWeight: 'bold' } },
  { id: '2', position: { x: 400, y: 140 }, data: { label: 'Government Agent' }, style: { background: '#2563EB', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' } },
  { id: '3', position: { x: 150, y: 240 }, data: { label: 'Emergency Agent' }, style: { background: '#EF4444', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' } },
  { id: '4', position: { x: 650, y: 240 }, data: { label: 'Traffic Agent' }, style: { background: '#F59E0B', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' } },
  { id: '5', position: { x: 50, y: 340 }, data: { label: 'Hospital Agent' }, style: { background: '#10B981', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' } },
  { id: '6', position: { x: 220, y: 340 }, data: { label: 'Citizen Agent' }, style: { background: '#06B6D4', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' } },
  { id: '7', position: { x: 530, y: 340 }, data: { label: 'Water Agent' }, style: { background: '#3B82F6', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' } },
  { id: '8', position: { x: 750, y: 340 }, data: { label: 'Electricity Agent' }, style: { background: '#EAB308', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' } },
  { id: '9', position: { x: 380, y: 440 }, data: { label: 'Agriculture Agent' }, style: { background: '#84CC16', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' } },
  { id: '10', position: { x: 580, y: 440 }, data: { label: 'School Agent' }, style: { background: '#EC4899', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' } },
];

const initialEdges: Edge[] = [
  { id: 'e2-1', source: '2', target: '1', animated: true, style: { stroke: '#7C3AED', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#7C3AED' } },
  { id: 'e3-2', source: '3', target: '2', animated: true, style: { stroke: '#2563EB', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#2563EB' } },
  { id: 'e4-2', source: '4', target: '2', animated: true, style: { stroke: '#2563EB', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#2563EB' } },
  { id: 'e5-3', source: '5', target: '3', animated: true, style: { stroke: '#EF4444', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' } },
  { id: 'e6-5', source: '6', target: '5', animated: true, style: { stroke: '#10B981', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' } },
  { id: 'e7-9', source: '7', target: '9', animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' } },
  { id: 'e8-4', source: '8', target: '4', animated: true, style: { stroke: '#EAB308', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#EAB308' } },
  { id: 'e9-2', source: '9', target: '2', animated: true, style: { stroke: '#84CC16', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#84CC16' } },
  { id: 'e10-2', source: '10', target: '2', animated: true, style: { stroke: '#EC4899', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#EC4899' } },
];

export default function AgentNetwork({ onSelectAgent }: { onSelectAgent: (name: string) => void }) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((_: any, node: Node) => {
    onSelectAgent(node.data.label);
  }, [onSelectAgent]);

  return (
    <div className="glass-card w-full h-full p-2 relative overflow-hidden flex flex-col">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-white font-poppins font-medium">AI Agent Network</h3>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Live Neural Communication</p>
      </div>
      <div className="flex-1 w-full h-full rounded-xl overflow-hidden mt-10 border border-white/5 bg-black/20">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-right"
        >
          <Background color="#ffffff" gap={16} size={1} opacity={0.05} />
          <Controls className="bg-black/50 border-white/10 fill-white" />
        </ReactFlow>
      </div>
    </div>
  );
}
