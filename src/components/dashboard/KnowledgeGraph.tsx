
import { useRef, useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";

export function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeTab, setActiveTab] = useState<string>("entities");

  useEffect(() => {
    if (!svgRef.current) return;
    
    // In a real application, this would create a D3 force-directed graph
    // For now, we'll just display a placeholder image
    const svgElement = svgRef.current;
    svgElement.innerHTML = '';
    
    // Sample circles and connections for a simple visual
    const radius = 10;
    const centerX = svgElement.clientWidth / 2;
    const centerY = svgElement.clientHeight / 2;
    
    // Create central node
    const centralCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centralCircle.setAttribute('cx', centerX.toString());
    centralCircle.setAttribute('cy', centerY.toString());
    centralCircle.setAttribute('r', (radius * 1.5).toString());
    centralCircle.setAttribute('fill', '#9b87f5');
    svgElement.appendChild(centralCircle);
    
    // Create satellite nodes
    const nodeCount = 12;
    const angleStep = (Math.PI * 2) / nodeCount;
    
    for (let i = 0; i < nodeCount; i++) {
      const angle = i * angleStep;
      const distance = 80 + Math.random() * 40;
      
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      // Connection line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', centerX.toString());
      line.setAttribute('y1', centerY.toString());
      line.setAttribute('x2', x.toString());
      line.setAttribute('y2', y.toString());
      line.setAttribute('stroke', '#ccc');
      line.setAttribute('stroke-width', '1');
      svgElement.appendChild(line);
      
      // Node circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toString());
      circle.setAttribute('cy', y.toString());
      circle.setAttribute('r', radius.toString());
      circle.setAttribute('fill', i % 3 === 0 ? '#9b87f5' : '#D6BCFA');
      svgElement.appendChild(circle);
    }
    
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex space-x-2 mb-4">
        <Badge 
          onClick={() => setActiveTab("entities")} 
          className={`cursor-pointer ${activeTab === "entities" ? "active-pill" : "bg-gray-200 text-gray-800"}`}
        >
          Entities
        </Badge>
        <Badge 
          onClick={() => setActiveTab("relationships")} 
          className={`cursor-pointer ${activeTab === "relationships" ? "active-pill" : "bg-gray-200 text-gray-800"}`}
        >
          Relationships
        </Badge>
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
      
      <p className="text-sm text-gray-400 mt-2 text-center">
        Drag nodes to explore relationships. Scroll to zoom in/out.
      </p>
    </div>
  );
}
