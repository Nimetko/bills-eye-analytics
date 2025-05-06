
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

// Sample RDF data for testing
export const sampleRDFData = `@prefix ns1: <http://example.org/legislation/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

ns1:Bill1919 ns1:belongsTo ns1:Education ;
    ns1:currentHouse ns1:Commons ;
    ns1:hasStatus ns1:2nd_reading ;
    ns1:originatingHouse ns1:Commons .

ns1:Bill2862 ns1:belongsTo ns1:Education ;
    ns1:currentHouse ns1:Unassigned ;
    ns1:hasStatus ns1:Royal_Assent ;
    ns1:isAct true ;
    ns1:originatingHouse ns1:Commons .

ns1:Bill2868 ns1:belongsTo ns1:Education ;
    ns1:currentHouse ns1:Unassigned ;
    ns1:hasStatus ns1:Royal_Assent ;
    ns1:isAct true ;
    ns1:originatingHouse ns1:Lords .`;

// Export pre-processed data for demo
export const demoGraphData = parseRDFToGraphData(sampleRDFData);
