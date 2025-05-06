
import { useEffect, useRef } from 'react';

export function RejectionsByPolicyArea() {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // In a real app, this would be implemented using recharts
    // For now, we create a simple visual representation
    const container = chartRef.current;
    container.innerHTML = '';
    
    const policyAreas = [
      { name: "Environment", rate: 37 },
      { name: "Healthcare", rate: 29 },
      { name: "Education", rate: 22 },
      { name: "Transportation", rate: 18 },
      { name: "Security", rate: 15 },
      { name: "Housing", rate: 12 },
    ];
    
    // Create simple bar chart
    policyAreas.forEach(area => {
      const barContainer = document.createElement('div');
      barContainer.className = 'flex items-center mb-3';
      
      const label = document.createElement('div');
      label.className = 'w-24 text-sm text-gray-600';
      label.textContent = area.name;
      
      const barWrapper = document.createElement('div');
      barWrapper.className = 'flex-1 bg-gray-200 rounded-full h-2 ml-2';
      
      const bar = document.createElement('div');
      bar.className = 'bg-parliament-purple h-2 rounded-full';
      bar.style.width = `${area.rate}%`;
      
      const value = document.createElement('div');
      value.className = 'w-12 text-right text-sm font-medium text-gray-600 ml-2';
      value.textContent = `${area.rate}%`;
      
      barWrapper.appendChild(bar);
      barContainer.appendChild(label);
      barContainer.appendChild(barWrapper);
      barContainer.appendChild(value);
      container.appendChild(barContainer);
    });
    
  }, []);
  
  return (
    <div className="h-72">
      <div ref={chartRef} className="h-full"></div>
    </div>
  );
}
