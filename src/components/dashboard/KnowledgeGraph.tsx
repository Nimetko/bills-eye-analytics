import { useRef, useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { demoGraphData, KnowledgeGraphData, Node, Edge } from '@/services/KnowledgeGraphData';
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";

// Force-directed graph simulation parameters
type NodeWithPosition = Node & {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type EdgeWithNodes = Edge & {
  sourceNode: NodeWithPosition;
  targetNode: NodeWithPosition;
};

export function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeTab, setActiveTab] = useState<string>("entities");
  const [graphData, setGraphData] = useState<KnowledgeGraphData>(demoGraphData);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // Load RDF data from file
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        import('@/services/KnowledgeGraphData').then(module => {
          const parsedData = module.parseRDFToGraphData(text);
          setGraphData(parsedData);
        });
      };
      reader.readAsText(file);
    }
  };
  
  // Generate colors based on node type
  const getNodeColor = (node: Node) => {
    switch (node.type) {
      case 'bill': return '#9b87f5';
      case 'house': return '#ff9580';
      case 'status': return '#82c0cc';
      case 'policyArea': return '#38b000';
      default: return '#adb5bd';
    }
  };
  
  const getNodeRadius = (node: Node) => {
    return node.type === 'bill' ? 12 : 8;
  };
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svgElement = svgRef.current;
    const width = svgElement.clientWidth;
    const height = svgElement.clientHeight;
    
    // Clear previous rendering
    while (svgElement.firstChild) {
      svgElement.removeChild(svgElement.firstChild);
    }
    
    // Create a simple force-directed graph (in a real app, use D3.js or a similar library)
    const nodes: NodeWithPosition[] = graphData.nodes.map(node => ({
      ...node,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0
    }));
    
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    
    const edges: EdgeWithNodes[] = graphData.edges.map(edge => ({
      ...edge,
      sourceNode: nodeMap.get(edge.source) as NodeWithPosition,
      targetNode: nodeMap.get(edge.target) as NodeWithPosition
    }));
    
    // Create a group for edges
    const edgesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svgElement.appendChild(edgesGroup);
    
    // Create edges
    edges.forEach(edge => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('stroke', '#ccc');
      line.setAttribute('stroke-width', '1');
      edgesGroup.appendChild(line);
      
      // Add edge label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('font-size', '8px');
      text.setAttribute('fill', '#666');
      text.textContent = edge.label;
      text.style.pointerEvents = 'none';
      edgesGroup.appendChild(text);
    });
    
    // Create a group for nodes
    const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svgElement.appendChild(nodesGroup);
    
    // Create nodes
    nodes.forEach(node => {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('cursor', 'pointer');
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', getNodeRadius(node).toString());
      circle.setAttribute('fill', getNodeColor(node));
      group.appendChild(circle);
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('font-size', '10px');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', '3px');
      text.setAttribute('fill', 'white');
      text.textContent = node.label.substring(0, 2);
      text.style.pointerEvents = 'none';
      group.appendChild(text);
      
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('font-size', '10px');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dy', '20px');
      label.setAttribute('fill', '#333');
      label.textContent = node.label;
      label.style.pointerEvents = 'none';
      group.appendChild(label);
      
      group.addEventListener('mouseover', () => setHoveredNode(node.id));
      group.addEventListener('mouseout', () => setHoveredNode(null));
      
      nodesGroup.appendChild(group);
      
      // Add node data as attributes for later reference
      group.dataset.nodeId = node.id;
    });
    
    // Simple physics simulation
    let animationId: number;
    const simulation = () => {
      // Update node positions with simple force-directed algorithm
      const repulsionForce = 0.8;
      const attractionForce = 0.01;
      const centerForce = 0.01;
      
      // Apply repulsion between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i];
          const nodeB = nodes[j];
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsionForce / (distance * distance);
          
          nodeA.vx -= dx * force / distance;
          nodeA.vy -= dy * force / distance;
          nodeB.vx += dx * force / distance;
          nodeB.vy += dy * force / distance;
        }
      }
      
      // Apply attraction along edges
      edges.forEach(edge => {
        const sourceNode = edge.sourceNode;
        const targetNode = edge.targetNode;
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        
        sourceNode.vx += dx * attractionForce;
        sourceNode.vy += dy * attractionForce;
        targetNode.vx -= dx * attractionForce;
        targetNode.vy -= dy * attractionForce;
      });
      
      // Apply center force
      nodes.forEach(node => {
        node.vx += (width / 2 - node.x) * centerForce;
        node.vy += (height / 2 - node.y) * centerForce;
      });
      
      // Update positions and apply dampening
      nodes.forEach(node => {
        node.vx *= 0.9;
        node.vy *= 0.9;
        node.x += node.vx;
        node.y += node.vy;
        
        // Keep nodes within bounds
        node.x = Math.max(20, Math.min(width - 20, node.x));
        node.y = Math.max(20, Math.min(height - 20, node.y));
      });
      
      // Update SVG elements
      const nodeElements = nodesGroup.childNodes;
      for (let i = 0; i < nodeElements.length; i++) {
        const nodeElement = nodeElements[i] as SVGGElement;
        const nodeId = nodeElement.dataset.nodeId;
        const node = nodeMap.get(nodeId!);
        if (node) {
          nodeElement.setAttribute('transform', `translate(${node.x},${node.y})`);
        }
      }
      
      // Update edge positions
      const edgeElements = edgesGroup.childNodes;
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const line = edgeElements[i * 2] as SVGLineElement;
        const text = edgeElements[i * 2 + 1] as SVGTextElement;
        
        line.setAttribute('x1', edge.sourceNode.x.toString());
        line.setAttribute('y1', edge.sourceNode.y.toString());
        line.setAttribute('x2', edge.targetNode.x.toString());
        line.setAttribute('y2', edge.targetNode.y.toString());
        
        // Position the label at the midpoint of the edge
        const midX = (edge.sourceNode.x + edge.targetNode.x) / 2;
        const midY = (edge.sourceNode.y + edge.targetNode.y) / 2;
        text.setAttribute('x', midX.toString());
        text.setAttribute('y', midY.toString());
      }
      
      animationId = requestAnimationFrame(simulation);
    };
    
    simulation();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [graphData, hoveredNode]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex space-x-2 mb-4">
        <Badge 
          onClick={() => setActiveTab("entities")} 
          className={`cursor-pointer ${activeTab === "entities" ? "bg-parliament-purple text-white" : "bg-gray-200 text-gray-800"}`}
        >
          Entities
        </Badge>
        <Badge 
          onClick={() => setActiveTab("relationships")} 
          className={`cursor-pointer ${activeTab === "relationships" ? "bg-parliament-purple text-white" : "bg-gray-200 text-gray-800"}`}
        >
          Relationships
        </Badge>
        
        <div className="flex-grow"></div>
        
        <div className="relative">
          <input
            type="file"
            id="rdf-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept=".ttl,.rdf,.n3"
          />
          <label htmlFor="rdf-upload">
            <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
              <span>
                <Upload size={14} />
                Load RDF
              </span>
            </Button>
          </label>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mb-4">
        Interactive visualization of bill relationships and policy connections
      </p>
      
      <div className="bg-gray-50 rounded-md flex-1 overflow-hidden">
        <svg 
          ref={svgRef} 
          width="100%" 
          height="100%" 
          className="w-full h-full"
        ></svg>
      </div>
      
      <div className="flex mt-3 flex-wrap gap-2 justify-center">
        <Badge className="bg-parliament-purple">Bills</Badge>
        <Badge className="bg-[#ff9580]">Houses</Badge>
        <Badge className="bg-[#82c0cc]">Status</Badge>
        <Badge className="bg-[#38b000]">Policy Areas</Badge>
        <Badge className="bg-[#adb5bd]">Properties</Badge>
      </div>
      
      <p className="text-sm text-gray-400 mt-2 text-center">
        Drag nodes to explore relationships. Upload RDF data to visualize custom graphs.
      </p>
    </div>
  );
}
