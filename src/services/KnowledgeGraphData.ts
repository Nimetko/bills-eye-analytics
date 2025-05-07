export interface Node {
  id: string;
  label: string;
  type: 'bill' | 'house' | 'status' | 'policyArea' | 'property';
}

export interface Edge {
  source: string;
  target: string;
  label: string;
}

export interface KnowledgeGraphData {
  nodes: Node[];
  edges: Edge[];
}

// This function will parse RDF Turtle format and convert to our graph data format
export function parseRDFToGraphData(rdfData: string): KnowledgeGraphData {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const nodesMap = new Map<string, Node>();
  
  // Very simple parser for the RDF Turtle format
  // In production, you'd want to use a proper RDF parser library
  const lines = rdfData.split('\n').filter(line => line.trim() !== '' && !line.startsWith('@prefix'));
  
  let currentSubject = '';
  
  for (const line of lines) {
    if (line.includes(' ns1:')) {
      if (!line.startsWith(' ')) {
        // This is a subject line
        const subjectParts = line.split(' ');
        currentSubject = subjectParts[0].replace('ns1:', '');
        
        // Add subject node if it doesn't exist
        if (!nodesMap.has(currentSubject)) {
          const node: Node = { 
            id: currentSubject, 
            label: currentSubject,
            type: currentSubject.startsWith('Bill') ? 'bill' : 'property'
          };
          nodesMap.set(currentSubject, node);
          nodes.push(node);
        }
        
        // Process first predicate on the same line
        if (subjectParts.length > 2) {
          const predicate = subjectParts[1].replace('ns1:', '');
          const object = subjectParts[2].replace('ns1:', '').replace(' ;', '').replace(' .', '');
          
          // Add object node if it doesn't exist
          if (!nodesMap.has(object)) {
            let type: Node['type'] = 'property';
            if (object === 'Commons' || object === 'Lords' || object === 'Unassigned') {
              type = 'house';
            } else if (object.includes('reading') || object === 'Royal_Assent') {
              type = 'status';
            } else if (['Education', 'Health', 'Defense', 'Economy', 'Environment', 'Transport'].includes(object)) {
              type = 'policyArea';
            }
            
            const node: Node = { id: object, label: object.replace('_', ' '), type };
            nodesMap.set(object, node);
            nodes.push(node);
          }
          
          // Add the edge
          edges.push({
            source: currentSubject,
            target: object,
            label: predicate
          });
        }
      } else {
        // This is a continuation of a subject
        const parts = line.trim().split(' ');
        const predicate = parts[0].replace('ns1:', '');
        let object = parts[1].replace('ns1:', '').replace(' ;', '').replace(' .', '');
        
        // Handle boolean values
        if (object === 'true' || object === 'false') {
          object = predicate + '_' + object;
          if (!nodesMap.has(object)) {
            const node: Node = { id: object, label: object, type: 'property' };
            nodesMap.set(object, node);
            nodes.push(node);
          }
        } else {
          // Add object node if it doesn't exist
          if (!nodesMap.has(object)) {
            let type: Node['type'] = 'property';
            if (object === 'Commons' || object === 'Lords' || object === 'Unassigned') {
              type = 'house';
            } else if (object.includes('reading') || object === 'Royal_Assent') {
              type = 'status';
            } else if (['Education', 'Health', 'Defense', 'Economy', 'Environment', 'Transport'].includes(object)) {
              type = 'policyArea';
            }
            
            const node: Node = { id: object, label: object.replace('_', ' '), type };
            nodesMap.set(object, node);
            nodes.push(node);
          }
        }
        
        // Add the edge
        edges.push({
          source: currentSubject,
          target: object,
          label: predicate
        });
      }
    }
  }
  
  return { nodes, edges };
}

// Structured mock data for the knowledge graph visualization
export const mockGraphData: KnowledgeGraphData = {
  nodes: [
    // Bills
    { id: "bill-1", label: "Education Reform Act", type: "bill" },
    { id: "bill-2", label: "Healthcare Amendment", type: "bill" },
    { id: "bill-3", label: "Environmental Protection", type: "bill" },
    { id: "bill-4", label: "Digital Rights Act", type: "bill" },
    { id: "bill-5", label: "Transportation Funding", type: "bill" },
    
    // Houses
    { id: "commons", label: "Commons", type: "house" },
    { id: "lords", label: "Lords", type: "house" },
    
    // Policy Areas
    { id: "education", label: "Education", type: "policyArea" },
    { id: "health", label: "Health", type: "policyArea" },
    { id: "environment", label: "Environment", type: "policyArea" },
    { id: "technology", label: "Technology", type: "policyArea" },
    { id: "transport", label: "Transport", type: "policyArea" },
    
    // Statuses
    { id: "1st_reading", label: "1st Reading", type: "status" },
    { id: "2nd_reading", label: "2nd Reading", type: "status" },
    { id: "committee", label: "Committee Stage", type: "status" },
    { id: "royal_assent", label: "Royal Assent", type: "status" },
    
    // Properties
    { id: "isAct_true", label: "Act", type: "property" },
  ],
  edges: [
    // Bill 1 connections
    { source: "bill-1", target: "education", label: "belongsTo" },
    { source: "bill-1", target: "commons", label: "currentHouse" },
    { source: "bill-1", target: "commons", label: "originatingHouse" },
    { source: "bill-1", target: "2nd_reading", label: "hasStatus" },
    
    // Bill 2 connections
    { source: "bill-2", target: "health", label: "belongsTo" },
    { source: "bill-2", target: "lords", label: "currentHouse" },
    { source: "bill-2", target: "lords", label: "originatingHouse" },
    { source: "bill-2", target: "committee", label: "hasStatus" },
    
    // Bill 3 connections
    { source: "bill-3", target: "environment", label: "belongsTo" },
    { source: "bill-3", target: "commons", label: "currentHouse" },
    { source: "bill-3", target: "lords", label: "originatingHouse" },
    { source: "bill-3", target: "royal_assent", label: "hasStatus" },
    { source: "bill-3", target: "isAct_true", label: "isAct" },
    
    // Bill 4 connections
    { source: "bill-4", target: "technology", label: "belongsTo" },
    { source: "bill-4", target: "commons", label: "currentHouse" },
    { source: "bill-4", target: "commons", label: "originatingHouse" },
    { source: "bill-4", target: "1st_reading", label: "hasStatus" },
    
    // Bill 5 connections
    { source: "bill-5", target: "transport", label: "belongsTo" },
    { source: "bill-5", target: "lords", label: "currentHouse" },
    { source: "bill-5", target: "lords", label: "originatingHouse" },
    { source: "bill-5", target: "royal_assent", label: "hasStatus" },
    { source: "bill-5", target: "isAct_true", label: "isAct" },
  ]
};

// Export pre-processed data for demo
export const demoGraphData = mockGraphData;
