import { useRef, useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { KnowledgeGraphData, Node, Edge, fetchGraphData, parseTripletToGraphData, TripletData } from '@/services/KnowledgeGraphData';
import { Button } from "@/components/ui/button";
import { FileText, Upload, RefreshCw, Database } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { fetchBills, convertBillsToGraphData } from '@/services/billsService';
import { useToast } from '@/components/ui/use-toast';

// Custom Parliament Bills Data
const customTripletData: TripletData[] = [{
  object: "2nd_reading",
  predicate: "hasStatus",
  subject: "Bill3919"
}, {
  object: "true",
  predicate: "isRejected",
  subject: "Bill3463"
}, {
  object: "true",
  predicate: "isRejected",
  subject: "Bill3574"
}, {
  object: "Commons",
  predicate: "currentHouse",
  subject: "Bill3919"
}, {
  object: "Commons",
  predicate: "originatingHouse",
  subject: "Bill3670"
}, {
  object: "Commons",
  predicate: "originatingHouse",
  subject: "Bill3673"
}, {
  object: "Commons",
  predicate: "currentHouse",
  subject: "Bill3574"
}, {
  object: "Commons",
  predicate: "originatingHouse",
  subject: "Bill3574"
}, {
  object: "2nd_reading",
  predicate: "hasStatus",
  subject: "Bill3670"
}, {
  object: "Education",
  predicate: "belongsTo",
  subject: "Bill3463"
}, {
  object: "Education",
  predicate: "belongsTo",
  subject: "Bill3673"
}, {
  object: "Education",
  predicate: "belongsTo",
  subject: "Bill3919"
}, {
  object: "Commons",
  predicate: "currentHouse",
  subject: "Bill3670"
}, {
  object: "2nd_reading",
  predicate: "hasStatus",
  subject: "Bill3463"
}, {
  object: "2nd_reading",
  predicate: "hasStatus",
  subject: "Bill3673"
}, {
  object: "true",
  predicate: "isRejected",
  subject: "Bill3919"
}, {
  object: "2nd_reading",
  predicate: "hasStatus",
  subject: "Bill3574"
}, {
  object: "Education",
  predicate: "belongsTo",
  subject: "Bill3670"
}, {
  object: "Education",
  predicate: "belongsTo",
  subject: "Bill3574"
}, {
  object: "true",
  predicate: "isRejected",
  subject: "Bill3670"
}, {
  object: "true",
  predicate: "isRejected",
  subject: "Bill3673"
}, {
  object: "Commons",
  predicate: "currentHouse",
  subject: "Bill3463"
}, {
  object: "Commons",
  predicate: "currentHouse",
  subject: "Bill3673"
}, {
  object: "Commons",
  predicate: "originatingHouse",
  subject: "Bill3463"
}, {
  object: "Commons",
  predicate: "originatingHouse",
  subject: "Bill3919"
}];

// Force-directed graph simulation parameters
type NodeWithPosition = Node & {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fixed?: boolean;
};
type EdgeWithNodes = Edge & {
  sourceNode: NodeWithPosition;
  targetNode: NodeWithPosition;
};
export function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeTab, setActiveTab] = useState<string>("entities");
  const [graphData, setGraphData] = useState<KnowledgeGraphData>({
    nodes: [],
    edges: []
  });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isUsingSupabase, setIsUsingSupabase] = useState<boolean>(false);
  const [isUsingServer, setIsUsingServer] = useState<boolean>(false);
  const [isUsingCustomData, setIsUsingCustomData] = useState<boolean>(true);
  const [simulationRunning, setSimulationRunning] = useState<boolean>(true);
  const {
    toast
  } = useToast();

  // Fetch bills from Supabase
  const {
    data: bills,
    isLoading: isLoadingSupabase,
    error: supabaseError,
    refetch
  } = useQuery({
    queryKey: ['bills'],
    queryFn: fetchBills,
    enabled: isUsingSupabase
  });

  // Fetch graph data directly from server
  const {
    data: serverGraphData,
    isLoading: isLoadingServer,
    error: serverError,
    refetch: refetchServer
  } = useQuery({
    queryKey: ['knowledgeGraph'],
    queryFn: fetchGraphData,
    enabled: isUsingServer
  });

  // Initialize with custom data
  useEffect(() => {
    if (isUsingCustomData) {
      const parsedData = parseTripletToGraphData(customTripletData);
      setGraphData(parsedData);
      toast({
        title: "Parliament Bills Data Loaded",
        description: `Loaded ${parsedData.nodes.length} nodes and ${parsedData.edges.length} edges from triplet data`
      });
    }
  }, [isUsingCustomData, toast]);

  // Convert bills data to graph format
  useEffect(() => {
    if (bills && isUsingSupabase) {
      const graphData = convertBillsToGraphData(bills);
      setGraphData(graphData);
    }
  }, [bills, isUsingSupabase]);

  // Set server graph data when available
  useEffect(() => {
    if (serverGraphData && isUsingServer) {
      setGraphData(serverGraphData);
    }
  }, [serverGraphData, isUsingServer]);

  // Load RDF data from file
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUsingSupabase(false);
    setIsUsingServer(false);
    setIsUsingCustomData(false);
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const text = e.target?.result as string;
        import('@/services/KnowledgeGraphData').then(module => {
          const parsedData = module.parseRDFToGraphData(text);
          setGraphData(parsedData);
          toast({
            title: "Data loaded",
            description: `Loaded ${parsedData.nodes.length} nodes and ${parsedData.edges.length} edges from file`
          });
        });
      };
      reader.readAsText(file);
    }
  };

  // Use custom triplet data
  const handleUseCustomData = () => {
    setIsUsingSupabase(false);
    setIsUsingServer(false);
    setIsUsingCustomData(true);
    const parsedData = parseTripletToGraphData(customTripletData);
    setGraphData(parsedData);
    toast({
      title: "Parliament Bills Data Loaded",
      description: `Loaded ${parsedData.nodes.length} nodes and ${parsedData.edges.length} edges from triplet data`
    });
  };

  // Switch to Supabase data
  const handleUseSupabase = () => {
    setIsUsingSupabase(true);
    setIsUsingServer(false);
    setIsUsingCustomData(false);
    refetch();
  };

  // Switch to Server data
  const handleUseServerData = () => {
    setIsUsingServer(true);
    setIsUsingSupabase(false);
    setIsUsingCustomData(false);
    refetchServer();
  };

  // Toggle simulation
  const toggleSimulation = () => {
    setSimulationRunning(!simulationRunning);
  };

  // Generate colors based on node type
  const getNodeColor = (node: Node) => {
    switch (node.type) {
      case 'bill':
        return '#9b87f5';
      case 'house':
        return '#ff9580';
      case 'status':
        return '#82c0cc';
      case 'policyArea':
        return '#38b000';
      default:
        return '#adb5bd';
    }
  };
  const getNodeRadius = (node: Node) => {
    return node.type === 'bill' ? 15 : 10;
  };

  // Force-directed graph rendering
  useEffect(() => {
    if (!svgRef.current || graphData.nodes.length === 0) return;
    const svgElement = svgRef.current;
    const width = svgElement.clientWidth;
    const height = svgElement.clientHeight;

    // Clear previous rendering
    while (svgElement.firstChild) {
      svgElement.removeChild(svgElement.firstChild);
    }

    // Create a simple force-directed graph
    const nodes: NodeWithPosition[] = graphData.nodes.map(node => ({
      ...node,
      x: Math.random() * width * 0.8 + width * 0.1,
      // Better initial distribution
      y: Math.random() * height * 0.8 + height * 0.1,
      vx: 0,
      vy: 0,
      fixed: false
    }));
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    const edges: EdgeWithNodes[] = graphData.edges.filter(edge => nodeMap.has(edge.source) && nodeMap.has(edge.target)).map(edge => ({
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
      line.setAttribute('opacity', '0.7');
      edgesGroup.appendChild(line);

      // Add edge label - only show on hover to reduce clutter
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('font-size', '9px');
      text.setAttribute('fill', '#666');
      text.setAttribute('opacity', '0');
      text.textContent = edge.label;
      text.style.pointerEvents = 'none';
      edgesGroup.appendChild(text);

      // Show label on hover
      line.addEventListener('mouseover', () => {
        text.setAttribute('opacity', '1');
      });
      line.addEventListener('mouseout', () => {
        text.setAttribute('opacity', '0');
      });
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

      // Add subtle shadow effect
      const glow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
      glow.setAttribute('dx', '0');
      glow.setAttribute('dy', '0');
      glow.setAttribute('stdDeviation', '2');
      glow.setAttribute('flood-color', getNodeColor(node));
      glow.setAttribute('flood-opacity', '0.3');
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.setAttribute('id', `glow-${node.id}`);
      filter.appendChild(glow);
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.appendChild(filter);
      group.appendChild(defs);
      circle.setAttribute('filter', `url(#glow-${node.id})`);
      group.appendChild(circle);

      // Add label to circle - first letters only for cleaner look
      if (node.type === 'bill') {
        const innerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        innerText.setAttribute('font-size', '10px');
        innerText.setAttribute('text-anchor', 'middle');
        innerText.setAttribute('dy', '3px');
        innerText.setAttribute('fill', 'white');
        innerText.setAttribute('font-weight', 'bold');
        innerText.textContent = node.label && node.label.length > 0 ? node.label.split(' ').map(word => word[0]).join('').substring(0, 2) : '';
        innerText.style.pointerEvents = 'none';
        group.appendChild(innerText);
      }

      // Add full label below node
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('font-size', node.type === 'bill' ? '10px' : '9px');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dy', node.type === 'bill' ? '24px' : '18px');
      label.setAttribute('fill', '#333');

      // Truncate long labels
      const maxLength = node.type === 'bill' ? 20 : 12;
      label.textContent = node.label && node.label.length > maxLength ? node.label.substring(0, maxLength) + '...' : node.label || '';
      label.style.pointerEvents = 'none';
      label.setAttribute('opacity', '0.8');
      group.appendChild(label);

      // Hover effects
      group.addEventListener('mouseover', () => {
        setHoveredNode(node.id);
        circle.setAttribute('r', (getNodeRadius(node) * 1.2).toString());
        label.setAttribute('font-weight', 'bold');
        label.setAttribute('opacity', '1');
      });
      group.addEventListener('mouseout', () => {
        setHoveredNode(null);
        circle.setAttribute('r', getNodeRadius(node).toString());
        label.setAttribute('font-weight', 'normal');
        label.setAttribute('opacity', '0.8');
      });

      // Double-click to fix/unfix node position
      group.addEventListener('dblclick', () => {
        node.fixed = !node.fixed;
        circle.setAttribute('stroke', node.fixed ? '#333' : 'none');
        circle.setAttribute('stroke-width', node.fixed ? '2' : '0');
      });

      // Dragging functionality
      let isDragging = false;
      group.addEventListener('mousedown', e => {
        e.preventDefault();
        isDragging = true;
        const onMouseMove = (moveEvent: MouseEvent) => {
          if (!isDragging) return;
          const rect = svgElement.getBoundingClientRect();
          const x = moveEvent.clientX - rect.left;
          const y = moveEvent.clientY - rect.top;
          node.x = x;
          node.y = y;
          node.fixed = true;
          circle.setAttribute('stroke', '#333');
          circle.setAttribute('stroke-width', '2');

          // Update node position
          group.setAttribute('transform', `translate(${x},${y})`);

          // Update connected edges
          edges.forEach(edge => {
            if (edge.sourceNode === node || edge.targetNode === node) {
              const line = edgesGroup.childNodes[edges.indexOf(edge) * 2] as SVGLineElement;
              const text = edgesGroup.childNodes[edges.indexOf(edge) * 2 + 1] as SVGTextElement;
              line.setAttribute('x1', edge.sourceNode.x.toString());
              line.setAttribute('y1', edge.sourceNode.y.toString());
              line.setAttribute('x2', edge.targetNode.x.toString());
              line.setAttribute('y2', edge.targetNode.y.toString());

              // Update label position
              const midX = (edge.sourceNode.x + edge.targetNode.x) / 2;
              const midY = (edge.sourceNode.y + edge.targetNode.y) / 2;
              text.setAttribute('x', midX.toString());
              text.setAttribute('y', midY.toString());
            }
          });
        };
        const onMouseUp = () => {
          isDragging = false;
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });
      nodesGroup.appendChild(group);

      // Add node data as attributes for later reference
      group.dataset.nodeId = node.id;
    });

    // Simple physics simulation - with reduced forces for stability
    let animationId: number;
    const simulation = () => {
      if (!simulationRunning) {
        animationId = requestAnimationFrame(simulation);
        return;
      }

      // Update node positions with simple force-directed algorithm
      // Reduced force values for more stability
      const repulsionForce = 0.4; // Reduced from 0.8
      const attractionForce = 0.005; // Reduced from 0.01
      const centerForce = 0.002; // Reduced from 0.01

      // Apply repulsion between nodes
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        if (nodeA.fixed) continue; // Skip fixed nodes

        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          if (nodeB.fixed) continue; // Skip fixed nodes

          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;

          // Apply a minimum distance to prevent extreme forces
          const effectiveDistance = Math.max(distance, 40);
          const force = repulsionForce / (effectiveDistance * effectiveDistance);
          nodeA.vx -= dx * force / effectiveDistance;
          nodeA.vy -= dy * force / effectiveDistance;
          nodeB.vx += dx * force / effectiveDistance;
          nodeB.vy += dy * force / effectiveDistance;
        }
      }

      // Apply attraction along edges
      edges.forEach(edge => {
        const sourceNode = edge.sourceNode;
        const targetNode = edge.targetNode;

        // Skip if either node is fixed
        if (sourceNode.fixed && targetNode.fixed) return;
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        // Apply optimal distance for edge length
        const optimalDistance = 120; // Desired distance between connected nodes
        const forceFactor = (distance - optimalDistance) * 0.001;
        if (!sourceNode.fixed) {
          sourceNode.vx += dx * forceFactor;
          sourceNode.vy += dy * forceFactor;
        }
        if (!targetNode.fixed) {
          targetNode.vx -= dx * forceFactor;
          targetNode.vy -= dy * forceFactor;
        }
      });

      // Apply center force - gently pull nodes toward center
      nodes.forEach(node => {
        if (node.fixed) return; // Skip fixed nodes

        node.vx += (width / 2 - node.x) * centerForce;
        node.vy += (height / 2 - node.y) * centerForce;
      });

      // Update positions and apply dampening
      nodes.forEach(node => {
        if (node.fixed) return; // Skip fixed nodes

        // Strong dampening for more stability
        node.vx *= 0.7; // More dampening (was 0.9)
        node.vy *= 0.7;

        // Apply velocity with limits
        const maxVelocity = 2.0; // Limit maximum velocity
        node.vx = Math.max(-maxVelocity, Math.min(maxVelocity, node.vx));
        node.vy = Math.max(-maxVelocity, Math.min(maxVelocity, node.vy));
        node.x += node.vx;
        node.y += node.vy;

        // Keep nodes within bounds
        node.x = Math.max(30, Math.min(width - 30, node.x));
        node.y = Math.max(30, Math.min(height - 30, node.y));
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
        const lineIndex = i * 2;
        const textIndex = i * 2 + 1;
        if (lineIndex < edgeElements.length && textIndex < edgeElements.length) {
          const line = edgeElements[lineIndex] as SVGLineElement;
          const text = edgeElements[textIndex] as SVGTextElement;
          line.setAttribute('x1', edge.sourceNode.x.toString());
          line.setAttribute('y1', edge.sourceNode.y.toString());
          line.setAttribute('x2', edge.targetNode.x.toString());
          line.setAttribute('y2', edge.targetNode.y.toString());

          // Position the label at the midpoint of the edge
          const midX = (edge.sourceNode.x + edge.targetNode.x) / 2;
          const midY = (edge.sourceNode.y + edge.targetNode.y) / 2;
          text.setAttribute('x', midX.toString());
          text.setAttribute('y', midY.toString());

          // Highlight connected edges when a node is hovered
          if (hoveredNode && (edge.sourceNode.id === hoveredNode || edge.targetNode.id === hoveredNode)) {
            line.setAttribute('stroke', '#666');
            line.setAttribute('stroke-width', '2');
            text.setAttribute('opacity', '1');
          } else {
            line.setAttribute('stroke', '#ccc');
            line.setAttribute('stroke-width', '1');
            text.setAttribute('opacity', '0');
          }
        }
      }
      animationId = requestAnimationFrame(simulation);
    };
    simulation();
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [graphData, hoveredNode, simulationRunning]);
  const isLoading = isLoadingSupabase || isLoadingServer || graphData.nodes.length === 0 && isUsingCustomData;
  const error = supabaseError || serverError;
  return <div className="h-full flex flex-col">
      <div className="flex space-x-2 mb-4">
        <Badge onClick={() => setActiveTab("entities")} className={`cursor-pointer ${activeTab === "entities" ? "bg-parliament-purple text-white" : "bg-gray-200 text-gray-800"}`}>
          Entities
        </Badge>
        <Badge onClick={() => setActiveTab("relationships")} className={`cursor-pointer ${activeTab === "relationships" ? "bg-parliament-purple text-white" : "bg-gray-200 text-gray-800"}`}>
          Relationships
        </Badge>
        
        <div className="flex-grow"></div>
        
        
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleUseCustomData} disabled={isLoading}>
            <Database size={14} />
            {isUsingCustomData ? "Refresh Bills Data" : "Use Bills Data"}
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleUseServerData} disabled={isLoading}>
            <RefreshCw size={14} className={isLoadingServer ? "animate-spin" : ""} />
            {isUsingServer ? "Refresh Server Data" : "Use Server Data"}
          </Button>
          
          
          
          <div className="relative">
            <input type="file" id="rdf-upload" className="hidden" onChange={handleFileUpload} accept=".ttl,.rdf,.n3" />
            <label htmlFor="rdf-upload">
              <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
                
              </Button>
            </label>
          </div>
        </div>
      </div>
      
      {error && <div className="text-red-500 mb-4">
          Error loading data: {(error as Error).message}
        </div>}
      
      {isLoading ? <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-parliament-purple"></div>
        </div> : <>
          <p className="text-sm text-gray-500 mb-4">
            {isUsingSupabase ? "Interactive visualization of parliamentary bills from Supabase database" : isUsingServer ? "Interactive visualization of knowledge graph from server API" : isUsingCustomData ? "Interactive visualization of custom Parliament Bills data" : "Interactive visualization of bills and their relationships"}
            {!simulationRunning && " (paused)"}
          </p>
          
          <div className="bg-gray-50 rounded-md flex-1 overflow-hidden">
            <svg ref={svgRef} width="100%" height="100%" className="w-full h-full"></svg>
          </div>
          
          <div className="flex mt-3 flex-wrap gap-2 justify-center">
            <Badge className="bg-[#9b87f5]">Bills</Badge>
            <Badge className="bg-[#ff9580]">Houses</Badge>
            <Badge className="bg-[#82c0cc]">Status</Badge>
            <Badge className="bg-[#38b000]">Policy Areas</Badge>
            <Badge className="bg-[#adb5bd]">Properties</Badge>
          </div>
          
          <p className="text-xs text-gray-400 mt-2 text-center">
            Hover over nodes and connections to explore relationships. Double-click any node to fix its position.
          </p>
        </>}
    </div>;
}