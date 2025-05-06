
import { useEffect, useRef } from 'react';

export function ApprovalTimeAnalysis() {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // In a real app, this would be implemented using recharts
    // For now, we create a simple visual representation
    const container = chartRef.current;
    container.innerHTML = '';
    
    const departments = [
      { name: "Single Dept", time: 94, color: '#9b87f5' },
      { name: "Two Depts", time: 138, color: '#7E69AB' },
      { name: "Three+ Depts", time: 186, color: '#6E59A5' },
    ];
    
    const maxTime = Math.max(...departments.map(d => d.time));
    const barHeight = 30;
    const gap = 20;
    const labelWidth = 100;
    const valueWidth = 50;
    
    // Create simple horizontal bar chart
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', `${departments.length * (barHeight + gap)}`);
    container.appendChild(svg);
    
    departments.forEach((dept, i) => {
      const y = i * (barHeight + gap);
      
      // Label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '0');
      text.setAttribute('y', y + barHeight / 2 + 5);
      text.setAttribute('font-size', '14');
      text.setAttribute('fill', '#666');
      text.textContent = dept.name;
      svg.appendChild(text);
      
      // Bar
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', `${labelWidth}`);
      rect.setAttribute('y', `${y}`);
      rect.setAttribute('width', `${(dept.time / maxTime) * (container.clientWidth - labelWidth - valueWidth)}`);
      rect.setAttribute('height', `${barHeight}`);
      rect.setAttribute('rx', '4');
      rect.setAttribute('fill', dept.color);
      svg.appendChild(rect);
      
      // Value
      const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueText.setAttribute('x', `${labelWidth + (dept.time / maxTime) * (container.clientWidth - labelWidth - valueWidth) + 10}`);
      valueText.setAttribute('y', y + barHeight / 2 + 5);
      valueText.setAttribute('font-size', '14');
      valueText.setAttribute('font-weight', 'bold');
      valueText.setAttribute('fill', '#333');
      valueText.textContent = `${dept.time} days`;
      svg.appendChild(valueText);
    });
    
  }, []);
  
  return (
    <div className="h-72 pt-4">
      <p className="text-sm text-gray-500 mb-6">Time to approval based on number of departments involved in review</p>
      <div ref={chartRef} className="h-full"></div>
    </div>
  );
}
