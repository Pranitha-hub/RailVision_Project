import React from 'react';
import { getCrowdLevel } from '../data/stations';
import { Leaf, Users, AlertCircle } from 'lucide-react';

const CrowdBadge = ({ density }) => {
  const level = getCrowdLevel(density);
  
  const map = {
    low:      { cls: 'badge-sage',  label: 'Calm',    Icon: Leaf },
    moderate: { cls: 'badge-amber', label: 'Filling', Icon: Users },
    high:     { cls: 'badge-rose',  label: 'Very Busy', Icon: AlertCircle },
  };
  
  const { cls, label, Icon } = map[level] || map.low;
  
  return (
    <span className={`badge ${cls}`}>
      <Icon size={13} strokeWidth={2.5} />
      {label} · {density}%
    </span>
  );
};

export default CrowdBadge;
