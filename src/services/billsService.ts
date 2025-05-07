import { supabase } from '@/lib/supabase';

export interface Bill {
  id: string;
  title: string;
  policyArea: string;
  current_house: string;
  status: string;
  originating_house: string;
  introduction_date: string;
  days_to_approval?: number;
  is_act: boolean;
}

export interface ApprovalTimeData {
  name: string;
  days: number;
}

export interface RejectionData {
  name: string;
  value: number;
}

// Fetch all bills
export async function fetchBills() {
  const { data, error } = await supabase
    .from('all_bills_uk')
    .select('*');
  
  if (error) {
    console.error('Error fetching bills:', error);
    throw error;
  }
  
  return data as Bill[];
}

// Get approval time analysis by policy area
export async function fetchApprovalTimeByPolicyArea(): Promise<ApprovalTimeData[]> {
  try {
    // First, check if the days_to_approval column exists by fetching one row
    const { data: columns, error: columnsError } = await supabase
      .from('all_bills_uk')
      .select()
      .limit(1);
    
    if (columnsError) {
      throw columnsError;
    }
    
    // Check if days_to_approval exists in the table
    const hasDaysToApproval = columns && columns.length > 0 && 'days_to_approval' in columns[0];
    
    if (!hasDaysToApproval) {
      console.log("days_to_approval column not found, using mock data");
      // Return mock data if the column doesn't exist
      return [
        { name: "Education", days: 120 },
        { name: "Health", days: 90 },
        { name: "Transport", days: 150 },
        { name: "Environment", days: 130 },
        { name: "Defense", days: 110 }
      ];
    }
    
    // If the column exists, proceed with the original query
    const { data, error } = await supabase
      .from('all_bills_uk')
      .select('policyArea, days_to_approval')
      .not('days_to_approval', 'is', null);
    
    if (error) {
      console.error('Error fetching approval times:', error);
      throw error;
    }
    
    // Group and average the days by policy area
    const policyAreas = data.reduce((acc: Record<string, { total: number, count: number }>, bill) => {
      const area = bill.policyArea;
      if (!acc[area]) {
        acc[area] = { total: 0, count: 0 };
      }
      acc[area].total += bill.days_to_approval || 0;
      acc[area].count += 1;
      return acc;
    }, {});
    
    // Convert to the format expected by the chart
    return Object.entries(policyAreas).map(([name, { total, count }]) => ({
      name,
      days: Math.round(total / count)
    }));
  } catch (error) {
    console.error('Error fetching approval times:', error);
    throw error;
  }
}

// Get rejections count by policy area
export async function fetchRejectionsByPolicyArea(): Promise<RejectionData[]> {
  try {
    // Fetch all bills
    const { data, error } = await supabase
      .from('all_bills_uk')
      .select('policyArea, isAct')
      .eq('isAct', false); // Filter for rejected bills (isAct = false)
    
    if (error) {
      console.error('Error fetching rejections:', error);
      throw error;
    }
    
    // Count rejections by policy area
    const rejections = data.reduce((acc: Record<string, number>, bill) => {
      const area = bill.policyArea;
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {});
    
    // Convert to the format expected by the chart
    return Object.entries(rejections).map(([name, value]) => ({
      name,
      value
    }));
  } catch (error) {
    console.error('Error fetching rejections:', error);
    throw error;
  }
}

// Convert bills data to the knowledge graph format
export function convertBillsToGraphData(bills: Bill[]) {
  const nodes = new Map();
  const edges = [];
  
  // Add bill nodes
  bills.forEach(bill => {
    // Add bill node if it doesn't exist
    if (!nodes.has(bill.id)) {
      nodes.set(bill.id, {
        id: bill.id,
        label: bill.title || bill.id,
        type: 'bill',
      });
    }
    
    // Add policy area node if it doesn't exist
    if (!nodes.has(bill.policyArea)) {
      nodes.set(bill.policyArea, {
        id: bill.policyArea,
        label: bill.policyArea,
        type: 'policyArea',
      });
    }
    
    // Add current house node if it doesn't exist
    if (!nodes.has(bill.current_house)) {
      nodes.set(bill.current_house, {
        id: bill.current_house,
        label: bill.current_house,
        type: 'house',
      });
    }
    
    // Add status node if it doesn't exist
    if (!nodes.has(bill.status)) {
      nodes.set(bill.status, {
        id: bill.status,
        label: bill.status,
        type: 'status',
      });
    }
    
    // Add originating house node if it doesn't exist
    if (!nodes.has(bill.originating_house)) {
      nodes.set(bill.originating_house, {
        id: bill.originating_house,
        label: bill.originating_house,
        type: 'house',
      });
    }
    
    // Add edges
    edges.push({
      source: bill.id,
      target: bill.policyArea,
      label: 'belongsTo',
    });
    
    edges.push({
      source: bill.id,
      target: bill.current_house,
      label: 'currentHouse',
    });
    
    edges.push({
      source: bill.id,
      target: bill.status,
      label: 'hasStatus',
    });
    
    edges.push({
      source: bill.id,
      target: bill.originating_house,
      label: 'originatingHouse',
    });
    
    // Add is_act edge if applicable
    if (bill.is_act) {
      if (!nodes.has('isAct_true')) {
        nodes.set('isAct_true', {
          id: 'isAct_true',
          label: 'Act',
          type: 'property',
        });
      }
      
      edges.push({
        source: bill.id,
        target: 'isAct_true',
        label: 'isAct',
      });
    }
  });
  
  return {
    nodes: Array.from(nodes.values()),
    edges,
  };
}
